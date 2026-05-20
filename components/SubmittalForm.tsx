'use client';

import { useState, useCallback, useId } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Phone,
  AlertCircle,
} from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';

/**
 * SubmittalForm — three-step B2B project quote request.
 *
 * Wiring matches v0 plycemca.com (proven in production): honeypot-only
 * bot protection, hardcoded n8n webhook URL in the API route, no
 * Turnstile, no Cloudflare env vars. JARA design tokens + a11y patterns
 * preserved.
 */

const STEPS = ['Project Information', 'Product Requirements', 'Contact & Timeline'] as const;

const buildingTypes = [
  'Multifamily Residential',
  'Hotel / Hospitality',
  'Commercial Office',
  'Institutional',
  'Industrial',
  'Other',
];

const constructionTypes = [
  'Type I (Fire Resistive)',
  'Type II (Non-Combustible)',
  'Type III (Ordinary)',
  'Type V over Podium',
  'Other',
];

const roles = [
  'Architect',
  'Engineer',
  'General Contractor',
  'Subcontractor',
  'Developer / Owner',
  'Estimator',
  'Other',
];

const applicationTypes = [
  'Interior Subfloor',
  'Exterior Deck',
  'Roof Sheathing',
  'Other',
] as const;

const thicknessOptions = ['20mm', '22mm', '25mm', '30mm', 'Not Sure'];
const edgeProfiles = ['Tongue & Groove', 'Straight Edge', 'Not Sure'];
const fireRatings = ['1-Hour', '2-Hour', 'Not Applicable', 'Not Sure'];
const framingTypes = ['Wood', 'Steel', 'Both', 'Not Determined'];
const framingSpacings = ['16" o.c.', '24" o.c.', 'Other', 'Not Sure'];
const documentOptions = [
  'Product Data Sheet',
  'UL Assembly Details',
  'Installation Guide',
  'CSI Specification',
  'Sample Panel',
  'Custom Quote',
];

type FormData = {
  // Step 1
  projectName: string;
  projectLocation: string;
  buildingType: string;
  constructionType: string;
  numberOfStories: string;
  estimatedArea: string;
  // Step 2
  applicationType: string;
  panelThickness: string[];
  edgeProfile: string;
  fireRating: string;
  ulDesignNumber: string;
  framingType: string;
  framingSpacing: string;
  estimatedQuantity: string;
  // Step 3
  fullName: string;
  company: string;
  role: string;
  email: string;
  phone: string;
  neededByDate: string;
  documentsRequested: string[];
  additionalNotes: string;
  // Hidden
  _honey: string;
};

const initialFormData: FormData = {
  projectName: '',
  projectLocation: '',
  buildingType: '',
  constructionType: '',
  numberOfStories: '',
  estimatedArea: '',
  applicationType: 'Interior Subfloor',
  panelThickness: ['20mm'],
  edgeProfile: 'Tongue & Groove',
  fireRating: '',
  ulDesignNumber: '',
  framingType: '',
  framingSpacing: '16" o.c.',
  estimatedQuantity: '',
  fullName: '',
  company: '',
  role: '',
  email: '',
  phone: '',
  neededByDate: '',
  documentsRequested: ['Product Data Sheet', 'Custom Quote'],
  additionalNotes: '',
  _honey: '',
};

type SubmittalFormProps = {
  /** Optional initial values to pre-fill (used by /resources page reading
   *  calculator prefill URL params). */
  prefill?: Partial<Pick<FormData, 'applicationType' | 'panelThickness' | 'estimatedArea' | 'documentsRequested'>>;
};

