# Test Coverage Analysis

## Current State

**No testing infrastructure exists.** There are no test files, no test frameworks installed, no test configuration, and no `test` script in `package.json`. The only quality check is ESLint (`npm run lint`).

---

## Recommended Test Framework

**Vitest + React Testing Library** is the best fit for this project:

- Vitest is fast, has native TypeScript/ESM support, and requires minimal config with Next.js
- React Testing Library covers component rendering and interaction
- `@testing-library/user-event` for realistic user input simulation
- `jsdom` environment for DOM APIs

---

## Priority 1: Validation Logic (`src/lib/validation.ts`)

**Why this is the highest priority:** Validation is the gatekeeper for all user input. Bugs here either block legitimate users or allow bad data into the PDF. These are pure functions with zero dependencies — the highest ROI tests in the codebase.

### `validatePassportType()`
- Returns error when type is empty string
- Returns no errors for each valid type (`'ordinary'`, `'official'`, `'diplomatic'`)

### `validateApplicantInfo()`
This function has 23+ validation rules with branching logic. Key test areas:

| Area | Test Cases |
|------|------------|
| **Required fields** | Each of the ~15 required fields produces an error when empty/whitespace-only |
| **Date format** | Valid `MM/DD/YYYY` passes; malformed strings (`13/01/2000`, `12/32/2000`, `2000-01-01`, `12/1/2000`) fail |
| **Email format** | Valid emails pass; missing `@`, missing domain, spaces fail |
| **Height boundaries** | Feet accepts 3-7, rejects 2, 8, non-numeric; Inches accepts 0-11, rejects 12, -1, non-numeric |
| **Conditional: shipping address** | Shipping fields required when `shippingAddressSameAsHome === false`; skipped when `true` |
| **Conditional: previous passport** | Details required when `previousPassport === 'yes'`; skipped when `'no'`; error when empty string |
| **Conditional: convicted** | Explanation required when `convicted === 'yes'`; not required when `'no'` |
| **Conditional: name changed** | Explanation required when `nameChanged === 'yes'`; not required when `'no'` |
| **Dot-notation keys** | Errors for nested fields use correct keys (`'homeAddress.street'`, `'previousPassportDetails.country'`) |

### `validateParentInfo()`
- Required: `lastName`, `firstName`
- Optional date: no error when empty, format error when non-empty and malformed
- Conditional: `nationality` required only when `fsmCitizen === 'no'`
- Error messages include the `label` parameter (e.g., "Father's last name is required")

### `formatDateInput()`
| Input | Expected Output | Rationale |
|-------|----------------|-----------|
| `'1'` | `'1'` | Partial month |
| `'12'` | `'12'` | Full month, no slash yet |
| `'123'` | `'12/3'` | Auto-insert first slash |
| `'1234'` | `'12/34'` | Full month/day |
| `'12345'` | `'12/34/5'` | Auto-insert second slash |
| `'12345678'` | `'12/34/5678'` | Full date |
| `'123456789'` | `'12/34/5678'` | Truncated to 8 digits |
| `'12/34/5678'` | `'12/34/5678'` | Existing slashes stripped then re-inserted |
| `'abc'` | `''` | Non-digit input stripped |
| `''` | `''` | Empty input |

---

## Priority 2: PDF Utility Functions (`src/lib/pdf-filler.ts`)

**Why:** These are the pure helper functions within the PDF module that can be tested without mocking pdf-lib.

### `formatAddress()`
- Joins non-empty fields with `', '`
- Trims whitespace from each field
- Omits empty/whitespace-only fields
- Returns empty string when all fields empty

### `formatPreviousPassport()`
- Same join/trim/filter logic as `formatAddress`
- Correct field order: country, date, passportNumber

### `generateFilename()`
- Produces `PassportApplication_LASTNAME_FIRSTNAME_YYYYMMDD.pdf`
- Uppercases name parts
- Strips internal whitespace from names
- Falls back to `'UNKNOWN'` for empty names
- Date portion uses zero-padded month and day

**Note:** `formatAddress` and `formatPreviousPassport` are not currently exported. They would need to be exported (or tested indirectly through `fillPassportPdf`).

---

## Priority 3: PDF Generation Integration (`src/lib/pdf-filler.ts`)

**Why:** This is the core product value — generating a correctly filled PDF. A test here catches regressions in field mapping, checkbox logic, and data formatting all at once.

### `fillPassportPdf()`
Testing this requires mocking `fetch` (to return the PDF template bytes) and using pdf-lib to inspect the output. Alternatively, use the real PDF template as a test fixture.

