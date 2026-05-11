'use client';

import { useState, useId } from 'react';
import Link from 'next/link';
import { Calculator, ArrowRight, AlertCircle } from 'lucide-react';
import {
  CONSTRUCTION_TYPES,
  PANEL_THICKNESSES,
  validateCalculatorInputs,
  calculateEstimate,
  buildResourcesPrefillUrl,
  formatEstimate,
  type CalculatorInputs,
  type CalculatorEstimate,
  type ValidationError,
} from '@/lib/calculator';

/**
 * Material Calculator — per ADR-022 HA1 (single-screen).
 *
 * Plycem ship blocker SB-4 compliance: NO price strings, NO currency symbols,
 * NO cost values — only panel count, weight, truck loads. The lib/calculator.ts
 * formatEstimate() function is the canonical formatter (one place to grep for
 * the no-currency CI test per Round 1.5 F3.5 / constraint C3).
 *
 * Per Round 6 F1.R6 (4/4 convergent): airtight validation. Inline error
 * messages. NO calculation runs on invalid input. NO NaN leakage.
 *
 * Per Round 6 F2.R6: "Get full quote" CTA prefills /resources via URL params.
 *
 * Per Round 6 DeepSeek finding: aria-live="polite" on result for screen readers.
 * All inputs have visible focus rings (via globals.css :focus-visible).
 */

const initialInputs: CalculatorInputs = {
  squareFeet: '',
  constructionType: '',
  thicknessMm: 0,
};

