'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';

/**
 * SiteHeader — sticky top navigation (2026-05-17).
 *
 * 2026-05-17 v2: switched from navy bg + wordmark to WHITE bg + JARA
 * logo PNG. Two reasons:
 *   1. JARA brand logo is solid navy on transparent — invisible on the
 *      previous navy header. White bg lets the logo render in native
 *      brand colors.
 *   2. The previous navy header blended into the navy hero overlay,
 *      losing the visual separation between site shell and page
 *      content. White header now clearly demarcates the nav region.
 *
 * Sticky positioning (top-0 z-50) keeps the nav visible on every page.
 * Mobile: hamburger toggles a panel under the header; closes on route
 * change to avoid stale-open state.
 */

const NAV_LINKS = [
  { href: '/', label: 'Home' },
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
      className="sticky top-0 z-50 border-b border-bluegray/40 bg-white/95 backdrop-blur-md shadow-sm"
      aria-label="Main navigation"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3 lg:px-8">
        {/* JARA logo */}
        <Link
          href={isEs ? '/es' : '/'}
          className="flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-navy"
          aria-label={`${SITE.name} — home`}
        >
          <Image
            src="/images/logo/Jara_logo_transparent.png"
            alt={SITE.name}
            width={891}
            height={295}
            priority
            className="h-12 w-auto lg:h-14"
          />
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
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                  active
                    ? 'text-navy bg-bg-soft'
                    : 'text-navy/85 hover:text-navy hover:bg-bg-soft/60'
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
            className="hidden rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-steel hover:text-navy sm:inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            aria-label={isEs ? 'Ver sitio en inglés' : 'Ver sitio en español'}
          >
            {isEs ? 'EN' : 'ES'}
          </Link>
          <a
            href={buildTelUrl(SITE.phonePrimaryRaw)}
            className="hidden items-center gap-2 rounded-md border border-navy/30 px-3 py-2 text-xs font-semibold text-navy hover:bg-bg-soft transition-colors md:inline-flex focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            aria-label={`Call ${SITE.phonePrimary}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2} />
            <span>{SITE.phonePrimary}</span>
          </a>
          <Link
            href="/contact"
            className="hidden rounded-md bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy-dark transition-colors lg:inline-block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            Request Quote
          </Link>
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 text-navy hover:bg-bg-soft transition-colors lg:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
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
          className="border-t border-bluegray/40 bg-white lg:hidden"
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
                      className={`block rounded-md px-3 py-3 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
                        active ? 'text-navy bg-bg-soft' : 'text-navy/85 hover:bg-bg-soft/60'
                      }`}
                      aria-current={active ? 'page' : undefined}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
              <li className="border-t border-bluegray/40 pt-2">
                <Link
                  href={isEs ? '/' : '/es'}
                  className="block rounded-md px-3 py-3 text-base font-medium text-navy/85 hover:bg-bg-soft/60"
                >
                  {isEs ? 'English' : 'Español'}
                </Link>
              </li>
              <li>
                <a
                  href={buildTelUrl(SITE.phonePrimaryRaw)}
                  className="flex items-center gap-2 rounded-md px-3 py-3 text-base font-medium text-navy/85 hover:bg-bg-soft/60"
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  <span>{SITE.phonePrimary}</span>
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/contact"
                  className="block rounded-md bg-navy px-4 py-3 text-center text-sm font-semibold text-white hover:bg-navy-dark transition-colors"
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
