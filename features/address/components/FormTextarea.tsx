import type { UseFormRegisterReturn } from 'react-hook-form';

interface FormTextareaProps {
  label: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  required?: boolean;
  rows?: number;
  maxLength?: number;
}

export function FormTextarea({
  label,
  placeholder,
  registration,
  error,
  required,
  rows = 3,
  maxLength,
}: FormTextareaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={registration.name} className="text-xs font-medium text-gray-500">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      <textarea
        id={registration.name}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${registration.name}-error` : undefined}
        {...registration}
        className={`w-full resize-none rounded-md border bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:ring-1 ${
          error
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-rose-500 focus:ring-rose-500'
        }`}
      />
      {error && (
        <p id={`${registration.name}-error`} className="text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
