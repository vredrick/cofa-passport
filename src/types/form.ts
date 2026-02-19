export type TriState = '' | 'yes' | 'no';
export type PassportType = '' | 'ordinary' | 'official' | 'diplomatic';
export type Gender = '' | 'miss' | 'mrs' | 'ms' | 'mr';
export type CitizenshipMethod = '' | 'birth' | 'naturalization' | 'other';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface PreviousPassportInfo {
  country: string;
  date: string;
  passportNumber: string;
}

export interface ApplicantInfo {
  lastName: string;
  middleName: string;
  firstName: string;
  otherNames: string;
  dateOfBirth: string;
  gender: Gender;
  heightFeet: string;
  heightInches: string;
  hairColor: string;
  eyeColor: string;
  birthPlace: string;
  homeAddress: Address;
  shippingAddress: Address;
  shippingAddressSameAsHome: boolean;
  email: string;
  phone: string;
  previousPassport: TriState;
  previousPassportDetails: PreviousPassportInfo;
  convicted: TriState;
  convictedExplanation: string;
  nameChanged: TriState;
  nameChangedExplanation: string;
  citizenshipMethod: CitizenshipMethod;
}

export interface ParentInfo {
  lastName: string;
  firstName: string;
  middleName: string;
  birthDate: string;
  birthPlace: string;
  fsmCitizen: TriState;
  nationality: string;
}

export interface FormData {
  passportType: PassportType;
  applicant: ApplicantInfo;
  father: ParentInfo;
  mother: ParentInfo;
}

export interface ValidationErrors {
  [key: string]: string;
}

export const INITIAL_ADDRESS: Address = {
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
};

export const INITIAL_PREVIOUS_PASSPORT: PreviousPassportInfo = {
  country: '',
  date: '',
  passportNumber: '',
};

export const INITIAL_APPLICANT: ApplicantInfo = {
  lastName: '',
  middleName: '',
  firstName: '',
  otherNames: '',
  dateOfBirth: '',
  gender: '',
  heightFeet: '',
  heightInches: '',
  hairColor: '',
  eyeColor: '',
  birthPlace: '',
  homeAddress: { ...INITIAL_ADDRESS },
  shippingAddress: { ...INITIAL_ADDRESS },
  shippingAddressSameAsHome: false,
  email: '',
  phone: '',
  previousPassport: '',
  previousPassportDetails: { ...INITIAL_PREVIOUS_PASSPORT },
  convicted: '',
  convictedExplanation: '',
  nameChanged: '',
  nameChangedExplanation: '',
  citizenshipMethod: '',
};

export const INITIAL_PARENT: ParentInfo = {
  lastName: '',
  firstName: '',
  middleName: '',
  birthDate: '',
  birthPlace: '',
  fsmCitizen: '',
  nationality: '',
};

export const INITIAL_FORM_DATA: FormData = {
  passportType: '',
  applicant: { ...INITIAL_APPLICANT },
  father: { ...INITIAL_PARENT },
  mother: { ...INITIAL_PARENT },
};

export const STEP_LABELS = ['Type', 'Applicant', 'Father', 'Mother', 'Review'] as const;
