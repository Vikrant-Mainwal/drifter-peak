import { createClient } from "@/lib/supabase/client";
import { FilterCategory, Product, ProductsPage } from "../types";

const PAGE_SIZE = 12;

export async function fetchProducts({
  category,
  cursor,
  search,
}: {
  category: FilterCategory;
  cursor?: string | null;
  search?: string;
}): Promise<ProductsPage> {

  const supabase = createClient();

  let query = supabase
    .from("products")
    .select(
      `
      *,
      product_media (
        id,
        product_id,
        variant_id,
        media_type,
        url,
        sort_order
      )
    `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(PAGE_SIZE + 1);

  // Filter by gender/category
  if (category !== "all") {
    if (category === "accessories") {
      query = query.eq("category", "accessories");
    } else {
      query = query.eq("gender", category);
    }
  }

  // Search filter
  if (search && search.trim()) {
    query = query.or(
      `list_title.ilike.%${search}%,keywords.ilike.%${search}%`
    );
  }

  // Cursor-based pagination using created_at
  if (cursor) {
    query = query.lt("created_at", cursor);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  const products = (data as Product[]) ?? [];
  const hasMore = products.length > PAGE_SIZE;
  const pageProducts = hasMore ? products.slice(0, PAGE_SIZE) : products;
  const nextCursor =
    hasMore && pageProducts.length > 0
      ? pageProducts[pageProducts.length - 1].created_at
      : null;

  return {
    products: pageProducts,
    nextCursor,
    hasMore,
  };
}