export function MaterialCalculator() {
  const [inputs, setInputs] = useState<CalculatorInputs>(initialInputs);
  const [estimate, setEstimate] = useState<CalculatorEstimate | null>(null);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [hasAttempted, setHasAttempted] = useState(false);

  const sfId = useId();
  const typeId = useId();
  const thickId = useId();
  const errorRegionId = useId();
  const resultRegionId = useId();

  function getFieldError(field: keyof CalculatorInputs): string | undefined {
    return errors.find((e) => e.field === field)?.message;
  }

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setHasAttempted(true);
    const validationErrors = validateCalculatorInputs(inputs);
    setErrors(validationErrors);
    if (validationErrors.length === 0) {
      setEstimate(calculateEstimate(inputs));
    } else {
      setEstimate(null);
    }
  }

  const formattedEstimate = estimate ? formatEstimate(estimate) : null;
  const prefillUrl = estimate
    ? buildResourcesPrefillUrl(estimate, inputs.constructionType || 'other')
    : '/resources';

  return (
    <section
      id="material-calculator"
      className="bg-bg-soft py-16 lg:py-24 scroll-mt-20"
      aria-labelledby="calculator-heading"
    >
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white">
            <Calculator className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
          </div>
          <h2
            id="calculator-heading"
            className="font-display text-2xl font-bold text-navy md:text-3xl text-balance"
          >
            Estimate panels for your project
          </h2>
          <p className="mt-3 text-ink/75 leading-relaxed">
            Enter your square footage and construction type — get an instant
            estimate of panels, weight, and truck loads needed. Quote with
            pricing follows by email or call.
          </p>
        </div>

        <form
          onSubmit={handleCalculate}
          noValidate
          className="rounded-lg border border-bluegray/40 bg-white p-6 shadow-sm md:p-8"
        >
          {/* fieldset/legend semantic grouping per Round 7 F3.R7 (WCAG AA) */}
          <fieldset className="border-0 p-0 m-0">
            <legend className="sr-only">Project details for material estimate</legend>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Square footage */}
              <div className="md:col-span-2">
                <label
                  htmlFor={sfId}
                  className="block text-sm font-semibold text-navy"
                >
                  Project square footage <span className="text-steel" aria-hidden="true">*</span>
                </label>
                <input
                  id={sfId}
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="500000"
                  step="1"
                  placeholder="e.g. 12000"
                  value={inputs.squareFeet}
                  onChange={(e) =>
                    setInputs({ ...inputs, squareFeet: e.target.value })
                  }
                  required
                  aria-required="true"
                  aria-invalid={!!getFieldError('squareFeet')}
                  aria-describedby={getFieldError('squareFeet') ? errorRegionId : undefined}
                  className={`mt-2 block w-full rounded-md border px-3 py-2 text-base text-ink shadow-sm placeholder:text-ink/40 focus:border-navy focus:outline-2 focus:outline-offset-2 focus:outline-navy ${
                    getFieldError('squareFeet')
                      ? 'border-red-700 bg-red-50'
                      : 'border-bluegray/60 bg-white'
                  }`}
                />
              </div>

              {/* Construction type */}
              <div>
                <label
                  htmlFor={typeId}
                  className="block text-sm font-semibold text-navy"
                >
                  Construction type <span className="text-steel" aria-hidden="true">*</span>
                </label>
                <select
                  id={typeId}
                  value={inputs.constructionType}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      constructionType: e.target.value as CalculatorInputs['constructionType'],
                    })
                  }
                  required
                  aria-required="true"
                  aria-invalid={!!getFieldError('constructionType')}
                  aria-describedby={getFieldError('constructionType') ? errorRegionId : undefined}
                  className={`mt-2 block w-full rounded-md border px-3 py-2 text-base text-ink shadow-sm focus:border-navy focus:outline-2 focus:outline-offset-2 focus:outline-navy ${
                    getFieldError('constructionType')
                      ? 'border-red-700 bg-red-50'
                      : 'border-bluegray/60 bg-white'
                  }`}
                >
                  <option value="">Select your construction type…</option>
                  {CONSTRUCTION_TYPES.map((ct) => (
                    <option key={ct.value} value={ct.value}>
                      {ct.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Panel thickness (optional) */}
              <div>
                <label
                  htmlFor={thickId}
                  className="block text-sm font-semibold text-navy"
                >
                  Panel thickness <span className="text-steel/60">(optional)</span>
                </label>
                <select
                  id={thickId}
                  value={inputs.thicknessMm || ''}
                  onChange={(e) =>
                    setInputs({
                      ...inputs,
                      thicknessMm: e.target.value ? (Number(e.target.value) as CalculatorInputs['thicknessMm']) : 0,
                    })
                  }
                  className="mt-2 block w-full rounded-md border border-bluegray/60 bg-white px-3 py-2 text-base text-ink shadow-sm focus:border-navy focus:outline-2 focus:outline-offset-2 focus:outline-navy"
                >
                  <option value="">Default for construction type</option>
                  {PANEL_THICKNESSES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>

          {/* Error region */}
          {hasAttempted && errors.length > 0 && (
            <div
              id={errorRegionId}
              role="alert"
              className="mt-6 rounded-md border border-red-700/40 bg-red-50 px-4 py-3 text-sm text-red-900"
            >
              <div className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <ul className="space-y-1">
                  {errors.map((err) => (
                    <li key={err.field}>{err.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy md:w-auto"
          >
            Calculate estimate
            <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
          </button>
        </form>

        {/* Result region — aria-live for screen reader announcement */}
        <div
          id={resultRegionId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="mt-6"
        >
          {formattedEstimate && (
            <div className="rounded-lg border-2 border-navy bg-white p-6 shadow-md md:p-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-steel">
                Estimated for {estimate!.squareFeet.toLocaleString()} SF · {formattedEstimate.thickness}
              </p>
              <div className="mt-4 grid gap-6 sm:grid-cols-3">
                <div>
                  <p className="font-display text-3xl font-bold text-navy">
                    {formattedEstimate.panels}
                  </p>
                  <p className="mt-1 text-sm text-ink/70">to cover the area</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-navy">
                    {formattedEstimate.weight}
                  </p>
                  <p className="mt-1 text-sm text-ink/70">approximate total weight</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-bold text-navy">
                    {formattedEstimate.trucks}
                  </p>
                  <p className="mt-1 text-sm text-ink/70">40' high-cube container</p>
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-3 border-t border-bluegray/40 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-ink/75">
                  Quote with pricing, lead time, and full spec sheet sent within 1 business day.
                </p>
                <Link
                  href={prefillUrl}
                  className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
                >
                  Get full quote
                  <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
