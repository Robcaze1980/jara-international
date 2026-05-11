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
 */

export type BreadcrumbItem = { name: string; path: string };

export function Breadcrumbs({
  pageUrl,
  items,
}: {
  pageUrl: string;
  items: BreadcrumbItem[];
}) {
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
        <ol className="flex flex-wrap items-center gap-1.5 text-steel">
          {items.map((item, idx) => {
            const isLast = idx === items.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {idx > 0 && (
                  <ChevronRight className="h-3.5 w-3.5 text-bluegray" aria-hidden="true" />
                )}
                {isLast ? (
                  <span aria-current="page" className="text-navy font-medium">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="hover:text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-steel rounded-sm"
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
