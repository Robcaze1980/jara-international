'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl, buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * Sticky CTA bar — per ADR-026 HE2 (appears after scroll past hero).
 *
 * Behavior:
 * - Hidden on first viewport (above-fold isn't dominated by a CTA bar)
 * - Appears after user scrolls ~600px past hero
 * - Per Round 6 F5.R6 (DeepSeek): hides when virtual keyboard is open on mobile
 *   (visualViewport API) so the bar doesn't overlap form inputs
 * - Phone CTA = Anna (primary, per 2026-05-10 phone strategy)
 * - WhatsApp = Robertson (secondary; Anna doesn't handle WhatsApp)
 *
 * i18n note (Round 6 Claude finding): currently English-only. /es page can
 * pass an `lang="es"` prop in a later iteration to swap labels.
 */

const SCROLL_TRIGGER_PX = 600;

export function StickyCTABar({ lang = 'en' }: { lang?: 'en' | 'es' }) {
  const [visible, setVisible] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SCROLL_TRIGGER_PX);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Detect virtual keyboard via visualViewport (mobile only)
  useEffect(() => {
    const vv = (typeof window !== 'undefined' ? window.visualViewport : null) as VisualViewport | null;
    if (!vv) return;
    const onResize = () => {
      // If visual viewport is significantly smaller than window, keyboard is likely open
      const heightRatio = vv.height / window.innerHeight;
      setKeyboardOpen(heightRatio < 0.75);
    };
    vv.addEventListener('resize', onResize);
    return () => vv.removeEventListener('resize', onResize);
  }, []);

  if (keyboardOpen) return null;

  const labels = lang === 'es'
    ? { call: 'Llamar', whatsapp: 'WhatsApp', quote: 'Cotizar' }
    : { call: 'Call', whatsapp: 'WhatsApp', quote: 'Get Quote' };

  return (
    <div
      role="region"
      aria-label="Quick contact options"
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="mx-auto max-w-7xl px-4 pb-3 lg:px-8">
        <div className="rounded-lg border border-bluegray/30 bg-navy shadow-2xl">
          <div className="flex items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6">
            <a
              href={buildTelUrl(SITE.phonePrimaryRaw)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-white px-3 py-2.5 text-sm font-semibold text-navy hover:bg-bluegray transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex-none sm:px-4"
              aria-label={`${labels.call} ${SITE.phonePrimary}`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
              <span className="hidden sm:inline">{labels.call}</span>
              <span className="sm:hidden">{labels.call}</span>
            </a>

            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-white/30 px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex-none sm:px-4"
              aria-label={`${labels.whatsapp} ${SITE.phoneSecondary}`}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" strokeWidth={2.25} />
              <span className="hidden sm:inline">{labels.whatsapp}</span>
              <span className="sm:hidden">WA</span>
            </a>

            <Link
              href="/resources"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-bluegray px-3 py-2.5 text-sm font-semibold text-navy hover:bg-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:flex-none sm:px-4"
            >
              {labels.quote}
              <ArrowRight className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
