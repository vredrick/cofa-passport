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
      <p className="block text-sm font-medium text-gray-700 mb-2">{label}</p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange(value === 'yes' ? '' : 'yes')}
          className={`flex-1 py-2.5 rounded-lg border-2 font-medium text-sm transition-colors ${
            value === 'yes'
              ? 'border-ocean bg-ocean text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => onChange(value === 'no' ? '' : 'no')}
          className={`flex-1 py-2.5 rounded-lg border-2 font-medium text-sm transition-colors ${
            value === 'no'
              ? 'border-ocean bg-ocean text-white'
              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
          }`}
        >
          No
        </button>
      </div>
      {error && <p className="error-text" role="alert">{error}</p>}
    </div>
  );
}
