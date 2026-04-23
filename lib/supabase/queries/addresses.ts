import { createClient } from "@/lib/supabase/client";
import type { Address, AddressInsert } from "@/types/index";

export async function getAddresses(): Promise<Address[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return []; // don't crash UI

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Address[];
}

export async function createAddress(address: AddressInsert): Promise<Address> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log("CREATE ADDRESS CALLED");

  console.log("USER:", user);

  if (!user) throw new Error("Not authenticated");

  if (address.is_default) {
    const { error: updateError } = await supabase
      .from("addresses")
      .update({ is_default: false })
      .eq("user_id", user.id);

    if (updateError) throw updateError;
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({ ...address, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("SUPABASE INSERT ERROR:", error);
    throw error;
  }

  return data as Address;
}

export async function deleteAddress(id: string): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}
