export interface AddressFormValues {
  name: string;
  phone: string;
  pincode: string;
  house_number: string;
  address_line: string;
  locality: string;
  city: string;
  state: string;
  address_type: "home" | "office" | "other";
}

export type AddressFormErrors = Partial<Record<keyof AddressFormValues, string>>;

export function validateAddress(values: AddressFormValues): AddressFormErrors {
  const errors: AddressFormErrors = {};

  if (!values.name.trim()) errors.name = "Name is required";

  if (!values.phone.trim()) {
    errors.phone = "Mobile number is required";
  } else if (!/^[6-9]\d{9}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid 10-digit mobile number";
  }

  if (!values.pincode.trim()) {
    errors.pincode = "Pincode is required";
  } else if (!/^\d{6}$/.test(values.pincode.trim())) {
    errors.pincode = "Enter a valid 6-digit pincode";
  }

  if (!values.house_number.trim()) errors.house_number = "Required";
  if (!values.address_line.trim()) errors.address_line = "Required";
  if (!values.locality.trim()) errors.locality = "Required";
  if (!values.city.trim()) errors.city = "Required";
  if (!values.state.trim()) errors.state = "Required";

  return errors;
}