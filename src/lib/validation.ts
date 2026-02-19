import { ApplicantInfo, ParentInfo, PassportType, ValidationErrors } from '@/types/form';

const DATE_REGEX = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/\d{4}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validatePassportType(type: PassportType): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!type) {
    errors.passportType = 'Please select a passport type';
  }
  return errors;
}

export function validateApplicantInfo(info: ApplicantInfo): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!info.lastName.trim()) errors.lastName = 'Last name is required';
  if (!info.firstName.trim()) errors.firstName = 'First name is required';
  if (!info.dateOfBirth.trim()) {
    errors.dateOfBirth = 'Date of birth is required';
  } else if (!DATE_REGEX.test(info.dateOfBirth)) {
    errors.dateOfBirth = 'Use format MM/DD/YYYY';
  }
  if (!info.gender) errors.gender = 'Please select a title';

  const feet = parseInt(info.heightFeet);
  const inches = parseInt(info.heightInches);
  if (!info.heightFeet.trim()) {
    errors.heightFeet = 'Required';
  } else if (isNaN(feet) || feet < 3 || feet > 7) {
    errors.heightFeet = '3-7 ft';
  }
  if (!info.heightInches.trim()) {
    errors.heightInches = 'Required';
  } else if (isNaN(inches) || inches < 0 || inches > 11) {
    errors.heightInches = '0-11 in';
  }

  if (!info.hairColor.trim()) errors.hairColor = 'Hair color is required';
  if (!info.eyeColor.trim()) errors.eyeColor = 'Eye color is required';
  if (!info.birthPlace.trim()) errors.birthPlace = 'Birth place is required';

  // Home address sub-fields
  if (!info.homeAddress.street.trim()) errors['homeAddress.street'] = 'Street is required';
  if (!info.homeAddress.city.trim()) errors['homeAddress.city'] = 'City is required';
  if (!info.homeAddress.state.trim()) errors['homeAddress.state'] = 'State is required';
  if (!info.homeAddress.zip.trim()) errors['homeAddress.zip'] = 'ZIP code is required';
  if (!info.homeAddress.country.trim()) errors['homeAddress.country'] = 'Country is required';

  // Shipping address — skip when same as home
  if (!info.shippingAddressSameAsHome) {
    if (!info.shippingAddress.street.trim()) errors['shippingAddress.street'] = 'Street is required';
    if (!info.shippingAddress.city.trim()) errors['shippingAddress.city'] = 'City is required';
    if (!info.shippingAddress.state.trim()) errors['shippingAddress.state'] = 'State is required';
    if (!info.shippingAddress.zip.trim()) errors['shippingAddress.zip'] = 'ZIP code is required';
    if (!info.shippingAddress.country.trim()) errors['shippingAddress.country'] = 'Country is required';
  }

  if (!info.email.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(info.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!info.phone.trim()) errors.phone = 'Phone number is required';

  if (!info.previousPassport) {
    errors.previousPassport = 'Please select Yes or No';
  } else if (info.previousPassport === 'yes') {
    if (!info.previousPassportDetails.country.trim()) errors['previousPassportDetails.country'] = 'Country of issue is required';
    if (!info.previousPassportDetails.date.trim()) {
      errors['previousPassportDetails.date'] = 'Date of issue is required';
    } else if (!DATE_REGEX.test(info.previousPassportDetails.date)) {
      errors['previousPassportDetails.date'] = 'Use format MM/DD/YYYY';
    }
    if (!info.previousPassportDetails.passportNumber.trim()) errors['previousPassportDetails.passportNumber'] = 'Passport number is required';
  }

  if (!info.convicted) {
    errors.convicted = 'Please select Yes or No';
  } else if (info.convicted === 'yes' && !info.convictedExplanation.trim()) {
    errors.convictedExplanation = 'Please provide an explanation';
  }

  if (!info.nameChanged) {
    errors.nameChanged = 'Please select Yes or No';
  } else if (info.nameChanged === 'yes' && !info.nameChangedExplanation.trim()) {
    errors.nameChangedExplanation = 'Please provide details';
  }

  if (!info.citizenshipMethod) errors.citizenshipMethod = 'Please select citizenship method';

  return errors;
}

export function validateParentInfo(info: ParentInfo, label: string): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!info.lastName.trim()) errors.lastName = `${label}'s last name is required`;
  if (!info.firstName.trim()) errors.firstName = `${label}'s first name is required`;

  if (info.birthDate.trim() && !DATE_REGEX.test(info.birthDate)) {
    errors.birthDate = 'Use format MM/DD/YYYY';
  }

  if (!info.fsmCitizen) {
    errors.fsmCitizen = 'Please select Yes or No';
  } else if (info.fsmCitizen === 'no' && !info.nationality.trim()) {
    errors.nationality = 'Nationality is required when not an FSM citizen';
  }

  return errors;
}

export function formatDateInput(value: string): string {
  // Strip non-digits
  const digits = value.replace(/\D/g, '');

  // Limit to 8 digits (MMDDYYYY)
  const limited = digits.slice(0, 8);

  // Auto-insert slashes
  if (limited.length <= 2) return limited;
  if (limited.length <= 4) return `${limited.slice(0, 2)}/${limited.slice(2)}`;
  return `${limited.slice(0, 2)}/${limited.slice(2, 4)}/${limited.slice(4)}`;
}
