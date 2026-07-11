export type AddressType = 'home' | 'office' | 'other';

export interface Address{
  id: string;
  user_id: string;
  name: string;
  phone: string;
  house_number: string;
  address_line: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  address_type: AddressType;
  is_default: boolean;
  created_at: string;
}
export type AddressInsert = Omit<Address, 'id' | 'user_id' | 'created_at'>;

export type AddressUpdate = Partial<AddressInsert>;

// export interface SavedAddress extends AddressFormValues {
//   id: string;
// }
