import { createClient } from "@/lib/supabase/client";
import type { Address, AddressInsert, AddressUpdate } from "../types";

export async function getAddresses(): Promise<Address[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return []; // don't crash UI for logged-out visitors

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data as Address[];
}

export async function getDefaultAddress(): Promise<Address | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_default", true)
    .maybeSingle();

  if (error) throw error;

  return data as Address | null;
}

export async function createAddress(address: AddressInsert): Promise<Address> {
  const supabase = createClient();

  const { data, error } = await supabase
    .rpc("add_address", {
      p_name: address.name,
      p_phone: address.phone,
      p_pincode: address.pincode,
      p_house_number: address.house_number,
      p_address_line: address.address_line,
      p_locality: address.locality,
      p_city: address.city,
      p_state: address.state,
      p_address_type: address.address_type,
      p_is_default: address.is_default,
    })
    .single();

  if (error) throw error;

  return data as Address;
}

export async function updateAddress(
  id: string,
  updates: AddressUpdate,
): Promise<Address> {
  const supabase = createClient();

  // update_address takes the full field set (no partial-patch RPC exists),
  // so we merge onto the current row for any fields the caller omitted.
  const { data: current, error: fetchError } = await supabase
    .from("addresses")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !current)
    throw fetchError ?? new Error("Address not found");

  const merged = { ...(current as Address), ...updates };

  const { data, error } = await supabase
    .rpc("update_address", {
      p_address_id: id,
      p_name: merged.name,
      p_phone: merged.phone,
      p_pincode: merged.pincode,
      p_house_number: merged.house_number,
      p_address_line: merged.address_line,
      p_locality: merged.locality,
      p_city: merged.city,
      p_state: merged.state,
      p_address_type: merged.address_type,
      p_is_default: merged.is_default,
    })
    .single();

  if (error) {
    console.error("Supabase RPC Error:", error);
    throw error;
  }

  return data as Address;
}

export async function setDefaultAddress(id: string): Promise<Address> {
  const supabase = createClient();

  const { data, error } = await supabase
    .rpc("set_default_address", { p_address_id: id })
    .single();

  if (error) throw error;

  return data as Address;
}

export async function deleteAddress(id: string): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.rpc("delete_address", { p_address_id: id });

  if (error) throw error;
}
