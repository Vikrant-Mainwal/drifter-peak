'use client';

import { useEffect } from 'react';
import { useAddressStore } from '../lib/store/addressStore';

interface DeliveryAddressSummaryProps {
  // userId: string;
  onChangeClick: () => void;
}

/**
 * Read-only summary shown on the checkout page itself (not inside the
 * modal/sheet). Pair it with <AddressManager> below, toggled by the
 * page's own `isAddressManagerOpen` state.
 */
export function DeliveryAddressSummary({  onChangeClick }: DeliveryAddressSummaryProps) {
  const addresses = useAddressStore((s) => s.addresses);
  const selectedId = useAddressStore((s) => s.selectedId);
  const isLoading = useAddressStore((s) => s.isLoading);
  const fetchAddresses = useAddressStore((s) => s.fetchAddresses);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const selected = addresses.find((a) => a.id === selectedId);

  if (isLoading && !selected) {
    return <div className="h-24 animate-pulse rounded-md border border-gray-200 bg-gray-50" />;
  }

  if (!selected) {
    return (
      <button
        type="button"
        onClick={onChangeClick}
        className="w-full rounded-md border border-dashed border-rose-400 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50"
      >
        + Add Delivery Address
      </button>
    );
  }

  return (
    <div className="flex items-start justify-between rounded-md border border-gray-200 p-4">
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{selected.name}</span>
          <span className="rounded border border-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
            {selected.address_type}
          </span>
        </div>
        <p className="mt-1 text-sm leading-snug text-gray-600">
          {selected.address_line}, {selected.locality}, {selected.city}, {selected.state} -{' '}
          {selected.pincode}
        </p>
        <p className="mt-1 text-xs text-gray-500">Mobile: {selected.phone}</p>
      </div>
      <button
        type="button"
        onClick={onChangeClick}
        className="shrink-0 text-sm font-semibold text-rose-500 hover:underline"
      >
        Change
      </button>
    </div>
  );
}
