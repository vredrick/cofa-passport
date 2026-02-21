import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { FIELD_IDS } from '@/lib/field-mapping';
import type { FormData } from '@/types/form';
import { INITIAL_FORM_DATA, INITIAL_APPLICANT, INITIAL_PARENT, INITIAL_ADDRESS, INITIAL_PREVIOUS_PASSPORT } from '@/types/form';

// We need to test fillPassportPdf which fetches a real PDF template.
// We'll create a mock PDF with the expected form fields instead.

async function createMockTemplate(): Promise<ArrayBuffer> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);
  const form = pdfDoc.getForm();

  // Create all text fields from FIELD_IDS
  for (const [key, id] of Object.entries(FIELD_IDS)) {
    if (id.startsWith('text_')) {
      form.createTextField(id);
    } else if (id.startsWith('checkbox_')) {
      const cb = form.createCheckBox(id);
      // Add a widget with a Rect so checkBox() can draw on it
      cb.addToPage(page, { x: 50, y: 700, width: 10, height: 10 });
    }
  }

  return (await pdfDoc.save()).buffer as ArrayBuffer;
}

// Mock fetch to return our mock template
let mockTemplateBytes: ArrayBuffer;

beforeEach(async () => {
  mockTemplateBytes = await createMockTemplate();

  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    arrayBuffer: () => Promise.resolve(mockTemplateBytes),
  }));

  // Mock window.location.origin
  vi.stubGlobal('window', {
    ...globalThis.window,
    location: { origin: 'http://localhost:3000' },
  });

  // Mock process.env
  vi.stubEnv('NEXT_PUBLIC_BASE_PATH', '');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

// Dynamic import so mocks are in place
async function getFillPassportPdf() {
  const mod = await import('@/lib/pdf-filler');
  return mod.fillPassportPdf;
}

function fullFormData(): FormData {
  return {
    passportType: 'ordinary',
    applicant: {
      ...INITIAL_APPLICANT,
      lastName: 'Robert',
      firstName: 'Sau',
      middleName: 'Santos',
      otherNames: '',
      dateOfBirth: '01/15/1990',
      gender: 'mr',
      heightFeet: '5',
      heightInches: '8',
      hairColor: 'Black',
      eyeColor: 'Brown',
      birthPlace: 'Weno, Chuuk',
      homeAddress: {
        street: '123 Main St',
        city: 'Honolulu',
        state: 'HI',
        zip: '96819',
        country: 'USA',
      },
      shippingAddressSameAsHome: true,
      shippingAddress: { ...INITIAL_ADDRESS },
      email: 'sau@example.com',
      phone: '+691 320 1234',
      previousPassport: 'yes',
      previousPassportDetails: {
        country: 'FSM',
        date: '06/01/2015',
        passportNumber: 'A12345678',
      },
      convicted: 'no',
      convictedExplanation: '',
      nameChanged: 'no',
      nameChangedExplanation: '',
      citizenshipMethod: 'birth',
    },
    father: {
      ...INITIAL_PARENT,
      lastName: 'Robert',
      firstName: 'John',
      middleName: 'S',
      birthDate: '03/20/1960',
      birthPlace: 'Weno',
      fsmCitizen: 'yes',
      nationality: '',
    },
    mother: {
      ...INITIAL_PARENT,
      lastName: 'Santos',
      firstName: 'Maria',
      middleName: 'L',
      birthDate: '07/10/1965',
      birthPlace: 'Kolonia',
      fsmCitizen: 'no',
      nationality: 'Philippines',
    },
  };
}

