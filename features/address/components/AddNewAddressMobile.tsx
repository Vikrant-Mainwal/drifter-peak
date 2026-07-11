'use client';

import { ArrowLeft } from 'lucide-react';
import type { AddressInsert } from '../types';
import { useAddressForm } from '../hooks/useAddressForm';
import { useLockBodyScroll } from '../lib/useLockBodyScroll';
import { AddressFormFields } from './AddressFormFields';

interface AddNewAddressMobileProps {
  /** Fired by the back arrow — takes the user back to the saved address list. */
  onBack: () => void;
  onSubmit: (values: AddressInsert) => void | Promise<void>;
  defaultValues?: Partial<AddressInsert>;
}

export function AddNewAddressMobile({ onBack, onSubmit, defaultValues }: AddNewAddressMobileProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useAddressForm(defaultValues);

  useLockBodyScroll(true);

  const submitHandler = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-address-mobile-title"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 px-4 py-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to saved addresses"
          className="-ml-1 rounded-full p-1.5 text-gray-700 active:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h2
          id="add-address-mobile-title"
          className="text-sm font-semibold uppercase tracking-wide text-gray-900"
        >
          Add New Address
        </h2>
      </div>

      {/* Scrollable body */}
      <form
        id="add-address-mobile-form"
        onSubmit={submitHandler}
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        <AddressFormFields register={register} errors={errors} address_type={watch('address_type')} />
        {/* Spacer so the last field never sits under the sticky footer */}
        <div className="h-4" />
      </form>

      {/* Sticky footer, safe-area aware for iOS home indicator */}
      <div
        className="shrink-0 border-t border-gray-200 bg-white px-4 py-3"
        style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
      >
        <button
          type="submit"
          form="add-address-mobile-form"
          disabled={isSubmitting}
          className="w-full rounded-md bg-rose-500 py-3 text-sm font-semibold text-white transition-colors active:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Saving...' : 'Save Address'}
        </button>
      </div>
    </div>
  );
}
