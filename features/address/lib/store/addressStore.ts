import { create } from 'zustand';
import type { Address, AddressUpdate, AddressInsert } from '../../types';
import {
  getAddresses,
  createAddress as createAddressQuery,
  deleteAddress as deleteAddressQuery,
  setDefaultAddress as setDefaultAddressQuery,
} from '../addressQueries';

interface AddressState {
  addresses: Address[];
  selectedId: string | null;
  isLoading: boolean;
  error: string | null;
  hasFetched: boolean;
}

interface AddressActions {
  fetchAddresses: () => Promise<void>;
  createAddress: (values: AddressInsert) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  selectAddress: (id: string) => void;
  setDefaultAddress: (id: string) => Promise<void>;
  reset: () => void;
}

const initialState: AddressState = {
  addresses: [],
  selectedId: null,
  isLoading: false,
  error: null,
  hasFetched: false,
};

/** Form is camelCase, DB insert type is snake_case — bridge it here, once. */
function toAddressInsert(values: AddressInsert): AddressInsert {
  return {
    name: values.name,
    phone: values.phone,
    house_number: values.house_number,
    address_line: values.address_line,
    locality: values.locality,
    city: values.city,
    state: values.state,
    pincode: values.pincode,
    address_type: values.address_type,
    is_default: values.is_default,
  };
}

export const useAddressStore = create<AddressState & AddressActions>((set, get) => ({
  ...initialState,

  fetchAddresses: async () => {
    if (get().isLoading || get().hasFetched) return;
    set({ isLoading: true, error: null });
    try {
      const addresses = await getAddresses();
      const fallbackSelection = addresses.find((a) => a.is_default)?.id ?? addresses[0]?.id ?? null;
      set({
        addresses,
        selectedId: get().selectedId ?? fallbackSelection,
        isLoading: false,
        hasFetched: true,
      });
    } catch {
      set({ isLoading: false, error: 'Failed to load addresses. Please try again.' });
    }
  },

  createAddress: async (values) => {
    const previous = get().addresses;
    try {
      const created = await createAddressQuery(toAddressInsert(values));
      set((state) => ({
        addresses: [
          created,
          ...state.addresses.map((a) => (created.is_default ? { ...a, is_default: false } : a)),
        ],
        selectedId: created.id,
        error: null,
      }));
    } catch (error){
      console.log('Failed to create address', values, error);
      set({ addresses: previous, error: 'Failed to save address. Please try again.' });
      throw new Error('Failed to save address');
    }
  },

  deleteAddress: async (id) => {
    const previous = get().addresses;
    const wasSelected = get().selectedId === id;
    const remaining = previous.filter((a) => a.id !== id);
    set({
      addresses: remaining,
      selectedId: wasSelected ? remaining[0]?.id ?? null : get().selectedId,
    });
    try {
      await deleteAddressQuery(id);
    } catch {
      set({ addresses: previous, error: 'Failed to delete address.' });
    }
  },

  selectAddress: (id) => set({ selectedId: id }),

  setDefaultAddress: async (id) => {
    const previous = get().addresses;
    set((state) => ({
      addresses: state.addresses.map((a) => ({ ...a, is_default: a.id === id })),
    }));
    try {
      await setDefaultAddressQuery(id);
    } catch {
      set({ addresses: previous, error: 'Failed to set default address.' });
    }
  },

  reset: () => set(initialState),
}));
