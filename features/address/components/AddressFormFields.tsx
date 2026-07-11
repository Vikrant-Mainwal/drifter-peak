import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { Address } from '../types';
import { addressValidationRules } from '../hooks/useAddressForm';
import { FormInput } from './FormInput';
import { FormTextarea } from './FormTextarea';
import { AddressTypeToggle, DefaultAddressCheckbox } from './AddressTypeToggle';

interface AddressFormFieldsProps {
  register: UseFormRegister<Address>;
  errors: FieldErrors<Address>;
  address_type: Address['address_type'];
}

/**
 * Pure field layout — no header, no footer, no overlay concerns.
 * Desktop and mobile wrappers each own their own chrome and just render
 * this in the middle, so neither surface fights the other for layout.
 */
export function AddressFormFields({ register, errors, address_type }: AddressFormFieldsProps) {
  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Contact Details
        </h3>
        <FormInput
          label="Full Name"
          placeholder="Enter your full name"
          required
          registration={register('name', addressValidationRules.name)}
          error={errors.name?.message}
          autoFocus
        />
        <FormInput
          label="Mobile Number"
          placeholder="10-digit mobile number"
          required
          type="tel"
          inputMode="numeric"
          maxLength={10}
          registration={register('phone', addressValidationRules.phone)}
          error={errors.phone?.message}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Address</h3>

        <FormInput
          label="Pincode"
          placeholder="6-digit pincode"
          required
          type="tel"
          inputMode="numeric"
          maxLength={6}
          registration={register('pincode', addressValidationRules.pincode)}
          error={errors.pincode?.message}
        />

        <FormInput
          label="Locality"
          placeholder="Locality / Area / Sector"
          required
          registration={register('locality', addressValidationRules.locality)}
          error={errors.locality?.message}
        />

        <FormInput
          label="House / Flat / Building No."
          placeholder="Flat, House no., Building"
          required
          registration={register('house_number', addressValidationRules.house_number)}
          error={errors.house_number?.message}
        />

        <FormTextarea
          label="Address (Area, Street)"
          placeholder="Area, Street, Sector"
          required
          registration={register('address_line', addressValidationRules.address_line)}
          error={errors.address_line?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="City / District"
            placeholder="City"
            required
            registration={register('city', addressValidationRules.city)}
            error={errors.city?.message}
          />
          <FormInput
            label="State"
            placeholder="State"
            required
            registration={register('state', addressValidationRules.state)}
            error={errors.state?.message}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <AddressTypeToggle register={register} value={address_type} />
        <DefaultAddressCheckbox register={register} />
      </section>
    </div>
  );
}
