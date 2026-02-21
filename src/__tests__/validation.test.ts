import { describe, it, expect } from 'vitest';
import {
  validatePassportType,
  validateApplicantInfo,
  validateParentInfo,
  formatDateInput,
} from '@/lib/validation';
import {
  INITIAL_APPLICANT,
  INITIAL_ADDRESS,
  INITIAL_PREVIOUS_PASSPORT,
  INITIAL_PARENT,
} from '@/types/form';
import type { ApplicantInfo, ParentInfo } from '@/types/form';

// Helper to create a fully-valid applicant
function validApplicant(): ApplicantInfo {
  return {
    ...INITIAL_APPLICANT,
    lastName: 'ROBERT',
    firstName: 'SAU',
    dateOfBirth: '01/15/1990',
    gender: 'mr',
    heightFeet: '5',
    heightInches: '8',
    hairColor: 'BLACK',
    eyeColor: 'BROWN',
    birthPlace: 'WENO, CHUUK',
    homeAddress: {
      street: '123 Main St',
      city: 'Honolulu',
      state: 'HI',
      zip: '96819',
      country: 'USA',
    },
    shippingAddressSameAsHome: true,
    shippingAddress: { ...INITIAL_ADDRESS },
    email: 'john@example.com',
    phone: '+691 320 1234',
    previousPassport: 'no',
    previousPassportDetails: { ...INITIAL_PREVIOUS_PASSPORT },
    convicted: 'no',
    convictedExplanation: '',
    nameChanged: 'no',
    nameChangedExplanation: '',
    citizenshipMethod: 'birth',
  };
}

// Helper to create a fully-valid parent
function validParent(): ParentInfo {
  return {
    ...INITIAL_PARENT,
    lastName: 'ROBERT',
    firstName: 'JOHN',
    middleName: '',
    birthDate: '05/20/1960',
    birthPlace: 'WENO',
    fsmCitizen: 'yes',
    nationality: '',
  };
}

// ============================================================
// validatePassportType
// ============================================================
describe('validatePassportType', () => {
  it('returns error when type is empty string', () => {
    const errors = validatePassportType('');
    expect(errors.passportType).toBe('Please select a passport type');
  });

  it('returns no errors for "ordinary"', () => {
    expect(Object.keys(validatePassportType('ordinary'))).toHaveLength(0);
  });

  it('returns no errors for "official"', () => {
    expect(Object.keys(validatePassportType('official'))).toHaveLength(0);
  });

  it('returns no errors for "diplomatic"', () => {
    expect(Object.keys(validatePassportType('diplomatic'))).toHaveLength(0);
  });
});

