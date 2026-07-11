import type { SupabaseClient } from "@supabase/supabase-js";
import type { Product } from "../types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * A product's slug is optional and may be null — product id is the
 * guaranteed fallback. Given a single route param that could be either,
 * this resolves it the same way everywhere: if it looks like a UUID, treat
 * it as an id; otherwise treat it as a slug.
 */
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
