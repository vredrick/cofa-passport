import { describe, it, expect } from 'vitest';
import {
  validatePassportType,
  validateApplicantInfo,
  validateParentInfo,
  formatDateInput,
} from './validation';
import {
  INITIAL_APPLICANT,
  INITIAL_PARENT,
} from '@/types/form';

// ---------------------------------------------------------------------------
// validatePassportType
// ---------------------------------------------------------------------------
describe('validatePassportType', () => {
  it('returns error when type is empty', () => {
    const errors = validatePassportType('');
    expect(errors.passportType).toBe('Please select a passport type');
  });

  it('returns no errors for valid types', () => {
    expect(validatePassportType('ordinary')).toEqual({});
    expect(validatePassportType('official')).toEqual({});
    expect(validatePassportType('diplomatic')).toEqual({});
  });
});

// ---------------------------------------------------------------------------
// validateApplicantInfo
// ---------------------------------------------------------------------------
describe('validateApplicantInfo', () => {
  const validApplicant = {
    ...INITIAL_APPLICANT,
    lastName: 'DOE',
    firstName: 'JOHN',
    dateOfBirth: '01/15/1990',
    gender: 'mr' as const,
    heightFeet: '5',
    heightInches: '10',
    hairColor: 'BLACK',
    eyeColor: 'BROWN',
    birthPlace: 'POHNPEI',
    homeAddress: {
      street: '123 MAIN ST',
      city: 'KOLONIA',
      state: 'POHNPEI',
      zip: '96941',
      country: 'FSM',
    },
    shippingAddress: {
      street: '123 MAIN ST',
      city: 'KOLONIA',
      state: 'POHNPEI',
      zip: '96941',
      country: 'FSM',
    },
    shippingAddressSameAsHome: true,
    email: 'john@example.com',
    phone: '555-1234',
    previousPassport: 'no' as const,
    convicted: 'no' as const,
    nameChanged: 'no' as const,
    citizenshipMethod: 'birth' as const,
  };

  it('returns no errors for a fully valid applicant', () => {
    const errors = validateApplicantInfo(validApplicant);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('requires lastName and firstName', () => {
    const errors = validateApplicantInfo({
      ...validApplicant,
      lastName: '',
      firstName: '',
    });
    expect(errors.lastName).toBeDefined();
    expect(errors.firstName).toBeDefined();
  });

  it('validates date of birth format', () => {
    const errors = validateApplicantInfo({
      ...validApplicant,
      dateOfBirth: '1990-01-15',
    });
    expect(errors.dateOfBirth).toBe('Use format MM/DD/YYYY');
  });

  it('requires date of birth', () => {
    const errors = validateApplicantInfo({
      ...validApplicant,
      dateOfBirth: '',
    });
    expect(errors.dateOfBirth).toBe('Date of birth is required');
  });

  it('validates height feet range (3-7)', () => {
    const tooLow = validateApplicantInfo({ ...validApplicant, heightFeet: '2' });
    expect(tooLow.heightFeet).toBe('3-7 ft');

    const tooHigh = validateApplicantInfo({ ...validApplicant, heightFeet: '8' });
    expect(tooHigh.heightFeet).toBe('3-7 ft');

    const valid = validateApplicantInfo({ ...validApplicant, heightFeet: '5' });
    expect(valid.heightFeet).toBeUndefined();
  });

  it('validates height inches range (0-11)', () => {
    const tooHigh = validateApplicantInfo({ ...validApplicant, heightInches: '12' });
    expect(tooHigh.heightInches).toBe('0-11 in');

    const valid = validateApplicantInfo({ ...validApplicant, heightInches: '0' });
    expect(valid.heightInches).toBeUndefined();
  });

  it('validates email format', () => {
    const errors = validateApplicantInfo({
      ...validApplicant,
      email: 'notanemail',
    });
    expect(errors.email).toBe('Enter a valid email address');
  });

  it('skips shipping address validation when same as home', () => {
    const errors = validateApplicantInfo({
      ...validApplicant,
      shippingAddressSameAsHome: true,
      shippingAddress: { street: '', city: '', state: '', zip: '', country: '' },
    });
    expect(errors['shippingAddress.street']).toBeUndefined();
  });

  it('validates shipping address when not same as home', () => {
    const errors = validateApplicantInfo({
      ...validApplicant,
      shippingAddressSameAsHome: false,
      shippingAddress: { street: '', city: '', state: '', zip: '', country: '' },
    });
    expect(errors['shippingAddress.street']).toBeDefined();
    expect(errors['shippingAddress.city']).toBeDefined();
    expect(errors['shippingAddress.state']).toBeDefined();
    expect(errors['shippingAddress.zip']).toBeDefined();
    expect(errors['shippingAddress.country']).toBeDefined();
  });

  it('requires previous passport details when previousPassport is yes', () => {
    const errors = validateApplicantInfo({
      ...validApplicant,
      previousPassport: 'yes',
      previousPassportDetails: { country: '', date: '', passportNumber: '' },
    });
    expect(errors['previousPassportDetails.country']).toBeDefined();
    expect(errors['previousPassportDetails.date']).toBeDefined();
    expect(errors['previousPassportDetails.passportNumber']).toBeDefined();
  });

  it('requires convicted explanation when convicted is yes', () => {
    const errors = validateApplicantInfo({
      ...validApplicant,
      convicted: 'yes',
      convictedExplanation: '',
    });
    expect(errors.convictedExplanation).toBeDefined();
  });

  it('requires name changed explanation when nameChanged is yes', () => {
    const errors = validateApplicantInfo({
      ...validApplicant,
      nameChanged: 'yes',
      nameChangedExplanation: '',
    });
    expect(errors.nameChangedExplanation).toBeDefined();
  });

  it('returns all errors for blank initial data', () => {
    const errors = validateApplicantInfo(INITIAL_APPLICANT);
    expect(Object.keys(errors).length).toBeGreaterThan(5);
  });
});

// ---------------------------------------------------------------------------
// validateParentInfo
// ---------------------------------------------------------------------------
describe('validateParentInfo', () => {
  it('requires lastName and firstName', () => {
    const errors = validateParentInfo(INITIAL_PARENT, 'Father');
    expect(errors.lastName).toBe("Father's last name is required");
    expect(errors.firstName).toBe("Father's first name is required");
  });

  it('validates birthDate format when provided', () => {
    const errors = validateParentInfo(
      { ...INITIAL_PARENT, lastName: 'DOE', firstName: 'JAMES', birthDate: '1990-01-01', fsmCitizen: 'yes' },
      'Father',
    );
    expect(errors.birthDate).toBe('Use format MM/DD/YYYY');
  });

  it('does not require birthDate when empty', () => {
    const errors = validateParentInfo(
      { ...INITIAL_PARENT, lastName: 'DOE', firstName: 'JAMES', fsmCitizen: 'yes' },
      'Father',
    );
    expect(errors.birthDate).toBeUndefined();
  });

  it('requires nationality when not FSM citizen', () => {
    const errors = validateParentInfo(
      { ...INITIAL_PARENT, lastName: 'DOE', firstName: 'JANE', fsmCitizen: 'no', nationality: '' },
      'Mother',
    );
    expect(errors.nationality).toBe('Nationality is required when not an FSM citizen');
  });

  it('does not require nationality when FSM citizen', () => {
    const errors = validateParentInfo(
      { ...INITIAL_PARENT, lastName: 'DOE', firstName: 'JANE', fsmCitizen: 'yes', nationality: '' },
      'Mother',
    );
    expect(errors.nationality).toBeUndefined();
  });

  it('returns no errors for valid parent', () => {
    const errors = validateParentInfo(
      { lastName: 'DOE', firstName: 'JAMES', middleName: '', birthDate: '06/15/1960', birthPlace: 'CHUUK', fsmCitizen: 'yes', nationality: '' },
      'Father',
    );
    expect(Object.keys(errors)).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// formatDateInput
// ---------------------------------------------------------------------------
describe('formatDateInput', () => {
  it('returns digits only for 1-2 chars', () => {
    expect(formatDateInput('1')).toBe('1');
    expect(formatDateInput('12')).toBe('12');
  });

  it('inserts first slash after 2 digits', () => {
    expect(formatDateInput('123')).toBe('12/3');
    expect(formatDateInput('1234')).toBe('12/34');
  });

  it('inserts second slash after 4 digits', () => {
    expect(formatDateInput('12345')).toBe('12/34/5');
    expect(formatDateInput('12152000')).toBe('12/15/2000');
  });

  it('limits to 8 digits', () => {
    expect(formatDateInput('123456789')).toBe('12/34/5678');
  });

  it('strips non-digit characters', () => {
    expect(formatDateInput('12/15/2000')).toBe('12/15/2000');
    expect(formatDateInput('ab12cd34ef56')).toBe('12/34/56');
  });

  it('handles empty string', () => {
    expect(formatDateInput('')).toBe('');
  });
});
