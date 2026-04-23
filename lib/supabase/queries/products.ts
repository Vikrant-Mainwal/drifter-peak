import { createClient } from "@/lib/supabase/client";

export async function getProducts() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("PRODUCT FETCH ERROR:", error);
    return [];
  }

  return data;
}