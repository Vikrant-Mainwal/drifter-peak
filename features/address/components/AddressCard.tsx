import type { Address } from '../types';

interface AddressCardProps {
  address: Address;
  selected: boolean;
  onSelect: (id: string) => void;
}

export function AddressCard({ address, selected, onSelect }: AddressCardProps) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 border-b border-gray-100 px-4 py-4 transition-colors last:border-b-0 ${
        selected ? 'bg-rose-50/40' : ''
      }`}
    >
      <input
        type="radio"
        name="selected-address"
        checked={selected}
        onChange={() => onSelect(address.id)}
        className="mt-1 h-4 w-4 accent-rose-500"
      />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">{address.name}</span>
          <span className="rounded border border-emerald-600 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-emerald-700">
            {address.address_type}
          </span>
          {address.is_default && (
            <span className="text-xs font-medium text-gray-400">(Default)</span>
          )}
        </div>
        <p className="mt-1 text-sm leading-snug text-gray-600">
          {address.address_line}, {address.locality}
          {/* {address.landmark ? `, ${address.landmark}` : ''} */}
          <br />
          {address.city}, {address.state} - {address.pincode}
        </p>
        <p className="mt-1 text-xs text-gray-500">Mobile: {address.phone}</p>
      </div>
    </label>
  );
}
