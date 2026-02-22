# COFA Passport Application

A privacy-first web application that helps citizens of Compact of Free Association (COFA) nations complete their passport applications digitally. All data processing happens entirely in the browser -- nothing is sent to a server.

## Supported Nations

| Nation | Form | Status |
|--------|------|--------|
| Federated States of Micronesia (FSM) | Form 500B | Available |
| Republic of the Marshall Islands (RMI) | TBD | Planned |
| Republic of Palau | TBD | Planned |

## How It Works

1. Applicant fills out a multi-step form in their browser
2. The app validates all required fields in real time
3. On submit, it fills the official PDF template client-side using [pdf-lib](https://pdf-lib.js.org/)
4. The completed PDF is previewed, then downloaded or shared -- ready to print and submit

No account, no server, no data collection.

## Tech Stack

- **Next.js 14** (static export) -- React framework with App Router
- **TypeScript** -- type-safe codebase
- **Tailwind CSS** -- utility-first styling with custom ocean/gold theme
- **pdf-lib** -- client-side PDF manipulation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

Outputs a fully static site to `out/` -- deploy anywhere (Vercel, Netlify, S3, GitHub Pages, etc.).

## Project Structure

```
src/
  app/
    page.tsx            # Entry point
    layout.tsx          # Root layout, metadata, viewport
    globals.css         # Tailwind layers + component classes
  components/
    Header.tsx          # FSM branding header
    PrivacyNotice.tsx   # Dismissible privacy banner
    ProgressBar.tsx     # Step indicator (5 steps)
    Wizard.tsx          # Form state + step navigation
    steps/
      PassportTypeStep.tsx    # Step 1: Ordinary / Official / Diplomatic
      ApplicantInfoStep.tsx   # Step 2: Full applicant details
      ParentInfoStep.tsx      # Steps 3-4: Father & Mother info
      ReviewStep.tsx          # Step 5: Review, generate, download PDF
    ui/
      TextInput.tsx     # Text input with uppercase, error display
      DateInput.tsx     # Auto-formatted MM/DD/YYYY input
      RadioGroup.tsx    # Stacked or inline radio buttons
      YesNoToggle.tsx   # Binary yes/no toggle
  lib/
    field-mapping.ts    # PDF form field ID constants
    pdf-filler.ts       # PDF generation (fill + flatten)
    validation.ts       # Per-step validation rules
  types/
    form.ts             # TypeScript types, interfaces, initial values
public/
  AmendedPassportApplication0001.pdf   # FSM Form 500B template
```

## PDF Generation Details

The app fills the official government PDF template and produces a **static, non-editable PDF** that renders identically in all viewers (Chrome, Safari, Mac Preview, Adobe Reader, etc.).

- **Text fields**: drawn directly on the page via `page.drawText()` at 8pt Helvetica with auto-shrink — bypasses form-field font-size limitations for reliable rendering across all viewers
- **Checkboxes**: drawn directly on the page as vector checkmarks (Chrome's PDF viewer does not render form-field checkbox appearances)
- **Field coordinates**: mapped from the template's AcroForm widget rectangles (see `FIELD_POS` in `pdf-filler.ts`)

## Adding a New Nation

To add RMI or Palau support:

1. Add the nation's official passport application PDF template to `public/`
2. Create a new field mapping in `src/lib/field-mapping.ts` (inspect the PDF's AcroForm field IDs)
3. Adjust types in `src/types/form.ts` if the form structure differs
4. Add nation-specific validation rules in `src/lib/validation.ts`
5. Update the wizard steps if the form has different sections

## License

Private -- all rights reserved.
