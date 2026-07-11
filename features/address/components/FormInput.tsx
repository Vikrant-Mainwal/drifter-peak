import type { UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps {
  label: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
  required?: boolean;
  type?: string;
  maxLength?: number;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  autoFocus?: boolean;
}

export function FormInput({
  label,
  placeholder,
  registration,
  error,
  required,
  type = 'text',
  maxLength,
  inputMode,
  autoFocus,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={registration.name} className="text-xs font-medium text-gray-500">
        {label}
        {required && <span className="text-rose-500"> *</span>}
      </label>
      <input
        id={registration.name}
        type={type}
        placeholder={placeholder}
        maxLength={maxLength}
        inputMode={inputMode}
        autoFocus={autoFocus}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${registration.name}-error` : undefined}
        {...registration}
        className={`w-full rounded-md border bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:ring-1 ${
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
