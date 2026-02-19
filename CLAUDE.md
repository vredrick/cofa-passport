# COFA Passport Application

## Overview

A privacy-first web application that helps citizens of COFA (Compact of Free Association) nations complete passport application forms digitally. The app guides users through a multi-step wizard, collects form data, and generates a pre-filled PDF that can be printed and submitted to the appropriate passport office.

Currently supports **FSM (Federated States of Micronesia) Form 500B**. RMI (Republic of the Marshall Islands) and Palau support are planned.

All data processing happens entirely in the browser. No data is ever sent to a server.

## Technology Stack

- **Framework:** Next.js 14.2 with App Router, static export (`output: 'export'`)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3.4 with custom theme colors (`ocean`, `gold`)
- **PDF generation:** pdf-lib 1.17
- **React:** 18.x (all client components, no server components)
- **Linting:** ESLint with next/core-web-vitals and next/typescript
- **Testing:** None installed yet

## Commands

```bash
npm run dev       # Start development server (localhost:3000)
npm run build     # Build static export to out/
npm run lint      # Run ESLint
npm run start     # Start production server (not typically used; app is static)
```

## Project Structure

```
cofa-passport/
├── CLAUDE.md                 # This file
├── next.config.mjs           # Next.js config: static export, unoptimized images
├── tailwind.config.ts        # Custom colors: ocean (blue), gold (yellow)
├── tsconfig.json             # Strict mode, path alias @/* -> src/*
├── .eslintrc.json            # next/core-web-vitals + next/typescript
├── package.json              # Dependencies and scripts
├── public/
│   └── AmendedPassportApplication0001.pdf  # FSM Form 500B PDF template
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout (Inter font, metadata)
│   │   ├── page.tsx          # Home page: Header + PrivacyNotice + Wizard
│   │   ├── globals.css       # Tailwind directives + component classes
│   │   ├── favicon.ico
│   │   └── fonts/            # Geist font files (woff)
│   ├── components/
│   │   ├── Header.tsx        # App header with FSM star motif SVG
│   │   ├── PrivacyNotice.tsx # Dismissible privacy banner
│   │   ├── ProgressBar.tsx   # 5-step progress indicator
│   │   ├── Wizard.tsx        # Form state manager, step orchestrator
│   │   ├── steps/
│   │   │   ├── PassportTypeStep.tsx   # Step 0: Passport type selection
│   │   │   ├── ApplicantInfoStep.tsx  # Step 1: All applicant fields
│   │   │   ├── ParentInfoStep.tsx     # Steps 2-3: Reused for father/mother
│   │   │   └── ReviewStep.tsx         # Step 4: Summary + PDF generation
│   │   └── ui/
│   │       ├── index.ts       # Barrel export for all UI components
│   │       ├── TextInput.tsx  # Text input with auto-uppercase, error display
│   │       ├── DateInput.tsx  # MM/DD/YYYY auto-formatting input
│   │       ├── RadioGroup.tsx # Stacked or inline radio button group
│   │       └── YesNoToggle.tsx # Two-button yes/no selector (TriState)
│   ├── lib/
│   │   ├── pdf-filler.ts     # PDF generation: fill template + draw checkmarks
│   │   ├── field-mapping.ts  # AcroForm field IDs extracted from template
│   │   └── validation.ts     # Per-step validation + date formatting helper
│   └── types/
│       └── form.ts           # All TypeScript types + initial form data constants
```

## Key Concepts

### Architecture

- **Fully client-side:** Every component uses `'use client'`. There are no server components, no API routes, and no server-side data fetching. The build output (`out/`) is a set of static HTML/JS/CSS files.
- **Privacy-first:** The PDF template is fetched from `public/`, filled in-browser with pdf-lib, and downloaded/shared directly. Nothing touches a server.
- **Static export:** `next.config.mjs` sets `output: 'export'` and `images: { unoptimized: true }`. The app can be hosted on any static file server (S3, GitHub Pages, Netlify, etc.).

### Wizard Flow

The wizard has 5 steps (indexed 0-4), defined in `STEP_LABELS` in `src/types/form.ts`:

