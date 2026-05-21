'use client';

import { useId, useState } from 'react';
import { Mail, Check, Loader2, AlertCircle, FileText } from 'lucide-react';
import { SITE } from '@/lib/site';

/**
 * DocumentLibrary — 4-document email-request flow.
 *
 * Wiring matches v0 plycemca.com (proven in production): hardcoded n8n
 * webhook URL, no Turnstile, no Cloudflare env vars.
 *
 * Requester email is collected once at the top of the list and submitted
 * with every document request — without it Robertson has no address to
 * send the PDF to, and the "1 business day email" promise below the list
 * cannot be fulfilled.
 *
 * NO client-side _honey honeypot input — Chrome autofills hidden text
 * fields and blocks real users (see commit c5575e0 for the SubmittalForm
 * precedent). The API route's defensive `if (data._honey)` check stays
 * in place server-side for the rare bot crawling an outdated form.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type DocumentMeta = {
  name: string;
  type: string;
  fileName: string;
  description: string;
};

const DOCUMENTS: DocumentMeta[] = [
  {
    name: 'UL R15140 Certificate of Compliance',
    type: 'UL Classification',
    fileName: 'UL-R15140-Classification-Certificate.pdf',
    description:
      'Fire-rated assembly classification covering UL designs H502, H504, H511, U449, U487 for 1-hour and 2-hour floor/ceiling assemblies.',
  },
  {
    name: 'ASTM E-84 Class A Fire Testing Certificate',
    type: 'Fire Testing',
    fileName: 'ASTM-E84-Class-A-Fire-Test.pdf',
    description:
      'Surface burning characteristics test results — Flame Spread Index 0, Smoke Developed Index 0. Class A rating per IBC Section 803.',
  },
  {
    name: 'IAPMO ER-360 Evaluation Report',
    type: 'Code Compliance',
    fileName: 'IAPMO-ER-360-Evaluation-Report.pdf',
    description:
      'IBC 2015/2012 + IRC code compliance evaluation report — the highest-value architect-facing compliance document. Valid through 2026-07-31.',
  },
  {
    name: 'Product Technical Data Sheet',
    type: 'Material Specification',
    fileName: 'JARA-Plycem-Technical-Data-Sheet.pdf',
    description:
      'ASTM C1186-08 Type A Grade I + ISO 8336:2018 Category A material specifications, mechanical properties, dimensional data, and product codes for all 6 panel lines.',
  },
];

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function DocumentLibrary() {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const emailFieldId = useId();
  const emailErrorId = useId();

  async function handleRequest(doc: DocumentMeta) {
    const current = statuses[doc.fileName];
    if (current === 'sending' || current === 'sent') return;

    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError('Enter your business email so we can send the PDF.');
      document.getElementById(emailFieldId)?.focus();
      return;
    }
    if (!EMAIL_REGEX.test(trimmed)) {
      setEmailError('That email address looks invalid — please check it.');
      document.getElementById(emailFieldId)?.focus();
      return;
    }
    setEmailError('');

    setStatuses((prev) => ({ ...prev, [doc.fileName]: 'sending' }));

    try {
      const res = await fetch('/api/document-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: doc.name,
          documentType: doc.type,
          fileName: doc.fileName,
          email: trimmed,
        }),
      });

      const data = await res.json().catch(() => ({}));
      console.log('[JARA] Document request API response:', data);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setStatuses((prev) => ({ ...prev, [doc.fileName]: 'sent' }));
      window.setTimeout(() => {
        setStatuses((prev) => ({ ...prev, [doc.fileName]: 'idle' }));
      }, 4000);
    } catch {
      setStatuses((prev) => ({ ...prev, [doc.fileName]: 'error' }));
      window.setTimeout(() => {
        setStatuses((prev) => ({ ...prev, [doc.fileName]: 'idle' }));
      }, 4000);
    }
  }

  return (
    <>
      {/* Email-collection card — single requester email used for any document
          click below. Without it the webhook arrives at n8n with no address
          for Robertson to reply to. */}
      <div className="mb-5 rounded-lg border border-bluegray/40 bg-white p-5">
        <label
          htmlFor={emailFieldId}
          className="block font-display text-base font-semibold text-navy"
        >
          Your business email
        </label>
        <p className="mt-1 text-xs leading-relaxed text-ink/65">
          We send each requested document directly to this address — typically
          within 1 business day.
        </p>
        <input
          id={emailFieldId}
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError('');
          }}
          aria-invalid={emailError ? 'true' : undefined}
          aria-describedby={emailError ? emailErrorId : undefined}
          placeholder="name@company.com"
          className={`mt-3 block w-full rounded-md border bg-white px-3 py-2 text-sm text-ink shadow-sm placeholder:text-ink/40 focus:outline-2 focus:outline-offset-2 focus:outline-navy ${
            emailError
              ? 'border-red-700/60 focus:border-red-700'
              : 'border-bluegray/60 focus:border-navy'
          }`}
        />
        {emailError && (
          <p
            id={emailErrorId}
            role="alert"
            className="mt-2 flex items-start gap-1.5 text-xs text-red-900"
          >
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {emailError}
          </p>
        )}
      </div>

      <div className="space-y-3">
        {DOCUMENTS.map((doc) => {
          const status = statuses[doc.fileName] ?? 'idle';
          return (
            <article
              key={doc.fileName}
              className="flex flex-col gap-4 rounded-lg border border-bluegray/40 bg-white p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <FileText
                  className="mt-1 h-5 w-5 shrink-0 text-steel"
                  aria-hidden="true"
                  strokeWidth={1.75}
                />
                <div className="min-w-0">
                  <p className="font-display text-base font-semibold text-navy">
                    {doc.name}
                  </p>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-steel">
                    {doc.type}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">
                    {doc.description}
                  </p>
                </div>
              </div>
              <RequestButton status={status} onClick={() => void handleRequest(doc)} />
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-xs leading-relaxed text-ink/55">
        Each request is sent to Robertson. Full PDF delivered by email within 1
        business day. Email{' '}
        <a href={`mailto:${SITE.email}`} className="underline underline-offset-2 hover:text-navy">
          {SITE.email}
        </a>{' '}
        if you have questions or need a specific document not listed here.
      </p>
    </>
  );
}

function RequestButton({ status, onClick }: { status: Status; onClick: () => void }) {
  const disabled = status === 'sending' || status === 'sent';

  let label: React.ReactNode;
  let cls: string;

  switch (status) {
    case 'sending':
      label = (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" strokeWidth={2.5} />
          Sending…
        </>
      );
      cls = 'bg-navy text-white';
      break;
    case 'sent':
      label = (
        <>
          <Check className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
          Sent
        </>
      );
      cls = 'bg-green-700 text-white';
      break;
    case 'error':
      label = (
        <>
          <AlertCircle className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
          Retry
        </>
      );
      cls = 'bg-red-700 text-white hover:bg-red-800';
      break;
    default:
      label = (
        <>
          <Mail className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
          Request via email
        </>
      );
      cls = 'bg-navy text-white hover:bg-navy-dark';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-busy={status === 'sending'}
      className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${cls}`}
    >
      {label}
    </button>
  );
}
