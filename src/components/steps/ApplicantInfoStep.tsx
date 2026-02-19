'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ApplicantInfo, Address, PreviousPassportInfo, ValidationErrors, Gender, TriState, CitizenshipMethod } from '@/types/form';
import { validateApplicantInfo } from '@/lib/validation';
import { TextInput, DateInput, YesNoToggle, RadioGroup } from '@/components/ui';

const GENDER_OPTIONS = [
  { value: 'miss', label: 'Miss' },
  { value: 'mrs', label: 'Mrs.' },
  { value: 'ms', label: 'Ms.' },
  { value: 'mr', label: 'Mr.' },
];

const CITIZENSHIP_OPTIONS = [
  { value: 'birth', label: 'Birth' },
  { value: 'naturalization', label: 'Naturalization' },
  { value: 'other', label: 'Other' },
];

interface ApplicantInfoStepProps {
  data: ApplicantInfo;
  onChange: (data: ApplicantInfo) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function ApplicantInfoStep({ data, onChange, onNext, onBack }: ApplicantInfoStepProps) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const update = useCallback(
    (field: keyof ApplicantInfo, value: string | boolean) => {
      onChange({ ...data, [field]: value });
    },
    [data, onChange]
  );

  const updateAddress = useCallback(
    (key: 'homeAddress' | 'shippingAddress', field: keyof Address, value: string) => {
      onChange({ ...data, [key]: { ...data[key], [field]: value } });
    },
    [data, onChange]
  );

  const updatePrevPassport = useCallback(
    (field: keyof PreviousPassportInfo, value: string) => {
      onChange({ ...data, previousPassportDetails: { ...data.previousPassportDetails, [field]: value } });
    },
    [data, onChange]
  );

  // Live validation after first submit
  useEffect(() => {
    if (hasSubmitted) {
      const errs = validateApplicantInfo(data);
      setErrors(errs);
    }
  }, [data, hasSubmitted]);

