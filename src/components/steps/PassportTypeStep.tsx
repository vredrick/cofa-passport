'use client';

import { useState } from 'react';
import { PassportType, ValidationErrors } from '@/types/form';
import { validatePassportType } from '@/lib/validation';
import { RadioGroup } from '@/components/ui';

const PASSPORT_OPTIONS = [
  { value: 'ordinary', label: 'Ordinary Passport' },
  { value: 'official', label: 'Official Passport' },
  { value: 'diplomatic', label: 'Diplomatic Passport' },
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
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Passport Type</h2>
        <p className="text-sm text-gray-500 mt-1">Select the type of passport you are applying for.</p>
      </div>

      <div className="card">
        <RadioGroup
          label="Type of Passport"
          options={PASSPORT_OPTIONS}
          value={value}
          onChange={(v) => {
            onChange(v as PassportType);
            if (errors.passportType) setErrors({});
          }}
          error={errors.passportType}
        />
      </div>

      <button type="button" onClick={handleContinue} className="btn-primary">
        Continue
      </button>
    </div>
  );
}
