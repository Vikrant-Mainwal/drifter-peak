import { supabase } from "@/lib/db/supabase";
import type { Product, ProductInsert, ProductUpdate } from "@/types/product.types";

export const ProductService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data as Product[];
  },

  async getById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return null;
    return data as Product;
  },

  async create(product: ProductInsert): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .insert(product)
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  },

  async update(id: string, changes: ProductUpdate): Promise<Product> {
    const { data, error } = await supabase
      .from("products")
      .update(changes)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data as Product;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
  },
};