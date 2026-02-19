import { PDFDocument, PDFName, PDFPage, rgb } from 'pdf-lib';
import { FIELD_IDS } from './field-mapping';
import { FormData, Address, PreviousPassportInfo } from '@/types/form';

function setTextField(form: ReturnType<PDFDocument['getForm']>, id: string, value: string, uppercase = true) {
  try {
    if (!value.trim()) return;
    const field = form.getTextField(id);
    field.setText(uppercase ? value.toUpperCase() : value);
  } catch (e) {
    console.warn(`Failed to set text field ${id}:`, e);
  }
}

/**
 * Draw a checkmark directly on the PDF page at the checkbox widget's position.
 * This renders reliably in all viewers (Chrome, Mac Preview, Adobe, etc.)
 * unlike form field appearance streams which Chrome ignores for checkboxes.
 */
function checkBox(form: ReturnType<PDFDocument['getForm']>, id: string, page: PDFPage) {
  try {
    const cb = form.getCheckBox(id);
    const widgets = cb.acroField.getWidgets();
    for (const widget of widgets) {
      const rect = widget.dict.lookup(PDFName.of('Rect'));
      if (!rect) continue;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const r = rect as any;
      const x = r.get(0).value() as number;
      const y = r.get(1).value() as number;
      const x2 = r.get(2).value() as number;
      const y2 = r.get(3).value() as number;
      const w = x2 - x;
      const h = y2 - y;

      page.drawLine({
        start: { x: x + w * 0.15, y: y + h * 0.45 },
        end:   { x: x + w * 0.4,  y: y + h * 0.15 },
        thickness: 1.2,
        color: rgb(0, 0, 0),
      });
      page.drawLine({
        start: { x: x + w * 0.4,  y: y + h * 0.15 },
        end:   { x: x + w * 0.85, y: y + h * 0.85 },
        thickness: 1.2,
        color: rgb(0, 0, 0),
      });
    }
  } catch (e) {
    console.warn(`Failed to check checkbox ${id}:`, e);
  }
}

function formatAddress(addr: Address): string {
  return [addr.street, addr.city, addr.state, addr.zip, addr.country]
    .map(s => s.trim()).filter(Boolean).join(', ');
}

function formatPreviousPassport(d: PreviousPassportInfo): string {
  return [d.country, d.date, d.passportNumber]
    .map(s => s.trim()).filter(Boolean).join(', ');
}

