"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, Pencil, Trash2 } from "lucide-react";
import { BottomSheet } from "../ui/BottomSheet";
import type { Address, AddressInsert } from "../../address/types";
import {
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../../address/lib/addressQueries";
import {
  validateAddress,
  type AddressFormValues,
  type AddressFormErrors,
} from "@/features/checkout/lib/validation";

const EMPTY_FORM: AddressFormValues = {
  name: "",
  phone: "",
  pincode: "",
  house_number: "",
  address_line: "",
  locality: "",
  city: "",
  state: "",
  address_type: "home",
};

type View = "list" | "form";

interface Props {
  open: boolean;
  onClose: () => void;
  addresses: Address[];
  selectedAddressId: string | null;
  initialView?: View;
  editingAddress?: Address | null;
  onSelect: (addressId: string) => void;
  onAddressesChange: (addresses: Address[]) => void;
  showToast: (message: string, type?: "success" | "error" | "info") => void;
}

export function AddressSheet({
  open,
  onClose,
  addresses,
  selectedAddressId,
  initialView = "list",
  editingAddress = null,
  onSelect,
  onAddressesChange,
  showToast,
}: Props) {
  const [view, setView] = useState<View>(initialView);
  const [form, setForm] = useState<AddressFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<AddressFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pincodeCheck, setPincodeCheck] = useState("");
  const [editingId, setEditingId] = useState<string | null>(
    editingAddress?.id ?? null,
  );

  // Reset to the requested view/data every time the sheet is (re)opened.
  useEffect(() => {
    if (!open) return;
    setView(initialView);
    setErrors({});
    setEditingId(editingAddress?.id ?? null);
    if (editingAddress) {
      setForm({
        name: editingAddress.name,
        phone: editingAddress.phone,
        pincode: editingAddress.pincode,
        house_number: editingAddress.house_number,
        address_line: editingAddress.address_line,
        locality: editingAddress.locality,
        city: editingAddress.city,
        state: editingAddress.state,
        address_type: editingAddress.address_type,
      });
    } else {
      setForm({ ...EMPTY_FORM, pincode: pincodeCheck });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialView, editingAddress]);

  function updateField<K extends keyof AddressFormValues>(
    key: K,
    value: AddressFormValues[K],
  ) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function openCreateForm() {
    setForm({ ...EMPTY_FORM, pincode: pincodeCheck });
    setErrors({});
    setEditingId(null);
    setView("form");
  }

  function openEditForm(address: Address) {
    setForm({
      name: address.name,
      phone: address.phone,
      pincode: address.pincode,
      house_number: address.house_number,
      address_line: address.address_line,
      locality: address.locality,
      city: address.city,
      state: address.state,
      address_type: address.address_type,
    });
    setEditingId(address.id);
    setErrors({});
    setView("form");
  }

  async function handleSave() {
    const validationErrors = validateAddress(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSaving(true);
    try {
      const payload: AddressInsert = { ...form, is_default: false };

      if (editingId) {
        const updated = await updateAddress(editingId, payload);
        onAddressesChange(
          addresses.map((a) => (a.id === updated.id ? updated : a)),
        );
        showToast("Address updated", "success");
      } else {
        const created = await createAddress(payload);
        onAddressesChange([created, ...addresses]);
        onSelect(created.id);
        showToast("Address saved", "success");
      }
      setEditingId(null);
      setView("list");
    } catch {
      showToast("Couldn't save address, please try again", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await deleteAddress(id);
      const remaining = addresses.filter((a) => a.id !== id);
      onAddressesChange(remaining);
      if (selectedAddressId === id) {
        const nextDefault = remaining.find((a) => a.is_default) ?? remaining[0];
        if (nextDefault) onSelect(nextDefault.id);
      }
      showToast("Address removed", "success");
    } catch {
      showToast("Couldn't remove address", "error");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSetDefault(id: string) {
    try {
      await setDefaultAddress(id);
      onAddressesChange(
        addresses.map((a) => ({ ...a, is_default: a.id === id })),
      );
    } catch {
      showToast("Couldn't update default address", "error");
    }
  }

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={
        view === "list"
          ? "Select Delivery Address"
          : editingId
            ? "Edit Address"
            : "Add New Address"
      }
    >
      {view === "form" && (
        <button
          onClick={() => (editingId ? onClose() : setView("list"))}
          aria-label="Back"
          className="absolute left-5 top-[15px] text-[color:var(--fg)] md:top-5"
        >
          <ArrowLeft size={18} />
        </button>
      )}

      {view === "list" ? (
        <AddressListView
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          deletingId={deletingId}
          pincodeCheck={pincodeCheck}
          onPincodeCheckChange={setPincodeCheck}
          onSelect={onSelect}
          onSetDefault={handleSetDefault}
          onEdit={openEditForm}
          onDelete={handleDelete}
          onAddNew={openCreateForm}
          onDeliverHere={onClose}
        />
      ) : (
        <AddressFormView
          form={form}
          errors={errors}
          saving={saving}
          onChange={updateField}
          onCancel={() => (editingId ? onClose() : setView("list"))}
          onSave={handleSave}
        />
      )}
    </BottomSheet>
  );
}

function AddressListView({
  addresses,
  selectedAddressId,
  deletingId,
  pincodeCheck,
  onPincodeCheckChange,
  onSelect,
  onSetDefault,
  onEdit,
  onDelete,
  onAddNew,
  onDeliverHere,
}: {
  addresses: Address[];
  selectedAddressId: string | null;
  deletingId: string | null;
  pincodeCheck: string;
  onPincodeCheckChange: (v: string) => void;
  onSelect: (id: string) => void;
  onSetDefault: (id: string) => void;
  onEdit: (address: Address) => void;
  onDelete: (id: string) => void;
  onAddNew: () => void;
  onDeliverHere: () => void;
}) {
  return (
    <div>
      <div className="mb-5 flex gap-2">
        <input
          value={pincodeCheck}
          onChange={(e) => onPincodeCheckChange(e.target.value.slice(0, 6))}
          placeholder="Enter Pincode"
          inputMode="numeric"
          className="flex-1 rounded-xl border border-[color:var(--border)] bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[color:var(--fg)]"
        />
        <button
          type="button"
          className="shrink-0 rounded-xl border border-[color:var(--border)] px-4 text-sm font-medium text-[color:var(--fg)]"
        >
          Check
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <MapPin size={28} className="text-[color:var(--muted)]" />
          <p className="text-sm text-[color:var(--muted)]">
            You don&apos;t have any saved addresses yet
          </p>
        </div>
      ) : (
        <div className="mb-5 space-y-3">
          {addresses.map((address) => {
            const isSelected = address.id === selectedAddressId;
            return (
              <div
                key={address.id}
                className={`rounded-xl border p-4 ${
                  isSelected
                    ? "border-[color:var(--fg)]"
                    : "border-[color:var(--border)]"
                }`}
              >
                <div className="flex gap-3">
                  <button
                    onClick={() => onSelect(address.id)}
                    aria-label={`Select address for ${address.name}`}
                    className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2"
                    style={{
                      borderColor: isSelected ? "var(--fg)" : "var(--border)",
                    }}
                  >
                    {isSelected && (
                      <span className="h-2 w-2 rounded-full bg-[color:var(--fg)]" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-[color:var(--fg)]">
                        {address.name}
                      </p>
                      {address.is_default && (
                        <span className="text-xs text-[color:var(--muted)]">
                          (Default)
                        </span>
                      )}
                      <span className="rounded-full border border-[color:var(--border)] px-2 py-0.5 text-[10px] uppercase text-[color:var(--muted)]">
                        {address.address_type}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-[color:var(--muted)]">
                      {address.house_number}, {address.address_line},{" "}
                      {address.locality}
                      <br />
                      {address.city}, {address.state} - {address.pincode}
                    </p>
                    <p className="mt-1 text-sm text-[color:var(--muted)]">
                      Mobile: {address.phone}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      {isSelected ? (
                        <button
                          onClick={onDeliverHere}
                          className="rounded-full bg-[color:var(--fg)] px-4 py-1.5 text-xs font-medium text-[color:var(--bg)]"
                        >
                          Delivering here
                        </button>
                      ) : (
                        <button
                          onClick={() => onSetDefault(address.id)}
                          className="rounded-full border border-[color:var(--border)] px-4 py-1.5 text-xs font-medium text-[color:var(--fg)]"
                        >
                          Make default
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(address)}
                        aria-label="Edit address"
                        className="flex items-center gap-1 rounded-full border border-[color:var(--border)] px-3 py-1.5 text-xs font-medium text-[color:var(--fg)]"
                      >
                        <Pencil size={12} />
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(address.id)}
                        disabled={deletingId === address.id}
                        aria-label="Delete address"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[color:var(--border)] text-[color:var(--red)] disabled:opacity-40"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={onAddNew}
        className="w-full rounded-full border border-[color:var(--fg)] py-3 text-sm font-medium text-[color:var(--fg)]"
      >
        Add New Address
      </button>
    </div>
  );
}

function AddressFormView({
  form,
  errors,
  saving,
  onChange,
  onCancel,
  onSave,
}: {
  form: AddressFormValues;
  errors: AddressFormErrors;
  saving: boolean;
  onChange: <K extends keyof AddressFormValues>(
    key: K,
    value: AddressFormValues[K],
  ) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="pt-1 max-h-[500px] overflow-y-auto">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide">
          Contact Details
        </p>
        <Field label="Name" value={form.name} error={errors.name}>
          <input
            value={form.name}
            onChange={(e) => onChange("name", e.target.value)}
            className={inputClass(!!errors.name)}
          />
        </Field>
        <Field label="Mobile No" value={form.phone} error={errors.phone}>
          <input
            value={form.phone}
            onChange={(e) =>
              onChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            inputMode="numeric"
            className={inputClass(!!errors.phone)}
          />
        </Field>

        <p className="mb-2 mt-5 text-xs font-medium uppercase tracking-wide text-[color:var(--muted)]">
          Address
        </p>
        <Field label="Pin Code" value={form.pincode} error={errors.pincode}>
          <input
            value={form.pincode}
            onChange={(e) =>
              onChange("pincode", e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            inputMode="numeric"
            className={inputClass(!!errors.pincode)}
          />
        </Field>
        <Field
          label="House Number / Tower / Block"
          value={form.house_number}
          error={errors.house_number}
          helper="House number will allow a doorstep delivery"
        >
          <input
            value={form.house_number}
            onChange={(e) => onChange("house_number", e.target.value)}
            className={inputClass(!!errors.house_number)}
          />
        </Field>
        <Field
          label="Address (locality, building, street)"
          value={form.address_line}
          error={errors.address_line}
          helper="Please update society/apartment details"
        >
          <input
            value={form.address_line}
            onChange={(e) => onChange("address_line", e.target.value)}
            className={inputClass(!!errors.address_line)}
          />
        </Field>
        <Field
          label="Locality / Town"
          value={form.locality}
          error={errors.locality}
        >
          <input
            value={form.locality}
            onChange={(e) => onChange("locality", e.target.value)}
            className={inputClass(!!errors.locality)}
          />
        </Field>

        <div className="flex gap-3">
          <Field label="City / District" value={form.city} error={errors.city}>
            <input
              value={form.city}
              onChange={(e) => onChange("city", e.target.value)}
              className={inputClass(!!errors.city)}
            />
          </Field>
          <Field label="State" value={form.state} error={errors.state}>
            <input
              value={form.state}
              onChange={(e) => onChange("state", e.target.value)}
              className={inputClass(!!errors.state)}
            />
          </Field>
        </div>

        <p className="mb-2 mt-4 text-xs font-medium uppercase tracking-wide text-[color:var(--muted)]">
          Address Type
        </p>
        <div className="mb-6 flex gap-4">
          {(["home", "office", "other"] as const).map((type) => (
            <label
              key={type}
              className="flex items-center gap-1.5 text-sm text-[color:var(--fg)]"
            >
              <input
                type="radio"
                name="address_type"
                checked={form.address_type === type}
                onChange={() => onChange("address_type", type)}
              />
              {type === "office" ? "Office" : type === "home" ? "Home" : "Other"}
            </label>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-full border border-[color:var(--border)] py-3 text-sm font-medium text-[color:var(--fg)]"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 rounded-full bg-[color:var(--fg)] py-3 text-sm font-medium text-[color:var(--bg)] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  helper,
  children,
}: {
  label: string;
  value: string;
  error?: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex-1">
      <label className="mb-1.5 block text-sm text-[color:var(--fg)]">
        {label}
      </label>
      {children}
      {error ? (
        <p className="mt-1 text-xs text-[color:var(--red)]">{error}</p>
      ) : (
        helper && (
          <p className="mt-1 text-xs text-[color:var(--accent)]">{helper}</p>
        )
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-xl border bg-transparent px-4 py-2.5 text-sm outline-none focus:border-[color:var(--fg)] ${
    hasError ? "border-[color:var(--red)]" : "border-[color:var(--border)]"
  }`;
}
