'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Script from 'next/script';
import { Mail, Check, Loader2, AlertCircle, FileText } from 'lucide-react';
import { SITE } from '@/lib/site';

/**
 * DocumentLibrary — Sprint 4 step 5 (ADR-037 E2, Round 10 4-1 strong).
 *
 * Slim 4-document email-request flow. Ports v0 DocumentRequestButton's
 * 4-state pattern (idle / sending / sent / error) with JARA styling and
 * routes each request through /api/document-request (which forwards to
 * the production n8n jara-document-request webhook).
 *
 * Per ADR-042 + F1.R10, each request carries a fresh Turnstile token.
 * Implementation: single invisible Turnstile widget rendered in
 * `appearance: execute` mode; on each button click we reset + execute
 * the widget to generate a fresh token, then POST. Multiple doc
 * requests in one session each get their own token (Cloudflare's
 * siteverify call invalidates each token on use).
 *
 * Per ADR-037 lock: 4-doc list = UL R15140, ASTM E-84, IAPMO ER-360,
 * generic technical data sheet. Plycem-branded brochure dropped per
 * SB-2/SB-7 risk surface; redundant UL CERZ/BQXR variants merged into
 * the single UL R15140 entry.
 */

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js';

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

declare global {
  // turnstile global typed in components/SubmittalForm.tsx
}

type DocumentLibraryProps = {
  /** Turnstile site key threaded from the server page — see SubmittalForm
   *  for the Cloudflare Workers runtime-vs-build env var rationale. */
  turnstileSiteKey?: string;
};

export function DocumentLibrary({ turnstileSiteKey }: DocumentLibraryProps = {}) {
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);
  const widgetIdRef = useRef<string | null>(null);
  const tokenResolveRef = useRef<((token: string) => void) | null>(null);

  const containerId = useId();
  const turnstileContainerId = `${containerId}-doc-library-turnstile`;

  // Render invisible Turnstile widget once on mount (after script loads)
  useEffect(() => {
    if (!turnstileLoaded || widgetIdRef.current) return;
    if (!window.turnstile) return;
    if (!turnstileSiteKey) return;
    const id = window.turnstile.render(`#${turnstileContainerId}`, {
      sitekey: turnstileSiteKey,
      appearance: 'execute',
      callback: (token: string) => {
        tokenResolveRef.current?.(token);
        tokenResolveRef.current = null;
      },
      'error-callback': () => {
        tokenResolveRef.current?.('');
        tokenResolveRef.current = null;
      },
    });
    widgetIdRef.current = id;
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [turnstileLoaded, turnstileContainerId, turnstileSiteKey]);

  async function getFreshToken(): Promise<string> {
    if (!widgetIdRef.current || !window.turnstile) return '';
    return new Promise<string>((resolve) => {
      tokenResolveRef.current = resolve;
      window.turnstile!.reset(widgetIdRef.current!);
      window.turnstile!.execute(widgetIdRef.current!);
      // Hard timeout — if no callback within 20s, give up
      window.setTimeout(() => {
        if (tokenResolveRef.current) {
          tokenResolveRef.current('');
          tokenResolveRef.current = null;
        }
      }, 20_000);
    });
  }

  async function handleRequest(doc: DocumentMeta) {
    const current = statuses[doc.fileName];
    if (current === 'sending' || current === 'sent') return;

    setStatuses((prev) => ({ ...prev, [doc.fileName]: 'sending' }));

    try {
      const token = await getFreshToken();
      if (!token) {
        throw new Error('Verification failed — please try again');
      }

      const res = await fetch('/api/document-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: doc.name,
          documentType: doc.type,
          fileName: doc.fileName,
          'cf-turnstile-response': token,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      setStatuses((prev) => ({ ...prev, [doc.fileName]: 'sent' }));
      // Reset to idle after 4 seconds so the user can request another
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
      <Script
        src={TURNSTILE_SCRIPT_SRC}
        strategy="afterInteractive"
        onLoad={() => setTurnstileLoaded(true)}
      />

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

      {/* Invisible Turnstile widget container — appearance='execute' means
          nothing renders until executed; on managed-challenge pass it stays
          invisible, on interactive-challenge fail it pops a modal. */}
      <div id={turnstileContainerId} className="cf-turnstile" />

      <p className="mt-6 text-xs leading-relaxed text-ink/55">
        Each request is verified server-side and sent to Robertson. Full PDF
        delivered by email within 1 business day to{' '}
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
