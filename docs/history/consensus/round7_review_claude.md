# Round 7 REVIEW Vote — Claude Opus 4.7

**Captured:** 2026-05-10 (before reading other voter outputs)
**Disclosure:** I authored the Sprint 2 code AND have file-level access to the deliverable. I'll be more granular about specific gaps but biased toward leniency on my own work — voters please cross-check.

```json
{
  "model": "claude-opus-4-7",
  "agent": "Claude Opus 4.7 (1M context, file-level access, author bias disclosed)",
  "votes": {
    "RA": "RA2",
    "RB": "RB1"
  },
  "reasoning": {
    "RA": "Sprint 2 deployed cleanly first attempt and all sections render in production with full ADR compliance (especially the SB-4 zero-currency check). However, I found 6 real gaps that compound if Sprint 3 builds on top: dead links in nav, missing JSON-LD on /es, font preload missing for LCP, FAQPage builder unused, calculator e2e flow has a broken link target. Tight cleanup needed.",
    "RB": "Sprint 3 (product detail pages) is structurally simpler than Sprint 2 — same ProductCard pattern repeated 6 times with deeper data, productSchema() builder already exists, no new client components needed beyond what exists. Sprint 2 burned the heaviest unknowns (calculator state, sticky bar mobile, JSON-LD payload structure). HIGH confidence."
  },
  "concerns_observed": [
    {
      "title": "Footer nav links to /products /resources /contact /es — three of those are 404",
      "category": "ux",
      "severity": "high",
      "must_fix_before_sprint_3": true,
      "description": "SiteFooter renders nav with 4 links: /, /products, /resources, /contact, /es. Currently /, /es exist; /products, /resources, /contact return 404. A user clicking any of those gets a Cloudflare/Next 404 page — bad UX especially when they came from a high-intent page (calculator result, FinalCTA). Two acceptable fixes before Sprint 3: (a) remove non-existent links from footer until pages ship, (b) create stub pages with 'Coming soon' + redirect-to-contact CTA. Recommend (a) — links reappear when pages ship in Sprint 3/4."
    },
    {
      "title": "ProductCard links go to /products which is also 404",
      "category": "ux",
      "severity": "high",
      "must_fix_before_sprint_3": true,
      "description": "All 6 ProductCard components on home link to /products (per Round 6 finding — documented as expected-overwrite). But /products doesn't exist yet. Every product card click = 404. Same fix options: (a) link cards to /resources?product={slug} as a graceful fallback that the existing /resources page can handle (when built); (b) create a /products stub with 'Detail pages launching this week' + contact CTA; (c) make cards non-clickable until Sprint 3. Recommend (b) — preserves the click affordance and the catalog-coming narrative."
    },
    {
      "title": "next/script with strategy='beforeInteractive' duplicates JSON-LD scripts in HTML",
      "category": "seo_ai",
      "severity": "medium",
      "must_fix_before_sprint_3": true,
      "description": "Local smoke test found 18 'application/ld+json' matches when only 9 expected (Org + LocalBusiness from layout + WebSite + 6 Products from page = 9). Likely cause: next/script with beforeInteractive injects via document.head + via Next's own boot-time SSR. Either (a) switch to plain <script type='application/ld+json' dangerouslySetInnerHTML> in <head> (Next's recommended pattern for static JSON-LD) — eliminates duplication, smaller HTML; or (b) verify the duplicates aren't actually duplicates but separate framework injections. Schema validation (Round 5 single-voter, Sprint 4 task) will catch issues either way, but cleaner JSON-LD now reduces noise."
    },
    {
      "title": "Hero image is SVG placeholder — LCP candidate not optimized for production",
      "category": "performance",
      "severity": "medium",
      "must_fix_before_sprint_3": false,
      "description": "Hero <Image> uses /images/hero/_placeholder-hero.svg with priority flag set. SVG is small (~3KB) so LCP is fine for now, but per ADR-019 SH2 (LCP <1.5s) AND per memory `user_provides_visuals.md` (user delivers final hero), we should: (a) preload the SVG in <head> (currently only priority on <Image>), (b) document the swap procedure when user delivers hero.webp/jpg, (c) ensure image-hash-based cache-busting on swap. Sprint 3 fine; Sprint 4 deadline."
    },
    {
      "title": "/es page has no sticky bar AND not localized — breaks consistent mobile UX",
      "category": "ux",
      "severity": "medium",
      "must_fix_before_sprint_3": false,
      "description": "StickyCTABar is mounted in app/page.tsx (home) only, not in app/layout.tsx (which is where SiteFooter is). So /es doesn't have it. Users on /es who want to call have to scroll to footer. Also: my Round 6 prompt + StickyCTABar code support a `lang='es'` prop for label localization but the prop is never set anywhere because /es doesn't render StickyCTABar. Fix: move StickyCTABar mounting to layout.tsx with conditional `lang` based on route (or accept English labels for /es since most US Hispanic construction labor is bilingual). Sprint 3 acceptable; Sprint 4 latest."
    },
    {
      "title": "next/font Montserrat declares weights 400/500/600/700 but Hero text-shadow + headings only use 600/700 — 18KB unused font weight",
      "category": "performance",
      "severity": "low",
      "must_fix_before_sprint_3": false,
      "description": "Auditing payload: Montserrat ships 4 weights (~18KB total woff2). Page actually uses 600 (Hero subhead, ValueProps headings) and 700 (Hero h1, section h2s). Weights 400 and 500 are imported in layout.tsx but never used in components. Drop to weights ['600', '700'] in layout.tsx Montserrat config — saves ~9KB and one extra HTTP request on first page load. SH2 LCP target benefits. Easy Sprint 3 cleanup."
    },
    {
      "title": "faqSchema() builder added to lib/jsonld.ts but never imported anywhere",
      "category": "technical_debt",
      "severity": "low",
      "must_fix_before_sprint_3": false,
      "description": "Added faqSchema with empty-guard per Round 6 SCOPE but no FAQ content exists in Sprint 2 (Round 5 noted FAQPage in baseline = empty schema spam risk; my guard handles it). Builder exists, returns null on empty array, never called yet. Will be used in Sprint 3 product detail pages. NOT a problem; just flagging that ESLint or treeshaking might warn on unused export. Confirm no warning on next build."
    }
  ],
  "compliments": [
    "Sprint 2 shipped first-attempt clean — no fix commits needed post-deploy. The pre-push smoke test caught the JSON-LD priceCurrency leak (Plycem SB-4 risk) and fixed it before push, vs Sprint 1's pattern of fix-after-deploy. Discipline upgrade.",
    "Calculator implementation honors all 4 Round 6 convergent constraints (airtight validation, URL prefill, no currency, a11y aria-live) in a single component without state-management library — useState + useId is enough. Clean."
  ],
  "verdict": "revise",
  "verdict_reason": "Sprint 2 is structurally solid and SB-4 compliant, but 3 high-severity UX gaps (dead nav links, dead product card links) will harm conversion the moment the site sees real traffic. Tight ~30-min cleanup pass — remove broken nav links, create /products stub — before Sprint 3 starts."
}
```

## Vote summary

| Item | Vote | Why |
|---|---|---|
| RA — Sprint 2 verdict | **RA2** ship-with-fixes | 3 high-severity dead-link UX issues + 4 medium/low cleanups |
| RB — Sprint 3 risk grade | **RB1** high confidence | Sprint 3 reuses Sprint 2 patterns; structurally simpler |

## Top 3 must-fix before Sprint 3 starts

1. **Footer nav** — remove links to /products, /resources, /contact (or make them stubs)
2. **ProductCard links** — same problem, redirect to /resources?product={slug} OR /products stub
3. **JSON-LD duplicates** — investigate the 18 vs 9 count, switch to plain `<script>` in head if next/script is the cause
