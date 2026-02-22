import { PDFDocument, PDFFont, PDFName, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import { FIELD_IDS } from './field-mapping';
import { FormData, Address, PreviousPassportInfo } from '@/types/form';

/**
 * Draw text directly on the PDF page at specified coordinates.
 * Bypasses form-field font-size limitations and gives full control
 * over positioning and text size.
 *
 * Auto-shrinks the font if the text exceeds maxWidth.
 */
function drawDirectText(
  page: PDFPage,
  font: PDFFont,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  maxWidth: number,
  uppercase = true,
) {
  if (!text.trim()) return;
  const value = uppercase ? text.toUpperCase() : text;

  // Auto-shrink if the text exceeds the available width
  let size = fontSize;
  while (size > 5 && font.widthOfTextAtSize(value, size) > maxWidth) {
    size -= 0.5;
  }

  page.drawText(value, { x, y, size, font, color: rgb(0, 0, 0) });
}

/**
 * Draw a checkmark directly on the PDF page at the checkbox widget's position.
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
        end: { x: x + w * 0.4, y: y + h * 0.15 },
        thickness: 1.2,
        color: rgb(0, 0, 0),
      });
      page.drawLine({
        start: { x: x + w * 0.4, y: y + h * 0.15 },
        end: { x: x + w * 0.85, y: y + h * 0.85 },
        thickness: 1.2,
        color: rgb(0, 0, 0),
      });
    }
  } catch (e) {
    console.warn(`Failed to check checkbox ${id}:`, e);
  }
}

function formatAddress(addr: Address): string {
  const street = [addr.street, addr.unit].map(s => s.trim()).filter(Boolean).join(', ');
  return [street, addr.city, addr.state, addr.zip, addr.country]
    .map(s => s.trim()).filter(Boolean).join(', ');
}

function formatPreviousPassport(d: PreviousPassportInfo): string {
  return [d.country, d.date, d.passportNumber]
    .map(s => s.trim()).filter(Boolean).join(', ');
}

// ── Field coordinates from PDF template (612 × 792 pt page) ──────────────
// Each entry: [x, y, maxWidth]  – y is the bottom edge of the field rect.
// We add +2 to y for baseline offset so text sits in the middle of the field.
const FIELD_POS = {
  LAST_NAME: { x: 77, y: 599, w: 152 },
  MIDDLE_NAME: { x: 247, y: 599, w: 76 },
  FIRST_NAME: { x: 351, y: 598, w: 194 },
  OTHER_NAMES: { x: 149, y: 572, w: 372 },
  DATE_OF_BIRTH: { x: 93, y: 552, w: 98 },
  HEIGHT_FEET: { x: 73, y: 536, w: 69 },
  HEIGHT_INCHES: { x: 160, y: 536, w: 45 },
  HAIR_COLOR: { x: 315, y: 535, w: 69 },
  EYE_COLOR: { x: 455, y: 534, w: 69 },
  BIRTH_PLACE: { x: 85, y: 518, w: 111 },
  HOME_ADDRESS: { x: 260, y: 517, w: 350 },
  POSTAL_ADDRESS: { x: 127, y: 499, w: 480 },
  EMAIL: { x: 101, y: 481, w: 220 },
  PHONE: { x: 415, y: 479, w: 112 },
  PREV_PASSPORT_DETAILS: { x: 245, y: 443, w: 279 },
  CONVICTED_EXPLAIN: { x: 326, y: 422, w: 220 },
  NAME_CHANGED_EXPLAIN: { x: 286, y: 405, w: 220 },
  FATHER_LAST: { x: 83, y: 352, w: 138 },
  FATHER_FIRST: { x: 265, y: 351, w: 138 },
  FATHER_MIDDLE: { x: 452, y: 349, w: 98 },
  FATHER_BIRTHDATE: { x: 79, y: 333, w: 98 },
  FATHER_BIRTHPLACE: { x: 239, y: 332, w: 152 },
  FATHER_NATIONALITY: { x: 118, y: 314, w: 287 },
  MOTHER_LAST: { x: 84, y: 278, w: 138 },
  MOTHER_FIRST: { x: 267, y: 277, w: 138 },
  MOTHER_MIDDLE: { x: 454, y: 275, w: 98 },
  MOTHER_BIRTHDATE: { x: 80, y: 260, w: 98 },
  MOTHER_BIRTHPLACE: { x: 237, y: 259, w: 152 },
  MOTHER_NATIONALITY: { x: 119, y: 242, w: 287 },
} as const;

const FONT_SIZE = 8;

export async function fillPassportPdf(data: FormData): Promise<Uint8Array> {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const templateUrl = `${window.location.origin}${basePath}/AmendedPassportApplication0001.pdf`;
  const templateBytes = await fetch(templateUrl).then(res => res.arrayBuffer());
  const pdfDoc = await PDFDocument.load(templateBytes);
  const form = pdfDoc.getForm();
  const page = pdfDoc.getPage(0);

  // Embed a standard font for all text drawing
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  /** Shorthand: draw field at its known position */
  const draw = (field: keyof typeof FIELD_POS, text: string, uppercase = true) => {
    const p = FIELD_POS[field];
    drawDirectText(page, font, text, p.x, p.y, FONT_SIZE, p.w, uppercase);
  };

  // --- Passport Type ---
  if (data.passportType === 'ordinary') checkBox(form, FIELD_IDS.TYPE_ORDINARY, page);
  if (data.passportType === 'official') checkBox(form, FIELD_IDS.TYPE_OFFICIAL, page);
  if (data.passportType === 'diplomatic') checkBox(form, FIELD_IDS.TYPE_DIPLOMATIC, page);

  // --- Applicant Info ---
  const a = data.applicant;
  draw('LAST_NAME', a.lastName);
  draw('MIDDLE_NAME', a.middleName);
  draw('FIRST_NAME', a.firstName);
  draw('OTHER_NAMES', a.otherNames);
  draw('DATE_OF_BIRTH', a.dateOfBirth);

  // Gender
  if (a.gender === 'miss') checkBox(form, FIELD_IDS.GENDER_MISS, page);
  if (a.gender === 'mrs') checkBox(form, FIELD_IDS.GENDER_MRS, page);
  if (a.gender === 'ms') checkBox(form, FIELD_IDS.GENDER_MS, page);
  if (a.gender === 'mr') checkBox(form, FIELD_IDS.GENDER_MR, page);

  // Physical
  draw('HEIGHT_FEET', a.heightFeet);
  draw('HEIGHT_INCHES', a.heightInches);
  draw('HAIR_COLOR', a.hairColor);
  draw('EYE_COLOR', a.eyeColor);

  // Addresses
  draw('BIRTH_PLACE', a.birthPlace);
  draw('HOME_ADDRESS', formatAddress(a.homeAddress));
  draw('POSTAL_ADDRESS', formatAddress(a.shippingAddressSameAsHome ? a.homeAddress : a.shippingAddress));

  // Contact — email NOT uppercased
  draw('EMAIL', a.email, false);
  draw('PHONE', a.phone);

  // Previous Passport
  if (a.previousPassport === 'yes') {
    checkBox(form, FIELD_IDS.PREV_PASSPORT_YES, page);
    draw('PREV_PASSPORT_DETAILS', formatPreviousPassport(a.previousPassportDetails));
  } else if (a.previousPassport === 'no') {
    checkBox(form, FIELD_IDS.PREV_PASSPORT_NO, page);
  }

  // Convicted
  if (a.convicted === 'yes') {
    checkBox(form, FIELD_IDS.CONVICTED_YES, page);
    draw('CONVICTED_EXPLAIN', a.convictedExplanation);
  } else if (a.convicted === 'no') {
    checkBox(form, FIELD_IDS.CONVICTED_NO, page);
  }

  // Name Changed
  if (a.nameChanged === 'yes') {
    checkBox(form, FIELD_IDS.NAME_CHANGED_YES, page);
    draw('NAME_CHANGED_EXPLAIN', a.nameChangedExplanation);
  } else if (a.nameChanged === 'no') {
    checkBox(form, FIELD_IDS.NAME_CHANGED_NO, page);
  }

  // Citizenship
  if (a.citizenshipMethod === 'birth') checkBox(form, FIELD_IDS.CITIZEN_BIRTH, page);
  if (a.citizenshipMethod === 'naturalization') checkBox(form, FIELD_IDS.CITIZEN_NATURALIZATION, page);
  if (a.citizenshipMethod === 'other') checkBox(form, FIELD_IDS.CITIZEN_OTHER, page);

  // --- Father ---
  const f = data.father;
  draw('FATHER_LAST', f.lastName);
  draw('FATHER_FIRST', f.firstName);
  draw('FATHER_MIDDLE', f.middleName);
  draw('FATHER_BIRTHDATE', f.birthDate);
  draw('FATHER_BIRTHPLACE', f.birthPlace);
  if (f.fsmCitizen === 'yes') {
    checkBox(form, FIELD_IDS.FATHER_FSM_YES, page);
  } else if (f.fsmCitizen === 'no') {
    checkBox(form, FIELD_IDS.FATHER_FSM_NO, page);
    draw('FATHER_NATIONALITY', f.nationality);
  }

  // --- Mother ---
  const m = data.mother;
  draw('MOTHER_LAST', m.lastName);
  draw('MOTHER_FIRST', m.firstName);
  draw('MOTHER_MIDDLE', m.middleName);
  draw('MOTHER_BIRTHDATE', m.birthDate);
  draw('MOTHER_BIRTHPLACE', m.birthPlace);
  if (m.fsmCitizen === 'yes') {
    checkBox(form, FIELD_IDS.MOTHER_FSM_YES, page);
  } else if (m.fsmCitizen === 'no') {
    checkBox(form, FIELD_IDS.MOTHER_FSM_NO, page);
    draw('MOTHER_NATIONALITY', m.nationality);
  }

  // Make all form fields read-only (they are now empty but still in the PDF)
  for (const field of form.getFields()) {
    field.enableReadOnly();
  }

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
