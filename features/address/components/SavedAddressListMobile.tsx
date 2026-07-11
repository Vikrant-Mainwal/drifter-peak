'use client';

import { X } from 'lucide-react';
import type { Address } from '../types';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';
import { AddressCard } from './AddressCard';

interface SavedAddressListMobileProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddNew: () => void;
  onClose: () => void;
}

export function SavedAddressListMobile({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  onClose,
}: SavedAddressListMobileProps) {
  useLockBodyScroll(true);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />

      {/* Sheet */}
      <div className="relative z-10 flex max-h-[80vh] flex-col rounded-t-2xl bg-white">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-4">
          <h2 className="text-base font-semibold text-gray-900">Select Delivery Address</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-gray-500 active:bg-gray-100"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          {addresses.length === 0 ? (
            <p className="px-4 py-10 text-center text-sm text-gray-500">
              No saved addresses yet.
            </p>
          ) : (
            addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                selected={selectedId === address.id}
                onSelect={onSelect}
              />
            ))
          )}
        </div>

        <div
          className="shrink-0 border-t border-gray-200 px-4 py-3"
          style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
        >
          <button
            type="button"
            onClick={onAddNew}
            className="w-full rounded-md border border-dashed border-rose-400 py-2.5 text-sm font-semibold text-rose-500 active:bg-rose-50"
          >
            + Add New Address
          </button>
        </div>
      </div>
    </div>
  );
}
