'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import type { AddressInsert } from '../types';
import { useAddressForm } from '../hooks/useAddressForm';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';
import { AddressFormFields } from './AddressFormFields';

interface AddNewAddressDesktopProps {
  onClose: () => void;
  onSubmit: (values: AddressInsert) => void | Promise<void>;
  defaultValues?: Partial<AddressInsert>;
}

export function AddNewAddressDesktop({
  onClose,
  onSubmit,
  defaultValues,
}: AddNewAddressDesktopProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useAddressForm(defaultValues);

  const overlayRef = useRef<HTMLDivElement>(null);
  useLockBodyScroll(true);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === overlayRef.current) onClose();
  };

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <div
      ref={overlayRef}
      onMouseDown={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-address-desktop-title"
    >
      <div className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 id="add-address-desktop-title" className="text-base font-semibold text-gray-900">
            Add New Address
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <form
          id="add-address-desktop-form"
          onSubmit={submitHandler}
          className="flex-1 overflow-y-auto px-6 py-5"
        >
          <AddressFormFields register={register} errors={errors} address_type={watch('address_type')} />
        </form>

        {/* Sticky footer */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-2.5 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-address-desktop-form"
            disabled={isSubmitting}
            className="rounded-md bg-rose-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving...' : 'Save Address'}
          </button>
        </div>
      </div>
    </div>
  );
}
