import { createClient } from '@/lib/supabase/client';
import type { CartItem } from '@/types/index';

export async function getCartItems(): Promise<CartItem[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('cart_items')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data as CartItem[];
}

export async function upsertCartItem(
  item: Omit<CartItem, 'id' | 'user_id' | 'created_at'>
): Promise<CartItem> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('cart_items')
    .upsert(
      { ...item, user_id: user.id },
      { onConflict: 'user_id,product_id,size' }
    )
    .select()
    .single();
  if (error) throw error;
  return data as CartItem;
}

export async function updateCartItemQuantity(id: string, quantity: number): Promise<void> {
  const supabase = createClient();
  if (quantity <= 0) {
    await removeCartItem(id);
    return;
  }
  const { error } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', id);
  if (error) throw error;
}

export async function removeCartItem(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('cart_items').delete().eq('id', id);
  if (error) throw error;
}

export async function clearCart(): Promise<void> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);
  if (error) throw error;
}