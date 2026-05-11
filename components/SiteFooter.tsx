import Link from 'next/link';
import { SITE } from '@/lib/site';
import { buildTelUrl, buildWhatsAppUrl } from '@/lib/whatsapp';

/**
 * Site footer — appears on every page via root layout.
 *
 * Per Plycem ship blocker SB-8: copyright = "© JARA International Inc."
 * — NEVER claim to be Plycem.
 *
 * Per 2026-05-10 phone strategy: Anna primary, Robertson secondary.
 * Footer is the place where the secondary direct number appears for trust.
 */

const certifications = [
  'UL R15140',
  'ASTM C1186',
  'ASTM E-84',
  'IAPMO ER-360',
  'ISO 9001:2015',
  'ISO 14001:2015',
  'ISO 45001:2018',
];

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/resources', label: 'Resources' },
  { href: '/contact', label: 'Contact' },
  { href: '/es', label: 'Español' },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Site footer
      </h2>

      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand block */}
          <div className="lg:col-span-1">
            <p className="font-display text-lg font-bold text-white">{SITE.name}</p>
            <p className="mt-2 text-sm text-bluegray italic">{SITE.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/75">
              B2B distributor of premium fiber-cement panels for US construction.
              Warehouse in Long Beach, CA.
            </p>
          </div>

          {/* Contact block */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-bluegray">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <span className="block text-xs uppercase tracking-wider text-white/50">
                  Sales line (24/7 AI receptionist)
                </span>
                <a
                  href={buildTelUrl(SITE.phonePrimaryRaw)}
                  className="text-white hover:text-bluegray transition-colors"
                >
                  {SITE.phonePrimary}
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-white/50">
                  Direct (Robertson Carrillo)
                </span>
                <a
                  href={buildTelUrl(SITE.phoneSecondaryRaw)}
                  className="text-white hover:text-bluegray transition-colors"
                >
                  {SITE.phoneSecondary}
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-white/50">
                  WhatsApp
                </span>
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener"
                  className="text-white hover:text-bluegray transition-colors"
                >
                  {SITE.phoneSecondary}
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-white/50">
                  Email
                </span>
                <a
                  href={`mailto:${SITE.email}`}
                  className="text-white hover:text-bluegray transition-colors"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <span className="block text-xs uppercase tracking-wider text-white/50">
                  Warehouse
                </span>
                <span className="text-white">
                  {SITE.warehouse.city}, {SITE.warehouse.region}, {SITE.warehouse.country}
                </span>
              </li>
            </ul>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-bluegray">
              Navigate
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/85 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Certifications block (text-only per Round 6 F3.R6 + Plycem ship blocker compliance) */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-bluegray">
              Compliance
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2 text-xs">
              {certifications.map((cert) => (
                <li
                  key={cert}
                  className="rounded border border-white/20 px-2 py-1 text-white/85"
                >
                  {cert}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-white/60">
              Documentation packets available on request. Compliance details
              vary by product line and assembly.
            </p>
          </div>
        </div>

        {/* Legal line — Plycem ship blocker SB-8 compliant */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-white/55">
          <p>
            © 2026 {SITE.legalName}. All rights reserved.{' '}
            <span className="block sm:inline mt-2 sm:mt-0">
              PLYCEM® is a registered trademark of The Plycem Company / Elementia Materials.
              JARA International Inc. is a US-based distributor of Plycem products and is
              not affiliated with The Plycem Company beyond the distribution relationship.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