export async function fillPassportPdf(data: FormData): Promise<Uint8Array> {
  const templateUrl = `${window.location.origin}/AmendedPassportApplication0001.pdf`;
  const templateBytes = await fetch(templateUrl).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();
  const page = pdfDoc.getPage(0);

  // --- Passport Type ---
  if (data.passportType === 'ordinary') checkBox(form, FIELD_IDS.TYPE_ORDINARY, page);
  if (data.passportType === 'official') checkBox(form, FIELD_IDS.TYPE_OFFICIAL, page);
  if (data.passportType === 'diplomatic') checkBox(form, FIELD_IDS.TYPE_DIPLOMATIC, page);

  // --- Applicant Info ---
  const a = data.applicant;
  setTextField(form, FIELD_IDS.LAST_NAME, a.lastName);
  setTextField(form, FIELD_IDS.MIDDLE_NAME, a.middleName);
  setTextField(form, FIELD_IDS.FIRST_NAME, a.firstName);
  setTextField(form, FIELD_IDS.OTHER_NAMES, a.otherNames);
  setTextField(form, FIELD_IDS.DATE_OF_BIRTH, a.dateOfBirth);

  // Gender
  if (a.gender === 'miss') checkBox(form, FIELD_IDS.GENDER_MISS, page);
  if (a.gender === 'mrs') checkBox(form, FIELD_IDS.GENDER_MRS, page);
  if (a.gender === 'ms') checkBox(form, FIELD_IDS.GENDER_MS, page);
  if (a.gender === 'mr') checkBox(form, FIELD_IDS.GENDER_MR, page);

  // Physical
  setTextField(form, FIELD_IDS.HEIGHT_FEET, a.heightFeet);
  setTextField(form, FIELD_IDS.HEIGHT_INCHES, a.heightInches);
  setTextField(form, FIELD_IDS.HAIR_COLOR, a.hairColor);
  setTextField(form, FIELD_IDS.EYE_COLOR, a.eyeColor);

  // Addresses
  setTextField(form, FIELD_IDS.BIRTH_PLACE, a.birthPlace);
  setTextField(form, FIELD_IDS.HOME_ADDRESS, formatAddress(a.homeAddress));
  setTextField(form, FIELD_IDS.POSTAL_ADDRESS, formatAddress(a.shippingAddressSameAsHome ? a.homeAddress : a.shippingAddress));

  // Contact — email NOT uppercased
  setTextField(form, FIELD_IDS.EMAIL, a.email, false);
  setTextField(form, FIELD_IDS.PHONE, a.phone);

  // Previous Passport
  if (a.previousPassport === 'yes') {
    checkBox(form, FIELD_IDS.PREV_PASSPORT_YES, page);
    setTextField(form, FIELD_IDS.PREV_PASSPORT_DETAILS, formatPreviousPassport(a.previousPassportDetails));
  } else if (a.previousPassport === 'no') {
    checkBox(form, FIELD_IDS.PREV_PASSPORT_NO, page);
  }

  // Convicted
  if (a.convicted === 'yes') {
    checkBox(form, FIELD_IDS.CONVICTED_YES, page);
    setTextField(form, FIELD_IDS.CONVICTED_EXPLAIN, a.convictedExplanation);
  } else if (a.convicted === 'no') {
    checkBox(form, FIELD_IDS.CONVICTED_NO, page);
  }

  // Name Changed
  if (a.nameChanged === 'yes') {
    checkBox(form, FIELD_IDS.NAME_CHANGED_YES, page);
    setTextField(form, FIELD_IDS.NAME_CHANGED_EXPLAIN, a.nameChangedExplanation);
  } else if (a.nameChanged === 'no') {
    checkBox(form, FIELD_IDS.NAME_CHANGED_NO, page);
  }

  // Citizenship
  if (a.citizenshipMethod === 'birth') checkBox(form, FIELD_IDS.CITIZEN_BIRTH, page);
  if (a.citizenshipMethod === 'naturalization') checkBox(form, FIELD_IDS.CITIZEN_NATURALIZATION, page);
  if (a.citizenshipMethod === 'other') checkBox(form, FIELD_IDS.CITIZEN_OTHER, page);

  // --- Father ---
  const f = data.father;
  setTextField(form, FIELD_IDS.FATHER_LAST, f.lastName);
  setTextField(form, FIELD_IDS.FATHER_FIRST, f.firstName);
  setTextField(form, FIELD_IDS.FATHER_MIDDLE, f.middleName);
  setTextField(form, FIELD_IDS.FATHER_BIRTHDATE, f.birthDate);
  setTextField(form, FIELD_IDS.FATHER_BIRTHPLACE, f.birthPlace);
  if (f.fsmCitizen === 'yes') {
    checkBox(form, FIELD_IDS.FATHER_FSM_YES, page);
  } else if (f.fsmCitizen === 'no') {
    checkBox(form, FIELD_IDS.FATHER_FSM_NO, page);
    setTextField(form, FIELD_IDS.FATHER_NATIONALITY, f.nationality);
  }

  // --- Mother ---
  const m = data.mother;
  setTextField(form, FIELD_IDS.MOTHER_LAST, m.lastName);
  setTextField(form, FIELD_IDS.MOTHER_FIRST, m.firstName);
  setTextField(form, FIELD_IDS.MOTHER_MIDDLE, m.middleName);
  setTextField(form, FIELD_IDS.MOTHER_BIRTHDATE, m.birthDate);
  setTextField(form, FIELD_IDS.MOTHER_BIRTHPLACE, m.birthPlace);
  if (m.fsmCitizen === 'yes') {
    checkBox(form, FIELD_IDS.MOTHER_FSM_YES, page);
  } else if (m.fsmCitizen === 'no') {
    checkBox(form, FIELD_IDS.MOTHER_FSM_NO, page);
    setTextField(form, FIELD_IDS.MOTHER_NATIONALITY, m.nationality);
  }

  // Bake text fields into the page as static content
  form.updateFieldAppearances();

  // Strip the AcroForm to produce a fully static PDF — no interactive fields.
  // (form.flatten() can't be used here due to orphaned widget refs in the template.)
  const catalog = pdfDoc.context.lookup(pdfDoc.context.trailerInfo.Root);
  (catalog as any).delete(PDFName.of('AcroForm'));

  return pdfDoc.save();
}

export function generateFilename(data: FormData): string {
  const last = data.applicant.lastName.toUpperCase().replace(/\s+/g, '') || 'UNKNOWN';
  const first = data.applicant.firstName.toUpperCase().replace(/\s+/g, '') || 'UNKNOWN';
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  return `PassportApplication_${last}_${first}_${ymd}.pdf`;
}

export function downloadPdf(pdfBytes: Uint8Array, filename: string) {
  const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
