'use client';

import { useState } from 'react';
import { PassportType, ValidationErrors } from '@/types/form';
import { validatePassportType } from '@/lib/validation';

const PASSPORT_OPTIONS = [
  { value: 'ordinary', label: 'Ordinary Passport', description: 'Standard travel document for citizens', icon: 'menu_book' },
  { value: 'official', label: 'Official Passport', description: 'For government officials on duty', icon: 'assured_workload' },
  { value: 'diplomatic', label: 'Diplomatic Passport', description: 'For diplomats and senior officials', icon: 'shield_person' },
];

interface PassportTypeStepProps {
  value: PassportType;
  onChange: (value: PassportType) => void;
  onNext: () => void;
}

export default function PassportTypeStep({ value, onChange, onNext }: PassportTypeStepProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleContinue = () => {
    const errs = validatePassportType(value);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-bold tracking-tight text-ink">Passport Type</h2>
        <p className="text-lg text-muted mt-2">Select the type of passport you are applying for.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {PASSPORT_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              onChange(option.value as PassportType);
              if (errors.passportType) setErrors({});
            }}
            className={`flex flex-col items-center text-center p-6 rounded-xl border-[3px] transition-all focus:outline-none focus:ring-4 focus:ring-gold-focus ${
              value === option.value
                ? 'border-ocean shadow-hard bg-white'
                : 'border-gray-200 bg-white hover:border-ocean/50'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[48px] mb-3 ${
                value === option.value ? 'text-ocean' : 'text-muted'
              }`}
            >
              {option.icon}
            </span>
            <span className={`text-lg font-bold ${value === option.value ? 'text-ocean' : 'text-ink'}`}>
              {option.label}
            </span>
            <span className="text-sm text-muted mt-1">{option.description}</span>
          </button>
        ))}
      </div>

      {errors.passportType && (
        <p className="error-text" role="alert">{errors.passportType}</p>
      )}

      <button type="button" onClick={handleContinue} className="btn-primary">
        Continue
      </button>
    </div>
  );
}