// ============================================================
// validateApplicantInfo
// ============================================================
describe('validateApplicantInfo', () => {
  it('returns no errors for a fully valid applicant', () => {
    const errors = validateApplicantInfo(validApplicant());
    expect(Object.keys(errors)).toHaveLength(0);
  });

  // --- Required fields ---
  describe('required fields', () => {
    it.each([
      ['lastName', 'Last name is required'],
      ['firstName', 'First name is required'],
      ['hairColor', 'Hair color is required'],
      ['eyeColor', 'Eye color is required'],
      ['birthPlace', 'Birth place is required'],
      ['phone', 'Phone number is required'],
    ])('requires %s', (field, expectedMsg) => {
      const data = { ...validApplicant(), [field]: '' };
      const errors = validateApplicantInfo(data);
      expect(errors[field]).toBe(expectedMsg);
    });

    it('requires email', () => {
      const data = { ...validApplicant(), email: '' };
      const errors = validateApplicantInfo(data);
      expect(errors.email).toBe('Email is required');
    });

    it('requires gender', () => {
      const data = { ...validApplicant(), gender: '' as const };
      const errors = validateApplicantInfo(data);
      expect(errors.gender).toBe('Please select a title');
    });

    it('requires citizenshipMethod', () => {
      const data = { ...validApplicant(), citizenshipMethod: '' as const };
      const errors = validateApplicantInfo(data);
      expect(errors.citizenshipMethod).toBe('Please select citizenship method');
    });
  });

  // --- Date of birth ---
  describe('date of birth', () => {
    it('requires date of birth', () => {
      const data = { ...validApplicant(), dateOfBirth: '' };
      expect(validateApplicantInfo(data).dateOfBirth).toBe('Date of birth is required');
    });

    it('rejects invalid date format (YYYY-MM-DD)', () => {
      const data = { ...validApplicant(), dateOfBirth: '1990-01-15' };
      expect(validateApplicantInfo(data).dateOfBirth).toBe('Use format MM/DD/YYYY');
    });

    it('rejects month > 12', () => {
      const data = { ...validApplicant(), dateOfBirth: '13/01/2000' };
      expect(validateApplicantInfo(data).dateOfBirth).toBe('Use format MM/DD/YYYY');
    });

    it('rejects day > 31', () => {
      const data = { ...validApplicant(), dateOfBirth: '01/32/2000' };
      expect(validateApplicantInfo(data).dateOfBirth).toBe('Use format MM/DD/YYYY');
    });

    it('rejects single-digit month without leading zero', () => {
      const data = { ...validApplicant(), dateOfBirth: '1/15/1990' };
      expect(validateApplicantInfo(data).dateOfBirth).toBe('Use format MM/DD/YYYY');
    });

    it('accepts valid date', () => {
      const data = { ...validApplicant(), dateOfBirth: '12/31/2000' };
      expect(validateApplicantInfo(data).dateOfBirth).toBeUndefined();
    });
  });

  // --- Email ---
  describe('email validation', () => {
    it('rejects email without @', () => {
      const data = { ...validApplicant(), email: 'invalidemail' };
      expect(validateApplicantInfo(data).email).toBe('Enter a valid email address');
    });

    it('rejects email without domain', () => {
      const data = { ...validApplicant(), email: 'user@' };
      expect(validateApplicantInfo(data).email).toBe('Enter a valid email address');
    });

    it('accepts valid email', () => {
      const data = { ...validApplicant(), email: 'user@domain.com' };
      expect(validateApplicantInfo(data).email).toBeUndefined();
    });
  });

  // --- Height ---
  describe('height validation', () => {
    it('requires heightFeet', () => {
      const data = { ...validApplicant(), heightFeet: '' };
      expect(validateApplicantInfo(data).heightFeet).toBe('Required');
    });

    it('requires heightInches', () => {
      const data = { ...validApplicant(), heightInches: '' };
      expect(validateApplicantInfo(data).heightInches).toBe('Required');
    });

    it('rejects feet below 3', () => {
      const data = { ...validApplicant(), heightFeet: '2' };
      expect(validateApplicantInfo(data).heightFeet).toBe('3-7 ft');
    });

    it('rejects feet above 7', () => {
      const data = { ...validApplicant(), heightFeet: '8' };
      expect(validateApplicantInfo(data).heightFeet).toBe('3-7 ft');
    });

    it('accepts feet at boundary 3', () => {
      const data = { ...validApplicant(), heightFeet: '3' };
      expect(validateApplicantInfo(data).heightFeet).toBeUndefined();
    });

    it('accepts feet at boundary 7', () => {
      const data = { ...validApplicant(), heightFeet: '7' };
      expect(validateApplicantInfo(data).heightFeet).toBeUndefined();
    });

    it('rejects non-numeric feet', () => {
      const data = { ...validApplicant(), heightFeet: 'abc' };
      expect(validateApplicantInfo(data).heightFeet).toBe('3-7 ft');
    });

    it('rejects inches below 0', () => {
      const data = { ...validApplicant(), heightInches: '-1' };
      expect(validateApplicantInfo(data).heightInches).toBe('0-11 in');
    });

    it('rejects inches above 11', () => {
      const data = { ...validApplicant(), heightInches: '12' };
      expect(validateApplicantInfo(data).heightInches).toBe('0-11 in');
    });

    it('accepts inches at boundary 0', () => {
      const data = { ...validApplicant(), heightInches: '0' };
      expect(validateApplicantInfo(data).heightInches).toBeUndefined();
    });

    it('accepts inches at boundary 11', () => {
      const data = { ...validApplicant(), heightInches: '11' };
      expect(validateApplicantInfo(data).heightInches).toBeUndefined();
    });
  });

  // --- Home address ---
  describe('home address', () => {
    it.each(['street', 'city', 'state', 'zip', 'country'] as const)(
      'requires homeAddress.%s',
      (field) => {
        const data = validApplicant();
        data.homeAddress = { ...data.homeAddress, [field]: '' };
        const errors = validateApplicantInfo(data);
        expect(errors[`homeAddress.${field}`]).toBeDefined();
      }
    );
  });

  // --- Shipping address (conditional) ---
  describe('shipping address', () => {
    it('skips shipping validation when same as home', () => {
      const data = validApplicant();
      data.shippingAddressSameAsHome = true;
      data.shippingAddress = { ...INITIAL_ADDRESS }; // all empty
      const errors = validateApplicantInfo(data);
      expect(errors['shippingAddress.street']).toBeUndefined();
    });

    it.each(['street', 'city', 'state', 'zip', 'country'] as const)(
      'requires shippingAddress.%s when not same as home',
      (field) => {
        const data = validApplicant();
        data.shippingAddressSameAsHome = false;
        data.shippingAddress = {
          street: '456 Oak Ave',
          city: 'Kolonia',
          state: 'Pohnpei',
          zip: '96941',
          country: 'FSM',
        };
        data.shippingAddress[field] = '';
        const errors = validateApplicantInfo(data);
        expect(errors[`shippingAddress.${field}`]).toBeDefined();
      }
    );
  });

  // --- Previous passport (conditional) ---
  describe('previous passport', () => {
    it('requires previousPassport selection', () => {
      const data = { ...validApplicant(), previousPassport: '' as const };
      expect(validateApplicantInfo(data).previousPassport).toBe('Please select Yes or No');
    });

    it('requires details when previousPassport is "yes"', () => {
      const data = {
        ...validApplicant(),
        previousPassport: 'yes' as const,
        previousPassportDetails: { ...INITIAL_PREVIOUS_PASSPORT },
      };
      const errors = validateApplicantInfo(data);
      expect(errors['previousPassportDetails.country']).toBeDefined();
      expect(errors['previousPassportDetails.date']).toBeDefined();
      expect(errors['previousPassportDetails.passportNumber']).toBeDefined();
    });

    it('validates previous passport date format', () => {
      const data = {
        ...validApplicant(),
        previousPassport: 'yes' as const,
        previousPassportDetails: { country: 'FSM', date: 'bad-date', passportNumber: 'A123' },
      };
      expect(validateApplicantInfo(data)['previousPassportDetails.date']).toBe('Use format MM/DD/YYYY');
    });

    it('does not require details when previousPassport is "no"', () => {
      const data = { ...validApplicant(), previousPassport: 'no' as const };
      const errors = validateApplicantInfo(data);
      expect(errors['previousPassportDetails.country']).toBeUndefined();
      expect(errors['previousPassportDetails.date']).toBeUndefined();
      expect(errors['previousPassportDetails.passportNumber']).toBeUndefined();
    });
  });

  // --- Convicted (conditional) ---
  describe('convicted', () => {
    it('requires convicted selection', () => {
      const data = { ...validApplicant(), convicted: '' as const };
      expect(validateApplicantInfo(data).convicted).toBe('Please select Yes or No');
    });

    it('requires explanation when convicted is "yes"', () => {
      const data = { ...validApplicant(), convicted: 'yes' as const, convictedExplanation: '' };
      expect(validateApplicantInfo(data).convictedExplanation).toBe('Please provide an explanation');
    });

    it('accepts explanation when convicted is "yes"', () => {
      const data = {
        ...validApplicant(),
        convicted: 'yes' as const,
        convictedExplanation: 'Minor offense',
      };
      expect(validateApplicantInfo(data).convictedExplanation).toBeUndefined();
    });

    it('does not require explanation when convicted is "no"', () => {
      const data = { ...validApplicant(), convicted: 'no' as const, convictedExplanation: '' };
      expect(validateApplicantInfo(data).convictedExplanation).toBeUndefined();
    });
  });

  // --- Name changed (conditional) ---
  describe('name changed', () => {
    it('requires nameChanged selection', () => {
      const data = { ...validApplicant(), nameChanged: '' as const };
      expect(validateApplicantInfo(data).nameChanged).toBe('Please select Yes or No');
    });

    it('requires explanation when nameChanged is "yes"', () => {
      const data = { ...validApplicant(), nameChanged: 'yes' as const, nameChangedExplanation: '' };
      expect(validateApplicantInfo(data).nameChangedExplanation).toBe('Please provide details');
    });

    it('does not require explanation when nameChanged is "no"', () => {
      const data = { ...validApplicant(), nameChanged: 'no' as const, nameChangedExplanation: '' };
      expect(validateApplicantInfo(data).nameChangedExplanation).toBeUndefined();
    });
  });

  // --- Whitespace-only values treated as empty ---
  describe('whitespace handling', () => {
    it('treats whitespace-only lastName as empty', () => {
      const data = { ...validApplicant(), lastName: '   ' };
      expect(validateApplicantInfo(data).lastName).toBe('Last name is required');
    });

    it('treats whitespace-only email as empty', () => {
      const data = { ...validApplicant(), email: '   ' };
      expect(validateApplicantInfo(data).email).toBe('Email is required');
    });
  });
});

