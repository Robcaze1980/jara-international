/**
 * Authoritative source registry (SEO/GEO audit 2026-07-29, gap P1).
 *
 * WHY THIS EXISTS
 * ---------------
 * The 2026-07-29 crawl found that jarainternational.com carried **zero**
 * outbound citations sitewide — the only external link on any page was the
 * WhatsApp deep link. Meanwhile the site asserts ~8 code/compliance claims
 * (ASTM E-136, ASTM E-84, ASTM C1186, UL R15140, IBC 2021 Type I/II,
 * CBC Chapter 7A, IAPMO ER-360) with nothing a reader — or an AI answer
 * engine — can follow to verify them.
 *
 * The target-query benchmark run the same day showed the cost directly:
 * for "UL R15140", "subfloor Type I/II ASTM E136", and "fiber-cement vs
 * plywood subfloor", answer engines synthesized from codes.iccsafe.org,
 * buildsteel.org, icc-nta.org and uniform-es.org — sources that are
 * linkable and corroborated. JARA appeared in none of them.
 *
 * Unlinked compliance claims are, to a retrieval system, unverifiable
 * assertions. This registry is the single source of truth for the
 * authorities that substantiate each claim, so the citation block, the
 * JSON-LD `citation` array, and llms.txt cannot drift apart.
 *
 * RULES
 * -----
 * - Every URL here was verified to resolve on 2026-07-29. Re-verify before
 *   adding: a broken outbound citation is worse than no citation.
 * - `substantiates` must describe the *specific* claim the source backs, not
 *   a general topic. Vague mappings defeat the purpose.
 * - Cite the issuing authority, never a reseller or a content-farm summary.
 * - `validThrough` is stated as fact and rendered as a date, never resolved
 *   against a build-time clock — these pages are statically prerendered, so a
 *   build-time "expired?" boolean silently goes stale between deploys.
 */

export type Source = {
  /** Stable key used to reference the source from a page. */
  id: string;
  /** Short label shown in the citation list. */
  label: string;
  /** The body that issues or publishes the document. */
  publisher: string;
  /** Verified-resolving URL to the authority's own page for this document. */
  url: string;
  /** The specific claim on JARA pages that this source substantiates. */
  substantiates: string;
  /**
   * ISO date the cited edition/report is valid through, for time-bound
   * documents (evaluation reports). Rendered as a stated fact — see RULES.
   */
  validThrough?: string;
  /**
   * Set when the linked page is a paywalled standard or a login-walled
   * database. Surfaced to the reader so a paywall is not mistaken for a
   * broken link, and so AI extractors do not treat it as a dead reference.
   */
  access?: 'paywalled' | 'registration';
};

export const SOURCES = {
  astmE136: {
    id: 'astmE136',
    label: 'ASTM E136 — Behavior of Materials in a Vertical Tube Furnace at 750 °C',
    publisher: 'ASTM International',
    url: 'https://www.astm.org/e0136-19a.html',
    substantiates:
      'The non-combustibility test method the IBC uses to qualify a material as non-combustible. Our "non-combustible" claim means the panel passes this test, not that it is merely fire-resistant.',
    access: 'paywalled',
  },
  astmE84: {
    id: 'astmE84',
    label: 'ASTM E84 — Surface Burning Characteristics of Building Materials',
    publisher: 'ASTM International',
    url: 'https://www.astm.org/e0084-25.html',
    substantiates:
      'The flame-spread and smoke-developed test behind the Class A rating cited on product pages.',
    access: 'paywalled',
  },
  astmC1186: {
    id: 'astmC1186',
    label: 'ASTM C1186 — Flat Fiber-Cement Sheets',
    publisher: 'ASTM International',
    url: 'https://www.astm.org/c1186-22.html',
    substantiates:
      'The material specification behind the "Type A, Grade I" designation used throughout the catalog.',
    access: 'paywalled',
  },
  ibcTypes: {
    id: 'ibcTypes',
    label: 'IBC 2021 Chapter 6 — Types of Construction',
    publisher: 'International Code Council',
    url: 'https://codes.iccsafe.org/content/IBC2021P1/chapter-6-types-of-construction',
    substantiates:
      'Defines construction Types I–V and establishes that Type I and Type II require non-combustible building elements — the reason a combustible plywood or OSB deck does not qualify.',
  },
  ibcFireProtection: {
    id: 'ibcFireProtection',
    label: 'IBC 2021 Chapter 7 — Fire and Smoke Protection Features',
    publisher: 'International Code Council',
    url: 'https://codes.iccsafe.org/content/IBC2021P1/chapter-7-fire-and-smoke-protection-features',
    substantiates:
      'Governs fire-resistance-rated floor/ceiling assemblies and how a tested assembly rating is established and documented.',
  },
  cbc7A: {
    id: 'cbc7A',
    label:
      'California Building Code Chapter 7A — Materials and Construction Methods for Exterior Wildfire Exposure',
    publisher: 'International Code Council / California Building Standards Commission',
    url: 'https://codes.iccsafe.org/content/CABC2022P4/chapter-7a-sfm-materials-and-construction-methods-for-exterior-wildfire-exposure',
    substantiates:
      'The Wildland-Urban Interface requirements referenced by the CBC Chapter 7A compliance claim.',
  },
  ulCertification: {
    id: 'ulCertification',
    label: 'UL Product iQ — certification and assembly directory',
    publisher: 'UL Solutions',
    url: 'https://productiq.ul.com/',
    substantiates:
      'Where UL file R15140 and the referenced fire-rated assembly designs (H502, H504, H511, U449, U487) can be looked up against UL’s own records rather than taken on our word.',
    access: 'registration',
  },
  iapmoUes: {
    id: 'iapmoUes',
    label: 'IAPMO Uniform Evaluation Service',
    publisher: 'IAPMO UES',
    url: 'https://uniform-es.org/evaluation-services',
    substantiates:
      'The body that issues the ER-series evaluation reports, including ER-360, and the authoritative place to confirm a report’s current status and validity window.',
    // `validThrough` intentionally unset pending the renewed ER-360 expiry date.
    // The prior edition ran to 2026-07-31; founder confirmed renewal on
    // 2026-07-29 but the new date is not yet recorded here. Publishing the
    // superseded date would state a lapsed window as current — worse than
    // stating none, since this block exists to be trusted. Set it as soon as
    // the renewed letter is in hand, and sweep the other surfaces that still
    // carry 2026-07-31: data/products.ts (cert.validThrough), public/llms.txt,
    // and the meta descriptions on / and /resources.
  },
} as const satisfies Record<string, Source>;

export type SourceId = keyof typeof SOURCES;

/** Resolve source IDs to full records, preserving the order given. */
export function getSources(ids: readonly SourceId[]): Source[] {
  return ids.map((id) => SOURCES[id]);
}

/**
 * schema.org `citation` entries for an Article. Uses CreativeWork rather than
 * a bare URL string so extractors get the publisher attribution too.
 */
export function citationSchema(ids: readonly SourceId[]) {
  return getSources(ids).map((s) => ({
    '@type': 'CreativeWork' as const,
    name: s.label,
    url: s.url,
    publisher: { '@type': 'Organization' as const, name: s.publisher },
  }));
}
