import { MapPin, Plus } from "lucide-react";
import type { Address } from "../../address/types";

interface Props {
  address: Address | null;
  onEdit: () => void;
  onChange: () => void;
  onAddNew: () => void;
}

export function AddressCard({ address, onEdit, onChange, onAddNew }: Props) {
  if (!address) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--card)] p-5">
        <div className="flex items-center gap-3">
          <MapPin size={18} className="text-[color:var(--muted)]" />
          <div className="flex-1">
            <p className="font-display text-lg uppercase tracking-tight">
              Deliver To
            </p>
            <p className="text-sm text-[color:var(--muted)]">
              No saved address yet
            </p>
          </div>
          <button
            type="button"
            onClick={onAddNew}
            className="flex items-center gap-1.5 rounded-full bg-[color:var(--fg)] px-4 py-2 text-sm font-medium text-[color:var(--bg)]"
          >
            <Plus size={14} />
            Add Address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5">
      <div className="flex items-start gap-3">
        <MapPin size={18} className="mt-0.5 shrink-0 text-[color:var(--muted)]" />

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="font-display text-lg uppercase tracking-tight">
              Deliver To
            </p>
            <div className="flex shrink-0 gap-3 text-xs font-medium uppercase tracking-wide">
              <button type="button" onClick={onEdit} className="underline">
                Edit
              </button>
              <button type="button" onClick={onChange} className="underline">
                Change
              </button>
            </div>
          </div>

          <p className="mt-1 text-sm font-medium">
            {address.name} · {address.phone}
          </p>
          <p className="text-sm text-[color:var(--muted)]">
            {address.house_number}, {address.address_line}, {address.locality}
            , {address.city}, {address.state} - {address.pincode}
          </p>
          <span className="mt-2 inline-block rounded-full border border-[color:var(--border)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[color:var(--muted)]">
            {address.address_type}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onAddNew}
        className="mt-4 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[color:var(--muted)] underline"
      >
        <Plus size={12} />
        Add New Address
      </button>
    </div>
  );
}
