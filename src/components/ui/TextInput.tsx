'use client';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  uppercase?: boolean;
  type?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  maxLength?: number;
  required?: boolean;
}

export default function TextInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  uppercase = true,
  type = 'text',
  inputMode = 'text',
  maxLength,
  required,
}: TextInputProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <label htmlFor={id} className="block text-lg font-bold text-ink mb-1">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        value={value}
        onChange={(e) => onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`form-input ${error ? 'form-input-error' : ''} ${uppercase ? 'uppercase' : ''}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} className="error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
