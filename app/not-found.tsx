import Link from 'next/link';
import { Home, Package, Mail, Phone } from 'lucide-react';
import { SITE } from '@/lib/site';
import { buildTelUrl } from '@/lib/whatsapp';

/**
 * Custom 404 page (Round 7 F2.R7 fix).
 *
 * JARA-brand 404 with 3 nav tiles + Anna phone CTA.
 * Replaces the default Next.js / Cloudflare unbranded error page.
 */

export const metadata = {
  title: '404 — Page Not Found',
  description:
    'The page you requested does not exist or has moved. Browse our products, request a quote, or contact JARA International directly.',
};

const tiles = [
  { href: '/', icon: Home, title: 'Home', body: 'Back to the JARA International homepage with calculator and product overview.' },
  { href: '/products', icon: Package, title: 'Products', body: 'Nine fiber-cement product lines — subfloor, roof sheathing, cladding, deck, and more.' },
  { href: '/contact', icon: Mail, title: 'Contact', body: 'Phone, WhatsApp, email — pick your preferred channel for a 1-business-day reply.' },
];

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-bg-soft">
      <section className="mx-auto max-w-4xl px-6 py-20 lg:px-8 lg:py-28 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-steel">
          404 · Page not found
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-navy md:text-5xl text-balance">
          We couldn&apos;t find that page
        </h1>
        <p className="mt-4 mx-auto max-w-xl text-lg leading-relaxed text-ink/75">
          The page may have moved, or the link may be incorrect. Try one of these
          starting points — or call our sales line for immediate help.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-3 text-left">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.href}
                href={tile.href}
                className="group rounded-lg border border-bluegray/40 bg-white p-6 transition-all hover:border-navy hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel"
              >
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
                </div>
                <h2 className="font-display text-lg font-semibold text-navy group-hover:text-navy-dark">
                  {tile.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">
                  {tile.body}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-12">
          <a
            href={buildTelUrl(SITE.phonePrimaryRaw)}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-navy px-6 py-3 text-sm font-semibold text-white hover:bg-navy-dark transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          >
            <Phone className="h-4 w-4" aria-hidden="true" strokeWidth={2.5} />
            Call sales now · {SITE.phonePrimary}
          </a>
        </div>
      </section>
    </div>
  );
}
