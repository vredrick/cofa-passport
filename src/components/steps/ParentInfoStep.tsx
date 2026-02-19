'use client';

import { useState, useCallback, useEffect } from 'react';
import { ParentInfo, ValidationErrors, TriState } from '@/types/form';
import { validateParentInfo } from '@/lib/validation';
import { TextInput, DateInput, YesNoToggle } from '@/components/ui';

interface ParentInfoStepProps {
  parentLabel: string;
  data: ParentInfo;
  onChange: (data: ParentInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ParentInfoStep({ parentLabel, data, onChange, onNext, onBack }: ParentInfoStepProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const update = useCallback(
    (field: keyof ParentInfo, value: string) => {
      onChange({ ...data, [field]: value });
    },
    [data, onChange]
  );

  useEffect(() => {
    if (hasSubmitted) {
      setErrors(validateParentInfo(data, parentLabel));
    }
  }, [data, hasSubmitted, parentLabel]);

  const handleContinue = () => {
    setHasSubmitted(true);
    const errs = validateParentInfo(data, parentLabel);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-4xl font-bold tracking-tight text-ink">{parentLabel}&apos;s Information</h2>
        <p className="text-lg text-muted mt-2">Enter your {parentLabel.toLowerCase()}&apos;s details.</p>
      </div>

      <div className="card">
        <h3 className="card-title">Full Name</h3>
        <TextInput label="First Name" value={data.firstName} onChange={(v) => update('firstName', v)} error={errors.firstName} placeholder="SAU" required />
        <TextInput label="Middle Name" value={data.middleName} onChange={(v) => update('middleName', v)} placeholder="SANTOS" />
        <TextInput label="Last Name" value={data.lastName} onChange={(v) => update('lastName', v)} error={errors.lastName} placeholder="ROBERT" required />
      </div>

      <hr className="border-surface" />

      <div className="card">
        <h3 className="card-title">Birth Information</h3>
        <DateInput label="Date of Birth" value={data.birthDate} onChange={(v) => update('birthDate', v)} error={errors.birthDate} />
        <TextInput label="Place of Birth" value={data.birthPlace} onChange={(v) => update('birthPlace', v)} placeholder="WENO, CHUUK" />
      </div>

      <hr className="border-surface" />

      <div className="card">
        <h3 className="card-title">Citizenship</h3>
        <YesNoToggle label={`Is your ${parentLabel.toLowerCase()} an FSM citizen?`} value={data.fsmCitizen} onChange={(v) => update('fsmCitizen', v as TriState)} error={errors.fsmCitizen} />
        {data.fsmCitizen === 'no' && (
          <TextInput label="Nationality" value={data.nationality} onChange={(v) => update('nationality', v)} error={errors.nationality} placeholder="UNITED STATES" required />
        )}
      </div>

      <div className="sticky bottom-0 z-10 -mx-4 px-4 sm:-mx-8 sm:px-8 bg-surface border-t border-ocean/10 py-4 flex gap-3">
        <button type="button" onClick={onBack} className="btn-secondary">
          Back
        </button>
        <button type="button" onClick={handleContinue} className="btn-primary">
          Continue
        </button>
      </div>
    </div>
  );
}
