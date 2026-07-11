'use client';

import { useRef } from 'react';
import { X } from 'lucide-react';
import type { Address } from '../types';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';
import { AddressCard } from './AddressCard';

interface SavedAddressListDesktopProps {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onAddNew: () => void;
  onClose: () => void;
}

export function SavedAddressListDesktop({
  addresses,
  selectedId,
  onSelect,
  onAddNew,
  onClose,
}: SavedAddressListDesktopProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(true);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) onClose();
  };

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Select Delivery Address</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {addresses.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-gray-500">
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

        <div className="shrink-0 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onAddNew}
            className="w-full rounded-md border border-dashed border-rose-400 py-2.5 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-50"
          >
            + Add New Address
          </button>
        </div>
      </div>
    </div>
  );
}
