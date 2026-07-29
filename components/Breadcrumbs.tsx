import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SITE } from '@/lib/site';
import { breadcrumbSchema, jsonLdScript } from '@/lib/jsonld';

/**
 * Breadcrumb trail with BreadcrumbList JSON-LD (Round 8 F5.R8).
 *
 * Caller passes the page canonical URL + ordered items (root → leaf), with
 * each item's `path` being a relative path. The component:
 *   - renders Links with the relative `path` for client-side navigation
 *   - derives absolute URLs (SITE.url + path) for the BreadcrumbList JSON-LD
 *   - marks the last item as the current page (no link, aria-current)
 *
 * SEO/GEO audit 2026-07-29 (gap P4): added the `tone` prop. The /es stub pages
 * render on a navy background, so the default steel-on-white palette was
 * illegible there — which is why those pages shipped with no breadcrumbs and
 * therefore no BreadcrumbList schema at all, unlike their EN counterparts.
 * `tone="dark"` keeps one component (and one schema path) serving both themes.
 */

export type BreadcrumbItem = { name: string; path: string };

export function Breadcrumbs({
  pageUrl,
  items,
  tone = 'light',
}: {
  pageUrl: string;
  items: BreadcrumbItem[];
  /** `dark` for navy-background pages (the /es cluster). */
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  const listTone = dark ? 'text-white/60' : 'text-steel';
  const chevronTone = dark ? 'text-white/35' : 'text-bluegray';
  const currentTone = dark ? 'text-white font-medium' : 'text-navy font-medium';
  const linkTone = dark
    ? 'hover:text-white focus-visible:outline-white/60'
    : 'hover:text-navy focus-visible:outline-steel';
  const schemaItems = items.map((item) => ({
    name: item.name,
    url: `${SITE.url}${item.path}`,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbSchema(pageUrl, schemaItems)) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className={`flex flex-wrap items-center gap-1.5 ${listTone}`}>
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {idx > 0 && (
                  <ChevronRight className={`h-3.5 w-3.5 ${chevronTone}`} aria-hidden="true" />
                )}
                {isLast ? (
                  <span aria-current="page" className={currentTone}>
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className={`focus-visible:outline-2 focus-visible:outline-offset-2 rounded-sm ${linkTone}`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
