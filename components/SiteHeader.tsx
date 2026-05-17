'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';

/**
 * SiteHeader — sticky top navigation (2026-05-17 addition).
 *
 * Wordmark (text logo) until the JARA logo PNG asset is delivered. Once
 * `public/images/logo.png` exists, swap the wordmark span for a next/image
 * referencing that file and add an `image` field to organizationSchema()
 * in lib/jsonld.ts.
 *
 * Sticky positioning (top-0 z-50) keeps the nav visible during scroll on
 * every page. Backdrop-blur over a translucent navy bg gives the header
 * visual depth over hero photography without losing AA text contrast.
 *
 * Mobile: hamburger toggles a full-width panel under the header. Closes
 * automatically on route change to avoid stale-open state.
 */

const NAV_LINKS = [
  { href: '/products', label: 'Products' },
  { href: '/products/high-performance-subfloor', label: 'Subfloor' },
  { href: '/resources', label: 'Resources' },
  { href: '/service-areas', label: 'Service Areas' },
  { href: '/contact', label: 'Contact' },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isEs = pathname?.startsWith('/es') ?? false;

  return (
    <header
      className="sticky top-0 z-50 border-b border-white/10 bg-navy/95 backdrop-blur-md"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-8 lg:py-4">
        {/* Wordmark — text logo until PNG asset delivered */}
        <Link
          href={isEs ? '/es' : '/'}
          className="flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          aria-label={`${SITE.name} — home`}
        >
          <span className="font-display text-xl font-bold tracking-tight text-white lg:text-2xl">
            JARA
          </span>
          <span className="hidden font-display text-xs font-medium uppercase tracking-[0.18em] text-bluegray sm:inline">
            International
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href ||
              (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  active
                    ? 'text-white bg-white/10'
                    : 'text-white/85 hover:text-white hover:bg-white/5'
                }`}
                aria-current={active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right-side actions */}
        <div className="flex items-center gap-2">
          <Link
            href={isEs ? '/' : '/es'}
            className="hidden rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-white/80 hover:text-white sm:inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={isEs ? 'Ver sitio en inglés' : 'Ver sitio en español'}
          >
            {isEs ? 'EN' : 'ES'}
          </Link>
          <a
            href={buildTelUrl(SITE.phonePrimaryRaw)}
            className="hidden items-center gap-2 rounded-md border border-white/30 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 transition-colors md:inline-flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-label={`Call ${SITE.phonePrimary}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
            <span>{SITE.phonePrimary}</span>
          </a>
          <Link
            href="/contact"
            className="hidden rounded-md bg-white px-4 py-2 text-sm font-semibold text-navy hover:bg-bluegray transition-colors lg:inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Request Quote
          </Link>
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-white/10 transition-colors lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          className="border-t border-white/10 bg-navy lg:hidden"
        >
          <nav className="mx-auto max-w-7xl px-6 py-4" aria-label="Mobile primary">
            <ul className="space-y-1">
              {NAV_LINKS.map((link) => {
                const active =
                  pathname === link.href ||
                  (link.href !== '/' && pathname?.startsWith(link.href));
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`block rounded-md px-3 py-3 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                        active ? 'text-white bg-white/10' : 'text-white/85 hover:bg-white/5'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="border-t border-white/10 pt-2">
                <Link
                  href={isEs ? '/' : '/es'}
                  className="block rounded-md px-3 py-3 text-base font-medium text-white/85 hover:bg-white/5"
                >
                  {isEs ? 'English' : 'Español'}
                </Link>
              </li>
              <li>
                <a
                  href={buildTelUrl(SITE.phonePrimaryRaw)}
                  className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium text-white/85 hover:bg-white/5"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  <span>{SITE.phonePrimary}</span>
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="block rounded-md bg-white px-4 py-3 text-center text-sm font-semibold text-navy hover:bg-bluegray transition-colors"
                >
                  Request Quote
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
}
