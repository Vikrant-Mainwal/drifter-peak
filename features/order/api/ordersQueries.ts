import { createClient } from "@/lib/supabase/client";
import type { Order } from "../types";

export async function getOrders(): Promise<Order[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data as Order[]) ?? [];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  return data as Order | null;
}

/**
 * Calls the cancel_order(p_order_id, p_reason) RPC — see
 * 20260703115122_create_orders_system.sql. The backend enforces
 * everything: ownership (order owner or admin), and that the order is
 * still pending_payment/paid/processing. Restores stock server-side.
 */
export async function cancelOrder(
  orderId: string,
  reason?: string,
): Promise<Order> {
  const supabase = createClient();

  const { data, error } = await supabase.rpc("cancel_order", {
    p_order_id: orderId,
    p_reason: reason ?? null,
  });

  if (error) throw error;

  return data as Order;
}