export function SubmittalForm({ prefill }: SubmittalFormProps) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(() => ({
    ...initialFormData,
    ...prefill,
  }));
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimatedPanels, setEstimatedPanels] = useState<number | null>(null);
  const [error, setError] = useState('');

  const formId = useId();
  const errorRegionId = useId();
  const successRegionId = useId();

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const toggleArrayItem = useCallback(
    (field: 'panelThickness' | 'documentsRequested', item: string) => {
      setForm((prev) => {
        const arr = prev[field];
        return {
          ...prev,
          [field]: arr.includes(item)
            ? arr.filter((v) => v !== item)
            : [...arr, item],
        };
      });
    },
    [],
  );

  const areaNumber = parseFloat(form.estimatedArea);
  const panelEstimate =
    Number.isFinite(areaNumber) && areaNumber > 0 ? Math.ceil(areaNumber / 32) : null;

  function validateStep(): string {
    if (step === 0) {
      if (
        !form.projectName ||
        !form.projectLocation ||
        !form.buildingType ||
        !form.constructionType ||
        !form.estimatedArea
      ) {
        return 'Please fill in all required fields.';
      }
      if (panelEstimate === null) {
        return 'Estimated area must be a positive number.';
      }
    }
    if (step === 1) {
      if (
        form.panelThickness.length === 0 ||
        !form.edgeProfile ||
        !form.fireRating ||
        !form.framingType ||
        !form.applicationType
      ) {
        return 'Please fill in all required fields.';
      }
    }
    if (step === 2) {
      if (
        !form.fullName ||
        !form.company ||
        !form.role ||
        !form.email ||
        form.documentsRequested.length === 0
      ) {
        return 'Please fill in all required fields.';
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        return 'Please enter a valid email address.';
      }
    }
    return '';
  }

  function handleNext() {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep((s) => Math.min(s + 1, 2));
  }

  function handleBack() {
    setError('');
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleSubmit() {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/submittal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        estimatedPanels?: number | null;
        webhook?: { delivered?: boolean; status?: number | null; error?: string | null };
      };
      console.log('[JARA] Submittal API response:', data);

      if (!res.ok || !data.success) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setEstimatedPanels(data.estimatedPanels ?? null);
      setSubmitted(true);
    } catch {
      setError('Network error. Please try again or call us directly.');
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        id={successRegionId}
        className="rounded-lg border-2 border-navy bg-white p-8 text-center shadow-md"
      >
        <CheckCircle2 className="mx-auto h-12 w-12 text-navy" aria-hidden="true" />
        <h3 className="mt-4 font-display text-xl font-bold text-navy">
          Submittal request received
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/80">
          Thank you, {form.fullName.trim()}. Robertson will respond within 1 business day.
          {estimatedPanels !== null && (
            <span className="mt-2 block">
              Estimated panels needed:{' '}
              <strong className="text-navy">~{estimatedPanels} panels</strong>{' '}
              (based on {form.estimatedArea} SF at 32 SF/panel).
            </span>
          )}
        </p>
        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-ink/70">
          <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
          For urgent projects, call{' '}
          <a
            href={buildTelUrl(SITE.phonePrimaryRaw)}
            className="font-semibold text-navy hover:text-navy-dark underline underline-offset-2"
          >
            {SITE.phonePrimary}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (step < 2) handleNext();
        else void handleSubmit();
      }}
      noValidate
      aria-labelledby={`${formId}-step-label`}
      className="rounded-lg border border-bluegray/40 bg-white shadow-sm"
    >
        {/* Step progress chips */}
        <div className="border-b border-bluegray/30 p-4">
          <div className="flex items-center gap-2" role="list">
            {STEPS.map((label, i) => (
              <div
                key={label}
                role="listitem"
                aria-current={i === step ? 'step' : undefined}
                className="flex flex-1 items-center gap-2"
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    i <= step ? 'bg-navy text-white' : 'bg-bg-soft text-ink/60'
                  }`}
                  aria-hidden="true"
                >
                  {i + 1}
                </div>
                <span
                  className={`hidden text-xs font-semibold uppercase tracking-wider sm:block ${
                    i <= step ? 'text-navy' : 'text-ink/55'
                  }`}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className={`mx-2 h-px flex-1 ${i < step ? 'bg-navy' : 'bg-bluegray/40'}`}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>
          <p id={`${formId}-step-label`} className="sr-only">
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </p>
        </div>

        <div className="p-6 md:p-8">
          {/* Honeypot — visually hidden, NOT display:none (some bots skip those) */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              value={form._honey}
              onChange={(e) => updateField('_honey', e.target.value)}
            />
          </div>

          {/* Error region */}
          {error && (
            <div
              id={errorRegionId}
              role="alert"
              className="mb-6 rounded-md border border-red-700/40 bg-red-50 px-4 py-3 text-sm text-red-900"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Step 1 — Project Information */}
          {step === 0 && (
            <fieldset className="border-0 p-0 m-0">
              <legend className="sr-only">Project Information</legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor={`${formId}-projectName`} required>
                    Project name
                  </Label>
                  <Input
                    id={`${formId}-projectName`}
                    value={form.projectName}
                    onChange={(e) => updateField('projectName', e.target.value)}
                    placeholder="e.g. Maple Creek Apartments Phase II"
                    maxLength={120}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor={`${formId}-projectLocation`} required>
                    Project location
                  </Label>
                  <Input
                    id={`${formId}-projectLocation`}
                    value={form.projectLocation}
                    onChange={(e) => updateField('projectLocation', e.target.value)}
                    placeholder="City, State"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor={`${formId}-numberOfStories`}>Number of stories</Label>
                  <Input
                    id={`${formId}-numberOfStories`}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={100}
                    value={form.numberOfStories}
                    onChange={(e) => updateField('numberOfStories', e.target.value)}
                    placeholder="Optional"
                  />
                </div>

                <div>
                  <Label htmlFor={`${formId}-buildingType`} required>
                    Building type
                  </Label>
                  <Select
                    id={`${formId}-buildingType`}
                    value={form.buildingType}
                    onChange={(e) => updateField('buildingType', e.target.value)}
                    required
                  >
                    <option value="">Select type…</option>
                    {buildingTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <Label htmlFor={`${formId}-constructionType`} required>
                    Construction type
                  </Label>
                  <Select
                    id={`${formId}-constructionType`}
                    value={form.constructionType}
                    onChange={(e) => updateField('constructionType', e.target.value)}
                    required
                  >
                    <option value="">Select type…</option>
                    {constructionTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="sm:col-span-2">
                  <Label htmlFor={`${formId}-estimatedArea`} required>
                    Estimated floor area (SF)
                  </Label>
                  <Input
                    id={`${formId}-estimatedArea`}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={500000}
                    value={form.estimatedArea}
                    onChange={(e) => updateField('estimatedArea', e.target.value)}
                    placeholder="e.g. 12000"
                    required
                  />
                  {/* C14 inline panel-estimate UX */}
                  {panelEstimate !== null && (
                    <p
                      role="status"
                      aria-live="polite"
                      className="mt-2 text-xs font-medium text-steel"
                    >
                      ≈ {panelEstimate.toLocaleString()} panels (at 32 SF / 20mm panel)
                    </p>
                  )}
                </div>
              </div>
            </fieldset>
          )}

          {/* Step 2 — Product Requirements */}
          {step === 1 && (
            <fieldset className="border-0 p-0 m-0">
              <legend className="sr-only">Product Requirements</legend>
              <div className="space-y-6">
                <div>
                  <Label asLegend required>Application type</Label>
                  <RadioGroup
                    name={`${formId}-applicationType`}
                    value={form.applicationType}
                    options={[...applicationTypes]}
                    onChange={(v) => updateField('applicationType', v)}
                  />
                </div>

                <div>
                  <Label asLegend required>Panel thickness (select all that apply)</Label>
                  <div className="flex flex-wrap gap-3">
                    {thicknessOptions.map((t) => (
                      <CheckboxItem
                        key={t}
                        checked={form.panelThickness.includes(t)}
                        onChange={() => toggleArrayItem('panelThickness', t)}
                        label={t}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label asLegend required>Edge profile</Label>
                  <RadioGroup
                    name={`${formId}-edgeProfile`}
                    value={form.edgeProfile}
                    options={edgeProfiles}
                    onChange={(v) => updateField('edgeProfile', v)}
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`${formId}-fireRating`} required>
                      Required fire rating
                    </Label>
                    <Select
                      id={`${formId}-fireRating`}
                      value={form.fireRating}
                      onChange={(e) => updateField('fireRating', e.target.value)}
                      required
                    >
                      <option value="">Select rating…</option>
                      {fireRatings.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`${formId}-ulDesign`}>UL design number (if known)</Label>
                    <Input
                      id={`${formId}-ulDesign`}
                      value={form.ulDesignNumber}
                      onChange={(e) => updateField('ulDesignNumber', e.target.value)}
                      placeholder="e.g. H502, U449"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label asLegend required>Framing type</Label>
                    <RadioGroup
                      name={`${formId}-framingType`}
                      value={form.framingType}
                      options={framingTypes}
                      onChange={(v) => updateField('framingType', v)}
                    />
                  </div>
                  <div>
                    <Label asLegend>Joist spacing</Label>
                    <RadioGroup
                      name={`${formId}-framingSpacing`}
                      value={form.framingSpacing}
                      options={framingSpacings}
                      onChange={(v) => updateField('framingSpacing', v)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor={`${formId}-estimatedQuantity`}>
                    Estimated quantity (panels)
                  </Label>
                  <Input
                    id={`${formId}-estimatedQuantity`}
                    type="number"
                    inputMode="numeric"
                    min={1}
                    value={form.estimatedQuantity}
                    onChange={(e) => updateField('estimatedQuantity', e.target.value)}
                    placeholder="Optional — at 32 SF per 20mm panel"
                  />
                </div>
              </div>
            </fieldset>
          )}

          {/* Step 3 — Contact, Timeline, Documents */}
          {step === 2 && (
            <fieldset className="border-0 p-0 m-0">
              <legend className="sr-only">Contact and Document Requests</legend>
              <div className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`${formId}-fullName`} required>Full name</Label>
                    <Input
                      id={`${formId}-fullName`}
                      value={form.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      required
                      autoComplete="name"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${formId}-company`} required>Company</Label>
                    <Input
                      id={`${formId}-company`}
                      value={form.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      required
                      autoComplete="organization"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`${formId}-role`} required>Role</Label>
                    <Select
                      id={`${formId}-role`}
                      value={form.role}
                      onChange={(e) => updateField('role', e.target.value)}
                      required
                    >
                      <option value="">Select role…</option>
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`${formId}-email`} required>Email</Label>
                    <Input
                      id={`${formId}-email`}
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`${formId}-phone`}>Phone</Label>
                    <Input
                      id={`${formId}-phone`}
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="Optional"
                      autoComplete="tel"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`${formId}-neededBy`}>Needed by date</Label>
                    <Input
                      id={`${formId}-neededBy`}
                      type="date"
                      value={form.neededByDate}
                      onChange={(e) => updateField('neededByDate', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label asLegend required>Documents requested (select all)</Label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {documentOptions.map((doc) => (
                      <CheckboxItem
                        key={doc}
                        checked={form.documentsRequested.includes(doc)}
                        onChange={() => toggleArrayItem('documentsRequested', doc)}
                        label={doc}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor={`${formId}-notes`}>Additional notes</Label>
                  <textarea
                    id={`${formId}-notes`}
                    value={form.additionalNotes}
                    onChange={(e) => updateField('additionalNotes', e.target.value)}
                    maxLength={500}
                    rows={3}
                    placeholder="Special requirements, schedule context, drawings to follow, etc. (500 chars max)"
                    className="mt-2 block w-full rounded-md border border-bluegray/60 bg-white px-3 py-2 text-sm text-ink shadow-sm placeholder:text-ink/40 focus:border-navy focus:outline-2 focus:outline-offset-2 focus:outline-navy"
                  />
                </div>

              </div>
            </fieldset>
          )}

          {/* Step nav */}
          <div className="mt-8 flex items-center justify-between">
            {step > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-ink/70 hover:bg-bg-soft hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel transition-colors"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 2 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
              >
                Next
                <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void handleSubmit()}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-dark disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
              >
                {submitting ? (
                  <>
                    <Loader2
                      className="h-4 w-4 animate-spin"
                      aria-hidden="true"
                      strokeWidth={2.5}
                    />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit request
                    <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
                  </>
                )}
              </button>
            )}
        </div>
      </div>
    </form>
  );
}