| Step | Label     | Component            | Description                        |
|------|-----------|----------------------|------------------------------------|
| 0    | Type      | PassportTypeStep     | Select ordinary/official/diplomatic |
| 1    | Applicant | ApplicantInfoStep    | All personal info, addresses, legal |
| 2    | Father    | ParentInfoStep       | Father's info (reusable component) |
| 3    | Mother    | ParentInfoStep       | Mother's info (same component)     |
| 4    | Review    | ReviewStep           | Summary, PDF generate/download/share |

`Wizard.tsx` owns all form state via `useState<FormData>`. It passes data and updater callbacks down as props to each step. There is no context provider or state management library.

### Form Data Model

Defined in `src/types/form.ts`. The root type is `FormData`:

```typescript
FormData
├── passportType: PassportType       // '' | 'ordinary' | 'official' | 'diplomatic'
├── applicant: ApplicantInfo         // Name, DOB, gender, addresses, legal, citizenship
│   ├── homeAddress: Address
│   ├── shippingAddress: Address
│   └── previousPassportDetails: PreviousPassportInfo
├── father: ParentInfo               // Name, birth info, FSM citizenship
└── mother: ParentInfo
```

Custom union types: `TriState` (`'' | 'yes' | 'no'`), `Gender` (`'' | 'miss' | 'mrs' | 'ms' | 'mr'`), `CitizenshipMethod` (`'' | 'birth' | 'naturalization' | 'other'`).

Initial state constants (`INITIAL_FORM_DATA`, `INITIAL_APPLICANT`, etc.) are exported for use in state initialization and resets.

### Validation

`src/lib/validation.ts` exports three validators:

- `validatePassportType(type)` -- Step 0
- `validateApplicantInfo(info)` -- Step 1
- `validateParentInfo(info, label)` -- Steps 2 and 3

Each returns a `ValidationErrors` object (a `Record<string, string>`). Error keys use dot notation for nested fields (e.g., `'homeAddress.street'`, `'previousPassportDetails.country'`).

Validation runs on submit. After the first submit attempt, `ApplicantInfoStep` and `ParentInfoStep` enable live validation via `useEffect` so errors clear as the user corrects them.

Date format: `MM/DD/YYYY`. The `formatDateInput()` helper auto-inserts slashes as the user types.

### PDF Generation

`src/lib/pdf-filler.ts` contains `fillPassportPdf(data)` which:

1. Fetches the PDF template from `public/AmendedPassportApplication0001.pdf`
2. Opens it with `PDFDocument.load()`
3. Fills text fields via `form.getTextField(id).setText(value)`
4. Draws checkbox marks as vector lines directly on the page (two lines forming a checkmark)
5. Calls `form.updateFieldAppearances()` to bake text into the page
6. Strips the AcroForm dictionary from the PDF catalog to produce a flat, non-editable PDF
7. Returns `Uint8Array` of the final PDF bytes

Field IDs are defined in `src/lib/field-mapping.ts` as the `FIELD_IDS` constant. These IDs were extracted from the template's AcroForm dictionary and look like `text_4dr`, `checkbox_57vsoy`, etc.

## Development Guidelines

### Code Conventions

- **File naming:** Component files use PascalCase (`TextInput.tsx`, `ApplicantInfoStep.tsx`). Library files use kebab-case (`pdf-filler.ts`, `field-mapping.ts`).
- **Path alias:** Use `@/*` to import from `src/*`. Example: `import { TextInput } from '@/components/ui'`.
- **UI barrel export:** All `src/components/ui/` components are re-exported from `src/components/ui/index.ts`. Import from the barrel, not individual files.
- **TextInput auto-uppercase:** The `TextInput` component uppercases input by default (`uppercase={true}`). Pass `uppercase={false}` for email and phone fields.
- **Tailwind component classes:** Reusable utility classes are defined in `src/app/globals.css` under `@layer components`: `btn-primary`, `btn-secondary`, `form-input`, `form-input-error`, `card`, `card-title`, `error-text`. Use these instead of repeating Tailwind utilities.

