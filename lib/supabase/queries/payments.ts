import { createClient } from '@/lib/supabase/client';
import type { Payment } from '@/types/index';

export async function getPaymentByOrderId(orderId: string): Promise<Payment | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('order_id', orderId)
    .single();
  if (error) return null;
  return data as Payment;
}