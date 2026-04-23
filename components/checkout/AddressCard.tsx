import { MapPin, Phone, Check } from 'lucide-react';
import type { Address } from '@/types/index';

interface Props {
  address: Address;
  selected: boolean;
  onSelect: () => void;
}

export function AddressCard({ address, selected, onSelect }: Props) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 border-2 transition-all duration-150 ${
        selected ? 'border-neutral-900 bg-neutral-50' : 'border-neutral-200 hover:border-neutral-400'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-neutral-900">{address.full_name}</p>
            {address.is_default && (
              <span className="text-[10px] font-medium tracking-wide bg-neutral-900 text-white px-1.5 py-0.5">
                DEFAULT
              </span>
            )}
          </div>
          <div className="flex items-start gap-1 mt-1">
            <MapPin size={12} className="text-neutral-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-neutral-600 leading-relaxed">
              {address.line1}{address.line2 && `, ${address.line2}`}, {address.city}, {address.state} — {address.pincode}
            </p>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <Phone size={11} className="text-neutral-400" />
            <p className="text-xs text-neutral-600">{address.phone}</p>
          </div>
        </div>
        {selected && (
          <div className="w-5 h-5 bg-neutral-900 flex items-center justify-center flex-shrink-0 ml-3">
            <Check size={12} className="text-white" />
          </div>
        )}
      </div>
    </button>
  );
}