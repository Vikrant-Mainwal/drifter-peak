"use client";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  PRODUCT_FORM_FIELDS,
  type ProductInsert,
  type FormField,
} from "@/types/product.types";

interface ProductFormProps {
  initialValues?: Partial<ProductInsert>;
  onSubmit: (data: ProductInsert) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
}

// Render a single field based on its type config
function RenderField({
  field,
  value,
  onChange,
  error,
}: {
  field: FormField;
  value: unknown;
  onChange: (val: unknown) => void;
  error?: string;
}) {
  switch (field.type) {
    case "text":
    case "number":
      return (
        <Input
          label={field.label}
          type={field.type}
          placeholder={field.placeholder}
          value={String(value ?? "")}
          error={error}
          required={field.required}
          onChange={(e) =>
            onChange(field.type === "number" ? +e.target.value : e.target.value)
          }
        />
      );

    case "textarea":
      return (
        <div>
          <label
            className="block font-mono text-[10px] tracking-[0.25em] mb-2"
            style={{ color: error ? "var(--red)" : "var(--muted)" }}
          >
            {field.label}
            {field.required && " *"}
            {error ? ` — ${error}` : ""}
          </label>
          <textarea
            rows={3}
            className={cn(
              "dp-input w-full resize-none",
              error && "border-[var(--red)]",
            )}
            placeholder={field.placeholder}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "toggle":
      return (
        <div className="flex items-center justify-between py-2">
          <span
            className="font-mono text-[10px] tracking-[0.25em]"
            style={{ color: "var(--muted)" }}
          >
            {field.label}
          </span>
          <button
            type="button"
            onClick={() => onChange(!value)}
            className="w-11 h-6 relative border transition-all duration-200"
            style={{
              borderColor: value ? "var(--accent)" : "var(--border)",
              background: value ? "rgba(232,255,0,0.1)" : "transparent",
            }}
          >
            <div
              className="absolute top-0.5 h-5 w-5 transition-all duration-200"
              style={{
                left: value ? "calc(100% - 22px)" : "2px",
                background: value ? "var(--accent)" : "var(--muted)",
              }}
            />
          </button>
        </div>
      );

    case "multiselect":
      return (
        <div>
          <label
            className="block font-mono text-[10px] tracking-[0.25em] mb-2"
            style={{ color: error ? "var(--red)" : "var(--muted)" }}
          >
            {field.label}
            {field.required && " *"}
            {error ? ` — ${error}` : ""}
          </label>
          <div className="flex flex-wrap gap-2">
            {field.options?.map((opt) => {
              const selected =
                Array.isArray(value) && (value as string[]).includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    const arr = Array.isArray(value)
                      ? [...(value as string[])]
                      : [];
                    onChange(
                      selected ? arr.filter((v) => v !== opt) : [...arr, opt],
                    );
                  }}
                  className="btn-press w-12 h-12 font-mono text-sm border transition-all"
                  style={{
                    borderColor: selected ? "var(--fg)" : "var(--border)",
                    background: selected ? "var(--fg)" : "transparent",
                    color: selected ? "var(--bg)" : "var(--muted)",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      );

    case "image":
      return (
        <div>
          <label
            className="block font-mono text-[10px] tracking-[0.25em] mb-2"
            style={{ color: error ? "var(--red)" : "var(--muted)" }}
          >
            {field.label}
            {field.required && " *"}
            {error ? ` — ${error}` : ""}
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;

              const fileArray = Array.from(files).slice(0, 3); // limit 3 images

              // store files temporarily
              onChange(fileArray);
            }}
          />

          {/* Preview */}
          <div className="flex gap-3 mt-3">
            {Array.isArray(value) &&
              value.map((item: any, i: number) => {
                if (!item) return null;

                const src =
                  item instanceof File ? URL.createObjectURL(item) : item; // already a URL

                console.log(item)

                return (
                  <img
                    key={i}
                    src={src}
                    className="w-20 h-20 object-cover border"
                  />
                );
              })}
          </div>
        </div>
      );

    default:
      return null;
  }
}

export function ProductForm({
  initialValues = {},
  onSubmit,
  loading,
  submitLabel = "Save Product",
}: ProductFormProps) {
  const [values, setValues] = useState<Partial<ProductInsert>>(initialValues);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ProductInsert, string>>
  >({});

  const set = (key: keyof ProductInsert, val: unknown) =>
    setValues((v) => ({ ...v, [key]: val }));

  const validate = () => {
    const e: typeof errors = {};
    PRODUCT_FORM_FIELDS.forEach((field) => {
      if (field.required) {
        const v = values[field.name as keyof ProductInsert];
        const empty =
          v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
        if (empty) e[field.name as keyof ProductInsert] = "Required";
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit(values as ProductInsert);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Config-driven grid — change PRODUCT_FORM_FIELDS to add/remove fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PRODUCT_FORM_FIELDS.map((field) => (
          <div
            key={field.name}
            className={field.span === "full" ? "md:col-span-2" : ""}
          >
            <RenderField
              field={field}
              value={values[field.name as keyof ProductInsert]}
              onChange={(val) => set(field.name as keyof ProductInsert, val)}
              error={errors[field.name as keyof ProductInsert]}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-3 mt-8">
        <Button type="submit" size="lg" loading={loading} fullWidth>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
