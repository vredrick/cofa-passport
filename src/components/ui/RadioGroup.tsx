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
        <p className="block text-sm font-medium text-gray-700 mb-2">{label}</p>
        <div className="flex flex-wrap gap-2">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-colors ${
                value === option.value
                  ? 'bg-ocean text-white border-ocean'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
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
      <p className="block text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-colors ${
              value === option.value
                ? 'border-ocean bg-ocean/5'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                value === option.value ? 'border-ocean' : 'border-gray-400'
              }`}
            >
              {value === option.value && (
                <span className="w-2.5 h-2.5 rounded-full bg-ocean" />
              )}
            </span>
            <span className={`text-sm font-medium ${value === option.value ? 'text-ocean' : 'text-gray-700'}`}>
              {option.label}
            </span>
          </button>
        ))}
      </div>
      {error && <p className="error-text" role="alert">{error}</p>}
    </div>
  );
}