  const handleContinue = () => {
    setHasSubmitted(true);
    const errs = validateApplicantInfo(data);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onNext();
    } else {
      // Scroll to first error
      const el = formRef.current?.querySelector(`[aria-invalid="true"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="space-y-6" ref={formRef}>
      <div>
        <h2 className="text-4xl font-bold tracking-tight text-ink">Applicant Information</h2>
        <p className="text-lg text-muted mt-2">Enter your personal details as they appear on official documents.</p>
      </div>

      {/* Name Section */}
      <div className="card">
        <h3 className="card-title">Full Name</h3>
        <TextInput label="First Name" value={data.firstName} onChange={(v) => update('firstName', v)} error={errors.firstName} placeholder="SAU" required />
        <TextInput label="Middle Name" value={data.middleName} onChange={(v) => update('middleName', v)} placeholder="SANTOS" />
        <TextInput label="Last Name" value={data.lastName} onChange={(v) => update('lastName', v)} error={errors.lastName} placeholder="ROBERT" required />
        <TextInput label="Other Names Used" value={data.otherNames} onChange={(v) => update('otherNames', v)} placeholder="Leave blank if none" />
      </div>

      <hr className="border-surface" />

      {/* Personal Details */}
      <div className="card">
        <h3 className="card-title">Personal Details</h3>
        <DateInput label="Date of Birth" value={data.dateOfBirth} onChange={(v) => update('dateOfBirth', v)} error={errors.dateOfBirth} required />
        <RadioGroup label="Title *" options={GENDER_OPTIONS} value={data.gender} onChange={(v) => update('gender', v as Gender)} error={errors.gender} variant="inline" />
        <div className="grid grid-cols-2 gap-3">
          <TextInput label="Height (ft)" value={data.heightFeet} onChange={(v) => update('heightFeet', v)} error={errors.heightFeet} placeholder="5" inputMode="numeric" maxLength={1} required />
          <TextInput label="Height (in)" value={data.heightInches} onChange={(v) => update('heightInches', v)} error={errors.heightInches} placeholder="8" inputMode="numeric" maxLength={2} required />
        </div>
        <TextInput label="Hair Color" value={data.hairColor} onChange={(v) => update('hairColor', v)} error={errors.hairColor} placeholder="BLACK" required />
        <TextInput label="Eye Color" value={data.eyeColor} onChange={(v) => update('eyeColor', v)} error={errors.eyeColor} placeholder="BROWN" required />
      </div>

      <hr className="border-surface" />

      {/* Birth & Contact */}
      <div className="card">
        <h3 className="card-title">Birth & Contact</h3>
        <TextInput label="Place of Birth" value={data.birthPlace} onChange={(v) => update('birthPlace', v)} error={errors.birthPlace} placeholder="WENO, CHUUK" required />
        <TextInput label="Email" value={data.email} onChange={(v) => update('email', v)} error={errors.email} placeholder="john@example.com" type="email" inputMode="email" uppercase={false} required />
        <TextInput label="Phone" value={data.phone} onChange={(v) => update('phone', v)} error={errors.phone} placeholder="+691 320 1234" type="tel" inputMode="tel" uppercase={false} required />
      </div>

      <hr className="border-surface" />

      {/* Home Address */}
      <div className="card">
        <h3 className="card-title">Home Address</h3>
        <TextInput label="Street Address" value={data.homeAddress.street} onChange={(v) => updateAddress('homeAddress', 'street', v)} error={errors['homeAddress.street']} placeholder="P.O. BOX 123" required />
        <TextInput label="City" value={data.homeAddress.city} onChange={(v) => updateAddress('homeAddress', 'city', v)} error={errors['homeAddress.city']} placeholder="HONOLULU" required />
        <TextInput label="State" value={data.homeAddress.state} onChange={(v) => updateAddress('homeAddress', 'state', v)} error={errors['homeAddress.state']} placeholder="HI" required />
        <TextInput label="ZIP Code" value={data.homeAddress.zip} onChange={(v) => updateAddress('homeAddress', 'zip', v)} error={errors['homeAddress.zip']} placeholder="96819" required />
        <TextInput label="Country" value={data.homeAddress.country} onChange={(v) => updateAddress('homeAddress', 'country', v)} error={errors['homeAddress.country']} placeholder="USA" required />
      </div>

      <hr className="border-surface" />

      {/* Shipping Address */}
      <div className="card">
        <h3 className="card-title">Shipping Address</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={data.shippingAddressSameAsHome}
            onChange={(e) => update('shippingAddressSameAsHome', e.target.checked)}
            className="w-5 h-5 rounded border-[3px] border-ocean text-ocean focus:ring-4 focus:ring-gold-focus"
          />
          <span className="text-base text-ink font-medium">Same as home address</span>
        </label>
        {!data.shippingAddressSameAsHome && (
          <>
            <TextInput label="Street Address" value={data.shippingAddress.street} onChange={(v) => updateAddress('shippingAddress', 'street', v)} error={errors['shippingAddress.street']} placeholder="1234 MAIN ST" required />
            <TextInput label="City" value={data.shippingAddress.city} onChange={(v) => updateAddress('shippingAddress', 'city', v)} error={errors['shippingAddress.city']} placeholder="HONOLULU" required />
            <TextInput label="State" value={data.shippingAddress.state} onChange={(v) => updateAddress('shippingAddress', 'state', v)} error={errors['shippingAddress.state']} placeholder="HI" required />
            <TextInput label="ZIP Code" value={data.shippingAddress.zip} onChange={(v) => updateAddress('shippingAddress', 'zip', v)} error={errors['shippingAddress.zip']} placeholder="96819" required />
            <TextInput label="Country" value={data.shippingAddress.country} onChange={(v) => updateAddress('shippingAddress', 'country', v)} error={errors['shippingAddress.country']} placeholder="USA" required />
          </>
        )}
      </div>

      <hr className="border-surface" />

      {/* Previous Passport */}
      <div className="card">
        <h3 className="card-title">Previous Passport</h3>
        <YesNoToggle label="Have you held a previous passport?" value={data.previousPassport} onChange={(v) => update('previousPassport', v as TriState)} error={errors.previousPassport} />
        {data.previousPassport === 'yes' && (
          <>
            <TextInput label="Country of Issue" value={data.previousPassportDetails.country} onChange={(v) => updatePrevPassport('country', v)} error={errors['previousPassportDetails.country']} placeholder="FSM" required />
            <DateInput label="Date of Issue" value={data.previousPassportDetails.date} onChange={(v) => updatePrevPassport('date', v)} error={errors['previousPassportDetails.date']} required />
            <TextInput label="Passport Number" value={data.previousPassportDetails.passportNumber} onChange={(v) => updatePrevPassport('passportNumber', v)} error={errors['previousPassportDetails.passportNumber']} placeholder="A12345678" required />
          </>
        )}
      </div>

      <hr className="border-surface" />

      {/* Legal Section */}
      <div className="card">
        <h3 className="card-title">Legal Information</h3>
        <YesNoToggle label="Have you ever been convicted of a crime?" value={data.convicted} onChange={(v) => update('convicted', v as TriState)} error={errors.convicted} />
        {data.convicted === 'yes' && (
          <TextInput label="Please explain" value={data.convictedExplanation} onChange={(v) => update('convictedExplanation', v)} error={errors.convictedExplanation} required />
        )}
        <YesNoToggle label="Have you ever changed your name?" value={data.nameChanged} onChange={(v) => update('nameChanged', v as TriState)} error={errors.nameChanged} />
        {data.nameChanged === 'yes' && (
          <TextInput label="Previous name(s) and details" value={data.nameChangedExplanation} onChange={(v) => update('nameChangedExplanation', v)} error={errors.nameChangedExplanation} required />
        )}
      </div>

      <hr className="border-surface" />

      {/* Citizenship */}
      <div className="card">
        <h3 className="card-title">FSM Citizenship</h3>
        <RadioGroup label="How did you acquire FSM citizenship? *" options={CITIZENSHIP_OPTIONS} value={data.citizenshipMethod} onChange={(v) => update('citizenshipMethod', v as CitizenshipMethod)} error={errors.citizenshipMethod} />
      </div>

      {/* Navigation */}
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
