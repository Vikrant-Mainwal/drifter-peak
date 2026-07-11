import { createClient } from "@/lib/supabase/client";
import type { Order } from "@/types/index";

export async function getOrders(): Promise<Order[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      address:addresses(*),
      order_items(*),
      payments(*)
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Order[];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      address:addresses(*),
      order_items(*),
      payments(*)
    `,
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) return null;

  return data as Order;
}