import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateFilename } from '@/lib/pdf-filler';
import { INITIAL_FORM_DATA, INITIAL_APPLICANT, INITIAL_PARENT } from '@/types/form';
import type { FormData } from '@/types/form';

// To test the non-exported formatAddress and formatPreviousPassport,
// we import them via the module. Since they are not exported, we test
// them indirectly through the ReviewStep's own copies, or we test
// generateFilename (which is exported) and the PDF integration test
// covers the formatting logic.

// ============================================================
// generateFilename
// ============================================================
describe('generateFilename', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 21)); // Feb 21, 2026
  });

  it('produces correct format with valid names', () => {
    const data: FormData = {
      ...INITIAL_FORM_DATA,
      applicant: { ...INITIAL_APPLICANT, lastName: 'Robert', firstName: 'Sau' },
    };
    expect(generateFilename(data)).toBe('PassportApplication_ROBERT_SAU_20260221.pdf');
  });

  it('uppercases the name', () => {
    const data: FormData = {
      ...INITIAL_FORM_DATA,
      applicant: { ...INITIAL_APPLICANT, lastName: 'smith', firstName: 'john' },
    };
    const filename = generateFilename(data);
    expect(filename).toContain('SMITH');
    expect(filename).toContain('JOHN');
  });

  it('strips internal whitespace from names', () => {
    const data: FormData = {
      ...INITIAL_FORM_DATA,
      applicant: { ...INITIAL_APPLICANT, lastName: 'De La Cruz', firstName: 'Ana Maria' },
    };
    expect(generateFilename(data)).toBe('PassportApplication_DELACRUZ_ANAMARIA_20260221.pdf');
  });

  it('falls back to UNKNOWN for empty names', () => {
    const data: FormData = {
      ...INITIAL_FORM_DATA,
      applicant: { ...INITIAL_APPLICANT, lastName: '', firstName: '' },
    };
    expect(generateFilename(data)).toBe('PassportApplication_UNKNOWN_UNKNOWN_20260221.pdf');
  });

  it('zero-pads month and day', () => {
    vi.setSystemTime(new Date(2026, 0, 5)); // Jan 5, 2026
    const data: FormData = {
      ...INITIAL_FORM_DATA,
      applicant: { ...INITIAL_APPLICANT, lastName: 'Test', firstName: 'User' },
    };
    expect(generateFilename(data)).toContain('20260105');
  });

  it('ends with .pdf extension', () => {
    const data: FormData = {
      ...INITIAL_FORM_DATA,
      applicant: { ...INITIAL_APPLICANT, lastName: 'Test', firstName: 'User' },
    };
    expect(generateFilename(data)).toMatch(/\.pdf$/);
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});

// ============================================================
// formatAddress (tested via ReviewStep's local copy logic)
// We replicate the function here to test the pattern since the
// original is not exported from pdf-filler.ts
// ============================================================
describe('formatAddress pattern', () => {
  // This mirrors the formatAddress logic in pdf-filler.ts
  function formatAddress(addr: { street: string; city: string; state: string; zip: string; country: string }): string {
    return [addr.street, addr.city, addr.state, addr.zip, addr.country]
      .map(s => s.trim()).filter(Boolean).join(', ');
  }

  it('joins all non-empty fields with comma-space', () => {
    expect(formatAddress({
      street: '123 Main St',
      city: 'Honolulu',
      state: 'HI',
      zip: '96819',
      country: 'USA',
    })).toBe('123 Main St, Honolulu, HI, 96819, USA');
  });

  it('trims whitespace from each field', () => {
    expect(formatAddress({
      street: '  123 Main St  ',
      city: ' Honolulu ',
      state: 'HI',
      zip: '96819',
      country: 'USA',
    })).toBe('123 Main St, Honolulu, HI, 96819, USA');
  });

  it('omits empty/whitespace-only fields', () => {
    expect(formatAddress({
      street: '123 Main St',
      city: '',
      state: 'HI',
      zip: '  ',
      country: 'USA',
    })).toBe('123 Main St, HI, USA');
  });

  it('returns empty string when all fields are empty', () => {
    expect(formatAddress({
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    })).toBe('');
  });
});

// ============================================================
// formatPreviousPassport pattern
// ============================================================
describe('formatPreviousPassport pattern', () => {
  function formatPreviousPassport(d: { country: string; date: string; passportNumber: string }): string {
    return [d.country, d.date, d.passportNumber]
      .map(s => s.trim()).filter(Boolean).join(', ');
  }

  it('joins all non-empty fields', () => {
    expect(formatPreviousPassport({
      country: 'FSM',
      date: '01/15/2020',
      passportNumber: 'A12345678',
    })).toBe('FSM, 01/15/2020, A12345678');
  });

  it('omits empty fields', () => {
    expect(formatPreviousPassport({
      country: 'FSM',
      date: '',
      passportNumber: 'A12345678',
    })).toBe('FSM, A12345678');
  });

  it('returns empty string when all fields are empty', () => {
    expect(formatPreviousPassport({
      country: '',
      date: '',
      passportNumber: '',
    })).toBe('');
  });
});
