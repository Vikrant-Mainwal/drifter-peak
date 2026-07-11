import { createClient } from "@/lib/supabase/client";
import type { CartItem } from "@/features/cart/types/cart";
import { PLACEHOLDER_IMAGE } from "@/lib/utils";

export async function clearCartItems(cartId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId);

  if (error) throw error;
}

export async function getOrCreateCart(userId: string): Promise<string> {
  const supabase = createClient();

  const { data: existing, error: fetchErr } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchErr) throw fetchErr;
  if (existing) return existing.id;

  const { data: created, error: createErr } = await supabase
    .from("carts")
    .insert({ user_id: userId })
    .select("id")
    .single();

  if (createErr) throw createErr;
  return created.id;
}

export async function fetchCartItems(cartId: string): Promise<CartItem[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      variant_id,
      quantity,
      product_variants (
        id,
        product_id,
        color,
        size,
        price,
        stock,
        is_active,
        products ( list_title, slug, is_active, mrp, selling_price )
      )
    `,
    )
    .eq("cart_id", cartId);

  if (error) throw error;
  if (!data) return [];

  const productIds = [
    ...new Set(
      data
        .map((r: any) => r.product_variants?.product_id)
        .filter(Boolean),
    ),
  ];

  const { data: media } = await supabase
    .from("product_media")
    .select("product_id, variant_id, url, sort_order")
    .in("product_id", productIds)
    .order("sort_order", { ascending: true });

  const imageFor = (productId: string, variantId: string) => {
    const variantMatch = media?.find((m: any) => m.variant_id === variantId);
    if (variantMatch) return variantMatch.url;
    return (
      media?.find((m: any) => m.product_id === productId && !m.variant_id)?.url ??
      PLACEHOLDER_IMAGE
    );
  };

  return data
    .filter((row: any) => row.product_variants)
    .map((row: any) => {
      const v = row.product_variants;
      const product = v.products;

      // The variant's own price is the source of truth when it's set, but
      // some variants are created without a per-variant price override —
      // fall back to the parent product's selling_price so the cart never
      // shows a null/₹0 line item. mrp follows the same chain.
      const price = v.price ?? product?.selling_price ?? 0;
      const mrp = product?.mrp ?? product?.selling_price ?? price;

      return {
        variant_id: row.variant_id,
        quantity: row.quantity,
        product_id: v.product_id,
        slug: product?.slug || v.product_id,
        name: product?.list_title ?? "",
        mrp: Number(mrp) || 0,
        price: Number(price) || 0,
        size: v.size,
        color: v.color,
        stock: v.stock,
        image: imageFor(v.product_id, row.variant_id),
      };
    });
}

export async function upsertCartItem(
  cartId: string,
  variantId: string,
  quantity: number,
) {
  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .upsert(
      { cart_id: cartId, variant_id: variantId, quantity },
      { onConflict: "cart_id,variant_id" },
    );
  if (error) throw error;
}

export async function deleteCartItem(cartId: string, variantId: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId)
    .eq("variant_id", variantId);
  if (error) throw error;
}

export async function mergeGuestCartToDb(
  cartId: string,
  guestItems: { variant_id: string; quantity: number }[],
) {
  if (guestItems.length === 0) return;
  const supabase = createClient();

  const { data: existingRows } = await supabase
    .from("cart_items")
    .select("variant_id, quantity")
    .eq("cart_id", cartId);

  const existingMap = new Map(
    (existingRows ?? []).map((r) => [r.variant_id, r.quantity]),
  );

  const rows = guestItems.map((item) => ({
    cart_id: cartId,
    variant_id: item.variant_id,
    quantity: (existingMap.get(item.variant_id) ?? 0) + item.quantity,
  }));

  const { error } = await supabase
    .from("cart_items")
    .upsert(rows, { onConflict: "cart_id,variant_id" });

  if (error) throw error;
}