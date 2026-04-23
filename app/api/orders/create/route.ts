import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { CreateOrderPayload } from "@/types/index";

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // =========================
    // 1. AUTH CHECK
    // =========================
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // =========================
    // 2. PARSE PAYLOAD
    // =========================
    const payload: CreateOrderPayload = await req.json();
    const { cart_items, address_id, subtotal, shipping, tax, total } = payload;

    if (!cart_items?.length || !address_id) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // =========================
    // 3. VERIFY ADDRESS
    // =========================
    const { data: address, error: addrErr } = await supabase
      .from("addresses")
      .select("id")
      .eq("id", address_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (addrErr) {
      return NextResponse.json(
        { error: "Address fetch failed" },
        { status: 500 },
      );
    }

    if (!address) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    // =========================
    // 4. EXTRACT PRODUCT IDS
    // =========================
    const productIds = cart_items
      .map((i) => i.product_id)
      .filter((id) => typeof id === "string" && id.length > 0);

    if (productIds.length === 0) {
      return NextResponse.json(
        { error: "No valid product IDs" },
        { status: 400 },
      );
    }

    // =========================
    // 5. FETCH PRODUCTS
    // =========================
    const { data: products, error: productsErr } = await supabase
      .from("products")
      .select("id, name, images")
      .in("id", productIds);

    if (productsErr || !products) {
      console.error("❌ PRODUCT FETCH ERROR FULL:", {
        message: productsErr?.message,
        details: productsErr?.details,
        hint: productsErr?.hint,
        code: productsErr?.code,
      });
      return NextResponse.json(
        { error: "Failed to fetch products" },
        { status: 500 },
      );
    }

    // =========================
    // 6. VALIDATE PRODUCTS
    // =========================
    const productMap = new Map(products.map((p) => [String(p.id), p]));

    const missingProducts = productIds.filter(
      (id) => !productMap.has(String(id)),
    );

    if (missingProducts.length > 0) {
      return NextResponse.json(
        { error: "Some products are invalid" },
        { status: 400 },
      );
    }

    // =========================
    // 7. CREATE ORDER
    // =========================
    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        address_id,
        status: "pending",
        subtotal,
        shipping,
        tax,
        total,
      })
      .select()
      .single();

    if (orderErr || !order) {
      return NextResponse.json(
        { error: orderErr?.message || "Order creation failed" },
        { status: 500 },
      );
    }

    // =========================
    // 8. CREATE ORDER ITEMS SNAPSHOT
    // =========================
    const orderItems = cart_items.map((item) => {
      const product = productMap.get(String(item.product_id))!;

      return {
        order_id: order.id,
        product_id: item.product_id,
        product_name: product.name,
        product_image: product.images,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
      };
    });

    // =========================
    // 9. INSERT ORDER ITEMS
    // =========================
    const { error: itemsErr } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsErr) {
      console.error("ITEM INSERT ERROR:", itemsErr);

      // rollback (best effort)
      await supabase.from("orders").delete().eq("id", order.id);

      return NextResponse.json({ error: itemsErr.message }, { status: 500 });
    }

    // =========================
    // 10. (OPTIONAL) CLEAR CART
    // =========================
    await supabase.from("cart_items").delete().eq("user_id", user.id);

    // =========================
    // SUCCESS
    // =========================
    return NextResponse.json({ order_id: order.id });
  } catch (e) {
    console.error("[CREATE_ORDER_ERROR]", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
