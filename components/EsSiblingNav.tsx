import Link from 'next/link';

/**
 * Cross-links between the Spanish pages.
 *
 * SEO/GEO audit 2026-07-29 (gap P4). The /es cluster was a hub-and-spoke with
 * only inbound-to-hub edges: each sub-page linked back up to /es, but nothing
 * linked down or sideways. Net result was zero inbound internal links on all
 * four sub-pages — they were reachable only through the sitemap, and Bing had
 * never discovered the equivalent EN guides for the same reason.
 *
 * Adding the down-links on /es fixes reachability; this component adds the
 * sideways edges so the cluster reads as a section rather than four unrelated
 * leaves, and so crawl depth to any ES page stays at 2 from the homepage.
 *
 * `tone` mirrors the Breadcrumbs prop: the stub pages render on navy, while
 * /es/pricing was rebuilt on the light surface.
 */

const PAGES = [
  { href: '/es/pricing', label: 'Precios (DDP)' },
  { href: '/es/service-areas', label: 'Pedidos y logística' },
  { href: '/es/resources', label: 'Recursos y sometimiento' },
  { href: '/es/contact', label: 'Contacto' },
] as const;

export function EsSiblingNav({
  current,
  tone = 'dark',
}: {
  /** Path of the current page, excluded from the list. */
  current: string;
  tone?: 'light' | 'dark';
}) {
  const others = PAGES.filter((p) => p.href !== current);
  const dark = tone === 'dark';

  return (
    <nav
      aria-label="Otras páginas en español"
      className={
        dark
          ? 'mt-10 border-t border-white/15 pt-6'
          : 'mt-10 border-t border-bluegray/40 pt-6'
      }
    >
      <h2
        className={`font-display text-sm font-semibold uppercase tracking-wider ${
          dark ? 'text-white/70' : 'text-navy'
        }`}
      >
        Más en español
      </h2>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        {others.map((p) => (
          <li key={p.href}>
            <Link
              href={p.href}
              className={
                dark
                  ? 'text-white/85 underline decoration-white/30 underline-offset-2 transition-colors hover:text-white hover:decoration-white'
                  : 'font-semibold text-navy underline decoration-navy/30 underline-offset-2 hover:decoration-navy'
              }
            >
              {p.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/es"
            className={
              dark
                ? 'text-white/60 underline decoration-white/20 underline-offset-2 transition-colors hover:text-white'
                : 'text-steel underline decoration-steel/30 underline-offset-2 hover:text-navy'
            }
          >
            Inicio en español
          </Link>
        </li>
      </ul>
    </nav>
  );
}
