'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { createAddress } from '@/lib/supabase/queries/addresses';
import { useCheckoutStore } from '@/lib/store/checkout';
import type { AddressInsert } from '@/types/index';

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Chandigarh','Puducherry',
];

interface FormState {
  full_name: string; phone: string; line1: string; line2: string;
  city: string; state: string; pincode: string; is_default: boolean;
}

const initial: FormState = {
  full_name: '', phone: '', line1: '', line2: '',
  city: '', state: '', pincode: '', is_default: false,
};

export function AddressForm({ redirectTo = '/checkout' }: { redirectTo?: string }) {
  const router = useRouter();
  const setSelectedAddressId = useCheckoutStore(s => s.setSelectedAddressId);
  const [form, setForm]     = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const set = (k: keyof FormState, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.full_name.trim())            e.full_name = 'Required';
    if (!/^\d{10}$/.test(form.phone))     e.phone = 'Valid 10-digit number';
    if (!form.line1.trim())               e.line1 = 'Required';
    if (!form.city.trim())                e.city = 'Required';
    if (!form.state)                      e.state = 'Required';
    if (!/^\d{6}$/.test(form.pincode))   e.pincode = 'Valid 6-digit PIN';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const payload: AddressInsert = { ...form };
      const address = await createAddress(payload);
      setSelectedAddressId(address.id); // auto-select
      router.push(redirectTo);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input label="Full Name" value={form.full_name} error={errors.full_name}
          onChange={e => set('full_name', e.target.value)} required placeholder="As on ID" />
        <Input label="Phone" type="tel" value={form.phone} error={errors.phone}
          onChange={e => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
          required placeholder="10-digit mobile" />
      </div>

      <Input label="Address Line 1" value={form.line1} error={errors.line1}
        onChange={e => set('line1', e.target.value)} required placeholder="Flat / House No. / Street" />

      <Input label="Address Line 2 (Optional)" value={form.line2}
        onChange={e => set('line2', e.target.value)} placeholder="Area / Locality / Colony" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Input label="City" value={form.city} error={errors.city}
          onChange={e => set('city', e.target.value)} required />

        <div className="space-y-1">
          <label className="block text-xs font-medium tracking-wide text-neutral-600 uppercase">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={form.state}
            onChange={e => set('state', e.target.value)}
            className={`w-full border px-4 py-3 text-sm outline-none transition-all bg-white ${
              errors.state ? 'border-red-400' : 'border-neutral-300 focus:border-neutral-900'
            }`}
          >
            <option value="">Select state</option>
            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
        </div>

        <Input label="Pincode" value={form.pincode} error={errors.pincode}
          onChange={e => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
          required placeholder="6-digit PIN" />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.is_default}
          onChange={e => set('is_default', e.target.checked)}
          className="w-4 h-4 accent-neutral-900" />
        <span className="text-sm text-neutral-700">Set as default address</span>
      </label>

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      <Button type="submit" loading={loading} size="lg" className="w-full">
        Save Address
      </Button>
    </form>
  );
}