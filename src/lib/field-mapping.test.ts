import { describe, it, expect } from 'vitest';
import { FIELD_IDS } from './field-mapping';

describe('FIELD_IDS', () => {
  it('exports a non-empty object', () => {
    expect(Object.keys(FIELD_IDS).length).toBeGreaterThan(0);
  });

  it('has unique field ID values (no duplicates)', () => {
    const values = Object.values(FIELD_IDS);
    const uniqueValues = new Set(values);
    expect(uniqueValues.size).toBe(values.length);
  });

  it('includes passport type checkboxes', () => {
    expect(FIELD_IDS.TYPE_ORDINARY).toBeDefined();
    expect(FIELD_IDS.TYPE_OFFICIAL).toBeDefined();
    expect(FIELD_IDS.TYPE_DIPLOMATIC).toBeDefined();
  });

  it('includes applicant text fields', () => {
    expect(FIELD_IDS.LAST_NAME).toBeDefined();
    expect(FIELD_IDS.FIRST_NAME).toBeDefined();
    expect(FIELD_IDS.MIDDLE_NAME).toBeDefined();
    expect(FIELD_IDS.DATE_OF_BIRTH).toBeDefined();
  });

  it('includes father and mother fields', () => {
    expect(FIELD_IDS.FATHER_LAST).toBeDefined();
    expect(FIELD_IDS.FATHER_FIRST).toBeDefined();
    expect(FIELD_IDS.MOTHER_LAST).toBeDefined();
    expect(FIELD_IDS.MOTHER_FIRST).toBeDefined();
  });

  it('checkbox IDs start with checkbox_ prefix', () => {
    const checkboxKeys = Object.entries(FIELD_IDS).filter(([key]) =>
      key.includes('TYPE_') || key.includes('GENDER_') || key.includes('_YES') || key.includes('_NO') || key.includes('CITIZEN_'),
    );
    for (const [, value] of checkboxKeys) {
      expect(value).toMatch(/^checkbox_/);
    }
  });

  it('text field IDs start with text_ prefix', () => {
    const textKeys = Object.entries(FIELD_IDS).filter(
      ([key]) => !key.includes('TYPE_') && !key.includes('GENDER_') && !key.includes('_YES') && !key.includes('_NO') && !key.includes('CITIZEN_'),
    );
    for (const [, value] of textKeys) {
      expect(value).toMatch(/^text_/);
    }
  });
});