// ============================================================
// validateParentInfo
// ============================================================
describe('validateParentInfo', () => {
  it('returns no errors for a fully valid parent', () => {
    const errors = validateParentInfo(validParent(), 'Father');
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('requires lastName', () => {
    const data = { ...validParent(), lastName: '' };
    expect(validateParentInfo(data, 'Father').lastName).toBe("Father's last name is required");
  });

  it('requires firstName', () => {
    const data = { ...validParent(), firstName: '' };
    expect(validateParentInfo(data, 'Mother').firstName).toBe("Mother's first name is required");
  });

  it('allows empty birthDate', () => {
    const data = { ...validParent(), birthDate: '' };
    expect(validateParentInfo(data, 'Father').birthDate).toBeUndefined();
  });

  it('validates non-empty birthDate format', () => {
    const data = { ...validParent(), birthDate: 'bad-date' };
    expect(validateParentInfo(data, 'Father').birthDate).toBe('Use format MM/DD/YYYY');
  });

  it('requires fsmCitizen selection', () => {
    const data = { ...validParent(), fsmCitizen: '' as const };
    expect(validateParentInfo(data, 'Father').fsmCitizen).toBe('Please select Yes or No');
  });

  it('requires nationality when fsmCitizen is "no"', () => {
    const data = { ...validParent(), fsmCitizen: 'no' as const, nationality: '' };
    expect(validateParentInfo(data, 'Father').nationality).toBe(
      'Nationality is required when not an FSM citizen'
    );
  });

  it('does not require nationality when fsmCitizen is "yes"', () => {
    const data = { ...validParent(), fsmCitizen: 'yes' as const, nationality: '' };
    expect(validateParentInfo(data, 'Father').nationality).toBeUndefined();
  });

  it('uses label in error messages', () => {
    const data = { ...validParent(), lastName: '', firstName: '' };
    const errors = validateParentInfo(data, 'Mother');
    expect(errors.lastName).toContain('Mother');
    expect(errors.firstName).toContain('Mother');
  });
});

// ============================================================
// formatDateInput
// ============================================================
describe('formatDateInput', () => {
  it('returns single digit as-is', () => {
    expect(formatDateInput('1')).toBe('1');
  });

  it('returns two digits as-is (no slash yet)', () => {
    expect(formatDateInput('12')).toBe('12');
  });

  it('inserts slash after 2 digits when 3 digits entered', () => {
    expect(formatDateInput('123')).toBe('12/3');
  });

  it('formats 4 digits as MM/DD', () => {
    expect(formatDateInput('1234')).toBe('12/34');
  });

  it('inserts second slash after 4 digits', () => {
    expect(formatDateInput('12345')).toBe('12/34/5');
  });

  it('formats full 8-digit input as MM/DD/YYYY', () => {
    expect(formatDateInput('12345678')).toBe('12/34/5678');
  });

  it('truncates input beyond 8 digits', () => {
    expect(formatDateInput('123456789')).toBe('12/34/5678');
  });

  it('strips existing slashes and re-formats', () => {
    expect(formatDateInput('12/34/5678')).toBe('12/34/5678');
  });

  it('strips non-digit characters', () => {
    expect(formatDateInput('abc')).toBe('');
  });

  it('returns empty string for empty input', () => {
    expect(formatDateInput('')).toBe('');
  });

  it('handles mixed digits and non-digits', () => {
    expect(formatDateInput('1a2b3')).toBe('12/3');
  });
});