// Small primitives matching MaterialCalculator's a11y pattern.
function Label({
  htmlFor,
  required,
  asLegend,
  children,
}: {
  htmlFor?: string;
  required?: boolean;
  asLegend?: boolean;
  children: React.ReactNode;
}) {
  const className = 'block text-sm font-semibold text-navy mb-2';
  const requiredMark = required ? (
    <span className="ml-1 text-steel" aria-hidden="true">
      *
    </span>
  ) : null;
  if (asLegend) {
    return (
      <p className={className}>
        {children}
        {requiredMark}
      </p>
    );
  }
  return (
    <label htmlFor={htmlFor} className={className}>
      {children}
      {requiredMark}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`block w-full rounded-md border border-bluegray/60 bg-white px-3 py-2 text-sm text-ink shadow-sm placeholder:text-ink/40 focus:border-navy focus:outline-2 focus:outline-offset-2 focus:outline-navy ${props.className ?? ''}`}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`block w-full rounded-md border border-bluegray/60 bg-white px-3 py-2 text-sm text-ink shadow-sm focus:border-navy focus:outline-2 focus:outline-offset-2 focus:outline-navy ${props.className ?? ''}`}
    />
  );
}

function RadioGroup({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div role="radiogroup" className="flex flex-wrap gap-x-5 gap-y-2">
      {options.map((opt) => (
        <label key={opt} className="inline-flex items-center gap-2 text-sm text-ink/85 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="h-4 w-4 accent-navy"
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

function CheckboxItem({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="inline-flex items-center gap-2 text-sm text-ink/85 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-navy"
      />
      {label}
    </label>
  );
}