### Theme Colors

Defined in `tailwind.config.ts`:

| Token          | Hex       | Usage                          |
|----------------|-----------|--------------------------------|
| `ocean`        | `#1B4F72` | Primary blue (buttons, headers)|
| `ocean-light`  | `#2471A3` | Hover state                    |
| `ocean-dark`   | `#154360` | Active/pressed state           |
| `gold`         | `#C4952A` | Accent (planned, not yet used) |
| `gold-light`   | `#D4AC2B` | Accent variant                 |
| `gold-dark`    | `#A67C22` | Accent variant                 |

### Adding New Form Fields

1. Add the TypeScript type/property to `src/types/form.ts` and its initial value constant
2. Add the corresponding PDF field ID to `src/lib/field-mapping.ts` (extract from the PDF template's AcroForm)
3. Add validation logic to the appropriate validator in `src/lib/validation.ts`
4. Add the UI input to the appropriate step component
5. Add the field mapping in `src/lib/pdf-filler.ts` (use `setTextField` for text, `checkBox` for checkboxes)
6. Add the field to `ReviewStep.tsx` for display in the summary

### Adding New COFA Nations

When adding RMI or Palau support:

1. Add a new PDF template to `public/`
2. Create a new field mapping file (or extend `field-mapping.ts` with nation-specific sections)
3. The form data model may need new types if the other nation's form has different fields
4. The wizard steps may need conditional sections or entirely new step components
5. Add a nation selector as the first step (before passport type)

## Important Gotchas

### PDF Checkbox Rendering

Chrome's built-in PDF viewer ignores checkbox form field appearance streams entirely. Setting a checkbox via `cb.check()` produces a check that appears in Adobe Reader and Mac Preview but is invisible in Chrome. The workaround is to draw checkmark lines directly on the page using `page.drawLine()` at the widget rectangle coordinates. The `checkBox()` helper in `pdf-filler.ts` implements this.

### PDF Template Quirks

- **Checkbox on-value:** The template uses `Yes_nlga` as the checkbox on-value, not the standard `Yes`. This is why `cb.check()` alone does not work correctly and the vector drawing approach is used instead.
- **Checkbox widget size:** Checkbox rectangles in the template are very small (5-7 points). The checkmark line drawing uses proportional coordinates (15%-85% of the widget rect) to fit properly.
- **`form.flatten()` crashes:** Calling `form.flatten()` on this template throws `Could not find page for PDFRef 471 0 R` due to orphaned widget references. The workaround is to delete the AcroForm entry from the PDF catalog directly: `catalog.delete(PDFName.of('AcroForm'))`. This effectively flattens the form by removing all interactive field definitions while the rendered text/lines remain.

### Static Export Constraints

- No `getServerSideProps`, `getStaticProps`, or API routes
- No `next/image` optimization (images are unoptimized)
- The PDF template must be in `public/` and is fetched at runtime via `fetch()`
- All routing is client-side; there is currently only one page (`/`)

### Share API

`ReviewStep.tsx` checks for `navigator.canShare()` support and conditionally shows a "Share PDF" button. This uses the Web Share API Level 2 (file sharing), which is supported on mobile Safari, Chrome on Android, and some desktop browsers. The check happens in a `useEffect` to avoid SSR/hydration mismatches.

## Navigation Guide

This is a small project with a flat structure. The key files to understand are:

| File | Purpose |
|------|---------|
| `src/types/form.ts` | All types and initial data -- start here to understand the data model |
| `src/components/Wizard.tsx` | State management hub -- owns all form state and step navigation |
| `src/lib/pdf-filler.ts` | PDF generation logic -- the core value of the app |
| `src/lib/field-mapping.ts` | PDF field IDs -- map between form data and PDF template fields |
| `src/lib/validation.ts` | Validation rules -- defines what is required and format constraints |
| `src/components/steps/` | Individual wizard steps -- the UI for data entry |
| `src/components/ui/` | Reusable form components -- shared across all steps |
| `src/app/globals.css` | Tailwind component classes -- defines btn-primary, card, etc. |