describe('fillPassportPdf', () => {
  it('returns a Uint8Array', async () => {
    const fillPassportPdf = await getFillPassportPdf();
    const result = await fillPassportPdf(fullFormData());
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it('output can be loaded as a valid PDF', async () => {
    const fillPassportPdf = await getFillPassportPdf();
    const bytes = await fillPassportPdf(fullFormData());
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBeGreaterThanOrEqual(1);
  });

  it('sets text fields with correct values', async () => {
    const fillPassportPdf = await getFillPassportPdf();
    const data = fullFormData();
    const bytes = await fillPassportPdf(data);
    const doc = await PDFDocument.load(bytes);
    const form = doc.getForm();

    // Text fields should be filled (uppercased)
    expect(form.getTextField(FIELD_IDS.LAST_NAME).getText()).toBe('ROBERT');
    expect(form.getTextField(FIELD_IDS.FIRST_NAME).getText()).toBe('SAU');
    expect(form.getTextField(FIELD_IDS.MIDDLE_NAME).getText()).toBe('SANTOS');
    expect(form.getTextField(FIELD_IDS.DATE_OF_BIRTH).getText()).toBe('01/15/1990');
    expect(form.getTextField(FIELD_IDS.HEIGHT_FEET).getText()).toBe('5');
    expect(form.getTextField(FIELD_IDS.HEIGHT_INCHES).getText()).toBe('8');
    expect(form.getTextField(FIELD_IDS.HAIR_COLOR).getText()).toBe('BLACK');
    expect(form.getTextField(FIELD_IDS.EYE_COLOR).getText()).toBe('BROWN');
    expect(form.getTextField(FIELD_IDS.BIRTH_PLACE).getText()).toBe('WENO, CHUUK');
  });

  it('does not uppercase email', async () => {
    const fillPassportPdf = await getFillPassportPdf();
    const data = fullFormData();
    const bytes = await fillPassportPdf(data);
    const doc = await PDFDocument.load(bytes);
    const form = doc.getForm();

    expect(form.getTextField(FIELD_IDS.EMAIL).getText()).toBe('sau@example.com');
  });

  it('fills father fields', async () => {
    const fillPassportPdf = await getFillPassportPdf();
    const bytes = await fillPassportPdf(fullFormData());
    const doc = await PDFDocument.load(bytes);
    const form = doc.getForm();

    expect(form.getTextField(FIELD_IDS.FATHER_LAST).getText()).toBe('ROBERT');
    expect(form.getTextField(FIELD_IDS.FATHER_FIRST).getText()).toBe('JOHN');
    expect(form.getTextField(FIELD_IDS.FATHER_MIDDLE).getText()).toBe('S');
    expect(form.getTextField(FIELD_IDS.FATHER_BIRTHDATE).getText()).toBe('03/20/1960');
    expect(form.getTextField(FIELD_IDS.FATHER_BIRTHPLACE).getText()).toBe('WENO');
  });

  it('fills mother fields and nationality when not FSM citizen', async () => {
    const fillPassportPdf = await getFillPassportPdf();
    const bytes = await fillPassportPdf(fullFormData());
    const doc = await PDFDocument.load(bytes);
    const form = doc.getForm();

    expect(form.getTextField(FIELD_IDS.MOTHER_LAST).getText()).toBe('SANTOS');
    expect(form.getTextField(FIELD_IDS.MOTHER_FIRST).getText()).toBe('MARIA');
    expect(form.getTextField(FIELD_IDS.MOTHER_NATIONALITY).getText()).toBe('PHILIPPINES');
  });

  it('uses home address for postal when shippingAddressSameAsHome is true', async () => {
    const fillPassportPdf = await getFillPassportPdf();
    const data = fullFormData();
    data.applicant.shippingAddressSameAsHome = true;
    const bytes = await fillPassportPdf(data);
    const doc = await PDFDocument.load(bytes);
    const form = doc.getForm();

    const homeAddr = form.getTextField(FIELD_IDS.HOME_ADDRESS).getText();
    const postalAddr = form.getTextField(FIELD_IDS.POSTAL_ADDRESS).getText();
    expect(homeAddr).toBe(postalAddr);
  });

  it('uses shipping address for postal when not same as home', async () => {
    const fillPassportPdf = await getFillPassportPdf();
    const data = fullFormData();
    data.applicant.shippingAddressSameAsHome = false;
    data.applicant.shippingAddress = {
      street: '456 Oak Ave',
      city: 'Kolonia',
      state: 'Pohnpei',
      zip: '96941',
      country: 'FSM',
    };
    const bytes = await fillPassportPdf(data);
    const doc = await PDFDocument.load(bytes);
    const form = doc.getForm();

    const postalAddr = form.getTextField(FIELD_IDS.POSTAL_ADDRESS).getText();
    expect(postalAddr).toContain('456 OAK AVE');
    expect(postalAddr).toContain('KOLONIA');
  });

  it('fills previous passport details when yes', async () => {
    const fillPassportPdf = await getFillPassportPdf();
    const data = fullFormData();
    data.applicant.previousPassport = 'yes';
    data.applicant.previousPassportDetails = {
      country: 'FSM',
      date: '06/01/2015',
      passportNumber: 'A12345678',
    };
    const bytes = await fillPassportPdf(data);
    const doc = await PDFDocument.load(bytes);
    const form = doc.getForm();

    const details = form.getTextField(FIELD_IDS.PREV_PASSPORT_DETAILS).getText();
    expect(details).toContain('FSM');
    expect(details).toContain('A12345678');
  });

  it('fills convicted explanation when yes', async () => {
    const fillPassportPdf = await getFillPassportPdf();
    const data = fullFormData();
    data.applicant.convicted = 'yes';
    data.applicant.convictedExplanation = 'Minor traffic violation';
    const bytes = await fillPassportPdf(data);
    const doc = await PDFDocument.load(bytes);
    const form = doc.getForm();

    expect(form.getTextField(FIELD_IDS.CONVICTED_EXPLAIN).getText()).toBe('MINOR TRAFFIC VIOLATION');
  });

  it('makes all fields read-only', async () => {
    const fillPassportPdf = await getFillPassportPdf();
    const bytes = await fillPassportPdf(fullFormData());
    const doc = await PDFDocument.load(bytes);
    const form = doc.getForm();

    for (const field of form.getFields()) {
      expect(field.isReadOnly()).toBe(true);
    }
  });

  it('does not set empty text fields', async () => {
    const fillPassportPdf = await getFillPassportPdf();
    const data = fullFormData();
    data.applicant.otherNames = '';
    const bytes = await fillPassportPdf(data);
    const doc = await PDFDocument.load(bytes);
    const form = doc.getForm();

    // OTHER_NAMES should not have been set (empty value)
    expect(form.getTextField(FIELD_IDS.OTHER_NAMES).getText()).toBeUndefined();
  });
});
