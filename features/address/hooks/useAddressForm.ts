'use client';

import { useForm } from 'react-hook-form';
import type { Address } from '../types';

const MOBILE_PATTERN = /^[6-9]\d{9}$/;
const PINCODE_PATTERN = /^[1-9][0-9]{5}$/;

export function useAddressForm(defaultValues?: Partial<Address>) {
  return useForm<Address>({
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
      pincode: '',
      locality: '',
      house_number: '',
      address_line: '',
      city: '',
      state: '',
      address_type: 'home',
      is_default: false,
      ...defaultValues,
    },
  });
}

/** Centralised so desktop + mobile forms never drift out of sync. */
export const addressValidationRules = {
  name: {
    required: 'Full name is required',
    minLength: { value: 3, message: 'Name must be at least 3 characters' },
    maxLength: { value: 60, message: 'Name is too long' },
  },
  phone: {
    required: 'Mobile number is required',
    pattern: { value: MOBILE_PATTERN, message: 'Enter a valid 10-digit mobile number' },
  },
  pincode: {
    required: 'Pincode is required',
    pattern: { value: PINCODE_PATTERN, message: 'Enter a valid 6-digit pincode' },
  },
  locality: {
    required: 'Locality is required',
    maxLength: { value: 80, message: 'Locality is too long' },
  },
  house_number: {
   required: 'House / flat number is required',
   maxLength: { value: 100, message: 'Too long' },
 },
 address_line: {
   required: 'Address is required',
   minLength: { value: 10, message: 'Please enter a complete address' },
   maxLength: { value: 300, message: 'Address is too long' },
 },
  city: { required: 'City is required' },
  state: { required: 'State is required' },
  alternatePhone: {
    pattern: { value: MOBILE_PATTERN, message: 'Enter a valid 10-digit mobile number' },
  },
} as const;
