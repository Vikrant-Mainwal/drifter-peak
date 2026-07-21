import { createClient } from "@/lib/supabase/client";
import { FilterCategory, Product, ProductsPage, SortOption } from "../types";

const PAGE_SIZE = 12;

export async function fetchProducts({
  category,
  cursor,
  sort,
  search,
}: {
  category: FilterCategory;
  cursor?: string | null;
  sort?: SortOption;
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
    .limit(PAGE_SIZE + 1);

  // Sort
  switch (sort) {
    case "price-asc":
      query = query.order("selling_price", { ascending: true }).order("created_at", { ascending: false });
      break;
    case "price-desc":
      query = query.order("selling_price", { ascending: false }).order("created_at", { ascending: false });
      break;
    case "popular":
      // no popularity metric on `products` yet — falls back to newest until one exists
      query = query.order("created_at", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

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

  // Cursor-based pagination
  // NOTE: cursor pagination below assumes sort is always created_at DESC.
  // Once price-based sorting is live, cursoring on created_at breaks —
  // see note below.
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