import { describe, it, expect } from 'vitest';
import {
  INITIAL_FORM_DATA,
  INITIAL_APPLICANT,
  INITIAL_PARENT,
  INITIAL_ADDRESS,
  INITIAL_PREVIOUS_PASSPORT,
  STEP_LABELS,
} from './form';

describe('Initial data constants', () => {
  it('INITIAL_FORM_DATA has empty passport type', () => {
    expect(INITIAL_FORM_DATA.passportType).toBe('');
  });

  it('INITIAL_FORM_DATA has applicant, father, and mother', () => {
    expect(INITIAL_FORM_DATA.applicant).toBeDefined();
    expect(INITIAL_FORM_DATA.father).toBeDefined();
    expect(INITIAL_FORM_DATA.mother).toBeDefined();
  });

  it('INITIAL_APPLICANT has all empty string fields', () => {
    expect(INITIAL_APPLICANT.lastName).toBe('');
    expect(INITIAL_APPLICANT.firstName).toBe('');
    expect(INITIAL_APPLICANT.email).toBe('');
    expect(INITIAL_APPLICANT.gender).toBe('');
    expect(INITIAL_APPLICANT.citizenshipMethod).toBe('');
  });

  it('INITIAL_APPLICANT shippingAddressSameAsHome defaults to false', () => {
    expect(INITIAL_APPLICANT.shippingAddressSameAsHome).toBe(false);
  });

  it('INITIAL_ADDRESS has all empty string fields', () => {
    for (const value of Object.values(INITIAL_ADDRESS)) {
      expect(value).toBe('');
    }
  });

  it('INITIAL_PREVIOUS_PASSPORT has all empty string fields', () => {
    for (const value of Object.values(INITIAL_PREVIOUS_PASSPORT)) {
      expect(value).toBe('');
    }
  });

  it('INITIAL_PARENT has all empty string fields', () => {
    expect(INITIAL_PARENT.lastName).toBe('');
    expect(INITIAL_PARENT.firstName).toBe('');
    expect(INITIAL_PARENT.fsmCitizen).toBe('');
  });

  it('STEP_LABELS has 5 entries', () => {
    expect(STEP_LABELS).toHaveLength(5);
    expect(STEP_LABELS).toEqual(['Type', 'Applicant', 'Father', 'Mother', 'Review']);
  });

  it('initial data objects are independent copies (no shared references)', () => {
    // Mutating one should not affect the constant
    const copy = { ...INITIAL_FORM_DATA };
    copy.passportType = 'ordinary';
    expect(INITIAL_FORM_DATA.passportType).toBe('');
  });
});
