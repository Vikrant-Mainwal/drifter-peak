import type { UseFormRegister } from 'react-hook-form';
import type { Address } from '../types';

interface AddressTypeToggleProps {
  register: UseFormRegister<Address>;
  value: Address['address_type'];
}

const OPTIONS: { value: Address['address_type']; label: string }[] = [
  { value: 'home', label: 'Home' },
  { value: 'office', label: 'Office' },
  { value: 'other', label: 'Other' },
];

export function AddressTypeToggle({ register, value }: AddressTypeToggleProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-gray-500">Address Type</span>
      <div className="flex gap-3">
        {OPTIONS.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm transition-colors ${
                checked
                  ? 'border-rose-500 bg-rose-50 text-rose-600'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                value={option.value}
                {...register('address_type')}
                className="h-3.5 w-3.5 accent-rose-500"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}

interface DefaultAddressCheckboxProps {
  register: UseFormRegister<Address>;
}

export function DefaultAddressCheckbox({ register }: DefaultAddressCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
      <input
        type="checkbox"
        {...register('is_default')}
        className="h-4 w-4 rounded accent-rose-500"
      />
      Make this my default address
    </label>
  );
}
