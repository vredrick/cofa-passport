'use client';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  variant?: 'stacked' | 'inline';
}

export default function RadioGroup({ label, options, value, onChange, error, variant = 'stacked' }: RadioGroupProps) {
  if (variant === 'inline') {
    return (
      <div>
        <p className="block text-lg font-bold text-ink mb-2">{label}</p>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`px-6 py-3 rounded-full border text-base font-bold transition-all focus:outline-none focus:ring-4 focus:ring-gold-focus ${
                value === option.value
                  ? 'bg-ocean text-white border-ocean'
                  : 'bg-white text-ink border-ocean/15 hover:border-ocean/40'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {error && <p className="error-text" role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <p className="block text-lg font-bold text-ink mb-2">{label}</p>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all focus:outline-none focus:ring-4 focus:ring-gold-focus ${
              value === option.value
                ? 'border-ocean bg-ocean/5 shadow-sm'
                : 'border-ocean/15 bg-white hover:border-ocean/40'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                value === option.value ? 'border-ocean' : 'border-ocean/25'
              }`}
            >
              {value === option.value && (
                <span className="w-2.5 h-2.5 rounded-full bg-ocean" />
              )}
            </span>
            <span className={`text-base font-bold ${value === option.value ? 'text-ocean' : 'text-ink'}`}>
              {option.label}
            </span>
          </button>
        ))}
      </div>
      {error && <p className="error-text" role="alert">{error}</p>}
    </div>
  );
}
