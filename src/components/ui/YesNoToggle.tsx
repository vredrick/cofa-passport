'use client';

import { TriState } from '@/types/form';

interface YesNoToggleProps {
  label: string;
  value: TriState;
  onChange: (value: TriState) => void;
  error?: string;
}

export default function YesNoToggle({ label, value, onChange, error }: YesNoToggleProps) {
  return (
    <div>
      <p className="block text-lg font-bold text-ink mb-2">{label}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(value === 'yes' ? '' : 'yes')}
          className={`flex-1 h-[56px] rounded-lg border-[3px] font-bold text-base transition-colors focus:outline-none focus:ring-4 focus:ring-gold-focus ${
            value === 'yes'
              ? 'border-ocean bg-ocean text-white'
              : 'border-gray-300 bg-white text-ink hover:border-ocean/50'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(value === 'no' ? '' : 'no')}
          className={`flex-1 h-[56px] rounded-lg border-[3px] font-bold text-base transition-colors focus:outline-none focus:ring-4 focus:ring-gold-focus ${
            value === 'no'
              ? 'border-ocean bg-ocean text-white'
              : 'border-gray-300 bg-white text-ink hover:border-ocean/50'
          }`}
        >
          No
        </button>
      </div>
      {error && <p className="error-text" role="alert">{error}</p>}
    </div>
  );
}
