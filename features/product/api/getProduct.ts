import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "../types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getProductBySlugOrId(
  supabase: SupabaseClient,
  identifier: string,
): Promise<Product | null> {
  const isUUID = UUID_RE.test(identifier);

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq(isUUID ? "id" : "slug", identifier)
    .eq("is_active", true)
    .maybeSingle();

  return (data as Product) ?? null;
}

const MEDIA_SELECT = `
  *,
  product_media (
    id,
    product_id,
    variant_id,
    media_type,
    url,
    sort_order
  )
`;

/**
 * "You may also like" — same subcategory first, topped up with same-category
 * picks if subcategory alone doesn't reach `limit`. Always excludes the
 * product itself.
 */
export async function getRelatedProducts(
  supabase: SupabaseClient,
  product: Product,
  limit = 4,
): Promise<Product[]> {
  let query = supabase
    .from("products")
    .select(MEDIA_SELECT)
    .eq("is_active", true)
    .neq("id", product.id)
    .limit(limit);

  if (product.subcategory) {
    query = query.eq("subcategory", product.subcategory);
  } else if (product.category) {
    query = query.eq("category", product.category);
  } else {
    return [];
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const results = (data as Product[]) ?? [];

  if (results.length < limit && product.subcategory && product.category) {
    const excludeIds = [product.id, ...results.map((p) => p.id)];
    const { data: more, error: moreError } = await supabase
      .from("products")
      .select(MEDIA_SELECT)
      .eq("is_active", true)
      .eq("category", product.category)
      .not("id", "in", `(${excludeIds.join(",")})`)
      .limit(limit - results.length);

    if (moreError) throw new Error(moreError.message);
    results.push(...((more as Product[]) ?? []));
  }

  return results;
}