| Area | Test Cases |
|------|------------|
| **Passport type checkboxes** | Each type (`ordinary`, `official`, `diplomatic`) marks exactly one checkbox |
| **Text field mapping** | All 20+ text fields populated with correct values from FormData |
| **Gender checkboxes** | Each gender option marks the correct checkbox |
| **Conditional checkboxes** | `previousPassport`, `convicted`, `nameChanged` yes/no checkboxes |
| **Conditional text fields** | Explanation fields only set when yes; previous passport details only when yes |
| **Citizenship checkboxes** | `birth`, `naturalization`, `other` each mark correct checkbox |
| **Father/Mother sections** | All parent fields mapped; nationality only set when `fsmCitizen === 'no'` |
| **Shipping address logic** | Uses home address when `shippingAddressSameAsHome` is true |
| **Email case** | Email field is NOT uppercased (the `uppercase: false` parameter) |
| **Read-only** | All fields marked read-only in the output |
| **Return type** | Returns a `Uint8Array` that pdf-lib can re-load |

---

## Priority 4: Component Tests — Step Components

**Why:** These components contain interaction logic (validation on submit, conditional field visibility, live validation after first attempt) that goes beyond simple rendering.

### `PassportTypeStep`
- Renders three passport type cards
- Selecting a type calls `onChange`
- Clicking Continue with no selection shows validation error
- Clicking Continue with a selection calls `onNext`
- Error clears when a selection is made

### `ApplicantInfoStep`
- Renders all required fields
- Submitting with empty fields shows validation errors
- After first submit, validation runs live on every change (useEffect behavior)
- Conditional sections: shipping address fields appear/disappear based on toggle
- Conditional sections: previous passport details appear when "Yes" selected
- Conditional sections: convicted/name-changed explanations appear when "Yes" selected
- Scroll-to-first-error behavior on submit

### `ParentInfoStep`
- Reused for both Father (step 2) and Mother (step 3)
- `label` prop changes field labels and error messages
- Nationality field appears only when FSM citizen is "No"

### `ReviewStep`
- Displays all form data in summary cards
- "Generate PDF" triggers async `fillPassportPdf`
- State transitions: idle -> generating -> success/error
- Download button appears on success
- Share button conditionally rendered based on `navigator.canShare`
- "Try Again" button on error
- Navigating back resets PDF state

---

## Priority 5: UI Component Tests (`src/components/ui/`)

**Why:** These are reused across the app. Bugs here cascade to every form step.

### `TextInput`
- Auto-uppercases input by default
- Does NOT uppercase when `uppercase={false}`
- Renders label, error message, and required asterisk
- Sets `aria-invalid` and `aria-describedby` when error is present

### `DateInput`
- Calls `formatDateInput()` on input change
- Passes formatted value to `onChange`
- Renders error state with accessible attributes

### `RadioGroup`
- Renders options with correct labels
- Calls `onChange` with selected value
- Supports stacked and inline layout variants

### `YesNoToggle`
- Renders Yes/No buttons
- Calls `onChange` with `'yes'` or `'no'`
- Visual active state on selected option

---

## Priority 6: Navigation & View State (`src/app/page.tsx`)

### View switching
- Starts in `'landing'` view
- `onStartApplication` switches to `'wizard'` and resets to step 0
- `onBackToLanding` returns to landing view

### Step navigation
- `goToStep` updates `currentStep`
- `markCompleteAndAdvance` adds step to `completedSteps` and increments step
- Completed steps persist when navigating back
- Scroll to top fires on step/view change

---

## Priority 7: E2E Tests (Full Wizard Flow)

A small set of end-to-end tests (Playwright or Cypress) would cover the critical user journey:

1. **Happy path:** Landing -> select FSM -> fill all steps -> generate PDF -> download
2. **Validation path:** Attempt to proceed with empty fields at each step, verify errors shown
3. **Navigation:** Move forward and backward through steps, verify data persists
4. **Conditional fields:** Toggle shipping address same-as-home, previous passport yes/no
5. **Mobile responsive:** Verify mobile header, drawer, and sticky nav bar behavior

---

## Summary Table

| Priority | Module | Test Type | Estimated Test Count | Difficulty |
|----------|--------|-----------|---------------------|------------|
| 1 | `validation.ts` | Unit | ~50 | Easy |
| 2 | PDF utilities (`formatAddress`, `generateFilename`) | Unit | ~15 | Easy |
| 3 | `fillPassportPdf` | Integration | ~15 | Medium |
| 4 | Step components | Component | ~30 | Medium |
| 5 | UI components | Component | ~20 | Easy |
| 6 | `page.tsx` navigation | Component | ~10 | Medium |
| 7 | Full wizard flow | E2E | ~5 | Hard |

**Recommended starting point:** Priority 1 (validation.ts) — pure functions, no mocking, highest business value, catches the most impactful bugs.
