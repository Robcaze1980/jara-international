# Julio 9 — SEO/GEO Audit & Loop Methodology

**Project:** jarainternational.com (jara-website) · **Date:** 2026-07-09
**Method:** 9-agent audit workflow (7 parallel dimension deep-dives → synthesis → adversarial critic)
**Verdict:** *Conditional pass* — executing Phases 1–4 **plus** the 6 adversarial additions re-audits clean across all dimensions.

> **STATUS — 2026-07-09, shipped to production: ✅ ALL AUDIT ITEMS DONE.**
> Phases 1–4 + critic additions #2–#6 implemented, verified, and live on
> jarainternational.com (commits `d60a5d4` → `3cc6fe1`). Item 43 shipped as a
> pricing-parity gate (`npm run check:pricing`, blocking pre-commit) instead of an
> llms.txt route conversion (lower risk). The three audit-accepted deferrals
> (lang route-groups refactor, @graph consolidation, Offer shipping/return policy)
> remain accepted risk — not open gaps.
>
> **ONLY OPEN ITEM:** 🔴 **critic #1 — IAPMO ER-360 expiry (2026-07-31)** — a
> founder/supplier business decision (renew or downgrade), tracked on a separate
> task. Not a code gap. Everything else is closed.

---

## Part 1 — SEO/GEO Audit Loop Methodology

A repeatable process to bring the site to its best crawlable, indexable, and **answer-ready** state for both classic search engines and AI answer engines (GEO — Generative Engine Optimization), and keep it there.

### Dimensions audited (cover all every pass)
1. **Crawlability** — robots.txt, AI-crawler allowlist, sitemap reference, crawl access
2. **Indexation** — `index,follow`, canonicals, hreflang reciprocity, noindex handling, redirects
3. **Page intent** — each URL maps to one clear search intent + a primary target query
4. **Titles & meta** — unique, query-matched, length-compliant (title ≤60 incl. suffix, desc ≤155)
5. **Internal links** — nav/footer, hub-and-spoke, anchor text, no orphans, equity to money pages
6. **Structured data** — Schema.org coverage + Google rich-result eligibility per page type
7. **Source citations / GEO surfaces** — `llms.txt`, `llms-full.txt`, `/api/llm-context`, citation guidance
8. **Answer-first content** — direct-answer paragraphs, FAQs, tables that win snippets + AI Overviews
(+ **Technical/performance SEO** — Core Web Vitals signals, images/alt, OG images, cache)

### The loop
1. **Crawl & audit** across every dimension (code **and** the live/dev site). Gather: `robots.txt`, `sitemap.xml`, and per key page the rendered `<title>` / meta description / canonical / hreflang / robots-meta / JSON-LD `@type` inventory / H1 / internal-link graph / the three AI text surfaces.
2. **Rank gaps by expected impact × effort.** Impact = does it block ranking, citation, or answer-readiness. Prefer low-effort, high-impact structural wins first.
3. **Fix the single highest-leverage gap** (then the next).
4. **Re-run the same crawl + a target-query benchmark** across search engines and AI answer engines.
5. **Repeat until:** no critical technical issue remains, **every priority query maps to a clear answer-ready page**, and the benchmark shows no high-impact gap left.

### Honest benchmarking note
Live **ranking / AI-citation** benchmarking requires the site **deployed** + indexing time + rank-tracking tooling. Pre-deploy (or for not-yet-live content), the "benchmark" is a **readiness scorecard** per dimension + a light target-query `WebSearch` spot-check — it measures whether the site *can* rank/be-cited, not live position. Re-run the true benchmark after deploy + indexing.

### How to run an exhaustive pass
Multi-agent workflow: **7 parallel dimension deep-dives** (each reads the real code + curls the dev server, returns structured findings with file-level fixes + a re-audit check) → **synthesis** (rank by impact×effort, sequence into phases, define per-dimension acceptance) → **adversarial completeness critic** (finds missed items, constraint over-reach, sequencing errors, weak acceptance).

### Reusable checks / tooling
```bash
# dev server (current in-progress state)
curl -s http://localhost:3000/robots.txt
curl -s http://localhost:3000/sitemap.xml | grep -oiE '<loc>[^<]*</loc>'
# per page: title / desc / canonical / hreflang / robots-meta / JSON-LD @types / h1
curl -s http://localhost:3000/<path> \
  | grep -oiE '<title>[^<]*</title>|<meta name="description"[^>]*>|rel="canonical"[^>]*|hreflang="[^"]*"|<meta name="robots"[^>]*>|"@type":"[^"]*"|<h1[^>]*>[^<]*'
npx tsc --noEmit   # after every fix
```
- Google **Rich Results Test** for Product/FAQ/Breadcrumb eligibility; an **hreflang validator** (Screaming Frog / Ahrefs) for reciprocity.
- **Cross-surface parity:** every price/claim must be *identical* across visible HTML, Product JSON-LD, `llms.txt`, `llms-full.txt`, and `/api/llm-context`. Mismatches erode AI-engine trust.

### Constraints that bound every fix (do NOT violate)
- **Plycem ship blockers:** no "PLYCEM" in domain or `<title>`; JARA brand identity, not Plycem; no Plycem-vs-competitor comparison **tables** and no **naming** a competitor without written approval (a generic "leading US brand" mention is allowed); no Plycem logo; footer © JARA. *(Product JSON-LD `brand.name = "Plycem"` is factual manufacturer semantics and is allowed — the ban scopes to domain + titles.)*
- **ADR-049:** no US-warehouse / "in stock" / "0–3 day" claims; product `availability = schema.org/MadeToOrder`; ~3–4 week direct-import delivery.
- **Founder overrides:** the green `/pricing` "Price terms" block is intentional (do not restyle); `priceValidUntil` is intentionally omitted per founder decision (do not add a dated validity).
- Subfloor is the locked lead/hero product.

### Stop condition
All per-dimension **acceptance criteria** (Part 2 → "Definition of clean re-audit") pass, and no high-impact gap remains.

---

## Part 2 — Audit results (2026-07-09 pass)

### Executive summary
The Round 16 pricing rollout is functionally live in JSON-LD and `/api/llm-context`, but the price signal is **stranded**: `/pricing` is a site-wide orphan (zero inbound links), carries no page-level schema and no plain-language cost answer, the `/products` catalog is a non-clickable stub, two of three AI text surfaces (`llms.txt`, `llms-full`) contradict the published prices, and one contractual rule is currently violated. The highest-leverage work is small and low-risk (nav links, title rewrites, hreflang de-duplication, breadcrumbs, `llms.txt` pricing, a cost-answer paragraph). Deeper schema, guide pages, and cross-surface parity then eliminate the content-depth and drift gaps.

### Scorecard by dimension
| Dimension | State |
|---|---|
| Crawlability | ✅ Strong — robots.txt allows all + explicit AI-crawler allowlist + sitemap reference |
| Indexation | ✅ `index,follow` + canonical + hreflang everywhere; `/long-beach-stock` correctly noindex |
| Sitemap | ✅ Dynamic + complete (all 7 products, `/pricing`, `/es`) — *but* request-time `lastmod` + no image entries |
| Titles | ⚠️ Home/product strong; suffix too long (8 titles >60); `/pricing` not query-matched; "Plycem" leaks in siding title |
| Structured data | ⚠️ Product/FAQ/Breadcrumb strong on detail pages; `/pricing` emits none; Offers now carry flat price (fixed) |
| Internal links | ⚠️ `/pricing` orphaned; `/products` cards non-clickable |
| Source citations (GEO) | ⚠️ Strong citation guidance; `llms.txt`/`llms-full` carry no prices (+ contradict) |
| Answer-first | ⚠️ Product FAQ schema good; `/pricing` has no cost answer / price FAQ |

### Do-first — 2 landmines (need a founder call)
1. **"Plycem" renders in the `/products/siding` `<title>`** — live contractual (SB) breach. `data/products.ts` `name:'Plycem Siding'` flows into the title. Fix via an optional `seoTitle` → "Fiber-Cement Plank Siding — 4 Profiles". *(Rank 1 — one-file fix, recommended immediately.)*
2. **IAPMO ER-360 expires 2026-07-31** (22 days) yet is advertised as a live cert across JSON-LD `validThrough`, meta keywords, `llms.txt`, and body copy of the lead product. A re-audit on/after July 31 fails a GEO-honesty check. CLAUDE.md already flags action **before 2026-07-15**. Decision: **(a)** obtain a renewed letter from Plycem, or **(b)** downgrade the site claim to "on request / verify" before it lapses.

### Already fixed this session (context)
- **Flat `price` + `priceCurrency` on every Offer** (`lib/jsonld.ts` `productOffers`) → Google Product price rich-result eligible on home + all product pages (verified: 10 price fields on the subfloor page). The `UnitPriceSpecification` (full-container semantics) is retained alongside.
- Pricing rollout live in `lib/pricing.ts`, `/pricing` (green Price terms), `productSchema()` Offers, and `/api/llm-context`.

---

### Phase 1 — quick structural wins (high-impact · S-effort)
Each is a one-file, low-risk edit that closes an auditor-visible gap.

**1. Remove "Plycem" from `/products/siding` `<title>`** · `data/products.ts`, `app/products/[slug]/page.tsx`
- *Do:* Add optional `seoTitle` to the Product type; have `generateMetadata` / og / twitter prefer `seoTitle || name`. Value: "Fiber-Cement Plank Siding — 4 Profiles".
- *Done when:* grep all product title/og/twitter for "plycem" (case-insensitive) → zero.

**2. Add `/pricing` to header + footer nav (de-orphan)** · `components/SiteHeader.tsx`, `components/SiteFooter.tsx`
- *Do:* `/pricing` has zero inbound links. Add to `NAV_LINKS` + footer `navLinks` (one edit covers EN + ES shells).
- *Done when:* visible "Pricing" link in top nav + footer on home and product pages.

**3. Shorten global title suffix to " | JARA"** · `app/layout.tsx`, `app/page.tsx`
- *Do:* Template `%s | JARA International Inc.` (26 chars) pushes 8 titles >60. Switch to `SITE.shortName` (" | JARA"); shorten the two still-long absolutes.
- *Done when:* all 18 route titles ≤60 incl. suffix.

**4. Rewrite `/pricing` title + meta to the buyer query** · `app/pricing/page.tsx`
- *Do:* "Delivered (DDP) Pricing" → "Fiber-Cement Subfloor Price — DDP, US Delivered". Meta ≤155, front-loaded with "$74/panel".
- *Done when:* title has "Subfloor" + "Price" (≤60); description ≤155 with a $ figure.

**5. Remove non-reciprocal es-US hreflang from the catalog (8 URLs)** · `app/sitemap.ts`, `app/products/[slug]/page.tsx`, `app/products/page.tsx`
- *Do:* 8 EN URLs claim `/es` as their Spanish twin; `/es` reciprocates only the home. Drop the es-US line (don't point at `/es/products/*` — 404), leaving self en-US + x-default.
- *Done when:* no product URL emits an es-US alt to `/es`; hreflang validator = zero "no return tag".

**6. Breadcrumbs (visible + JSON-LD) on 5 deep pages** · `app/{pricing,products,contact,service-areas,resources}/page.tsx`
- *Do:* Only `/products/[slug]` emits BreadcrumbList. Render the existing `Breadcrumbs.tsx` on the 5 remaining deep pages.
- *Done when:* each has exactly one BreadcrumbList with absolute item URLs; Rich Results eligible.

**7. Make `/products` cards clickable via ProductCard** · `app/products/page.tsx`, `components/ProductCard.tsx`
- *Do:* Catalog renders 7 non-linking `<div>`s → zero equity. Swap for `ProductCard` (already a Link); add "See delivered pricing →"; delete "coming this week".
- *Done when:* all 7 cards are anchors to `/products/<slug>`; no "this week" copy.

**8. Add a `## Pricing` section to `public/llms.txt`** · `public/llms.txt`, `lib/pricing.ts`
- *Do:* Today it says "for pricing, contact us" — contradicting JSON-LD. Add answer-first lines + the 11 priced SKUs (960140 $74, 972254 $83, 960151 $85, 971677 $89, 971829 $105, 960018 $28, 972234 $29, 960093 $39, 979422 $49, 982315 $48, 1323611 $49) + the 6 caveats verbatim + a "mirror lib/pricing.ts" comment.
- *Done when:* every price token matches `PRICE_BY_SKU`; all 6 caveats present; agrees with `/api/llm-context`.

**9. Answer-first cost paragraph above the fold on `/pricing`** · `app/pricing/page.tsx`, `lib/pricing.ts`
- *Do:* The $74 / ~$2.30-SF answer is buried in table cells. Add a lede under H1: "How much does non-combustible fiber-cement subfloor cost? … from $74 per 4×8 panel — about $2.30/SF — delivered DDP …". Derive from `getFromPriceUsd()`.
- *Done when:* first `<p>` after H1 = a self-contained answer with $ and $/SF; "cost"/"per square foot" in a heading.

**10. Drop `priority` from the decorative hero circle image** · `components/Hero.tsx`
- *Do:* Two images are marked `priority` — the real LCP hero AND a decorative circle (hidden on mobile) → a 3rd competing preload. Remove `priority` from the circle.
- *Done when:* only `hero-home.webp` is preloaded; `panel-detail.webp` lazy on all viewports.

### Phase 2 — schema + pricing-surface completion (M/L)
- **11** `/pricing` page-level schema — ItemList of the 3 priced products (reuse `productSchema` so prices can't drift) + BreadcrumbList + FAQPage. *(high/M)*
- **12** Visible price FAQ (6 Q&As) on `/pricing` + matching FAQPage schema (content half of #11). *(high/M)*
- **13** Product→`/pricing` links on all 7 detail pages — makes hub bidirectional. *(high/M)*
- **14** Prices in `app/llms-full.txt` — variant-table Price column + `## Pricing`, byte-consistent with the API. *(high/M)*
- **15** Guide/comparison pages under `/guides`: fiber-cement-vs-plywood-subfloor, non-combustible-subfloor-cost, type-i-ii-construction-subfloor (plywood/OSB are generic — no competitor named). *(high/L)*
- **18** Price FAQ on the 3 priced products + a "from $X" hero price line. *(med/S)*
- **19** Concrete price hook on the homepage hero / ValueProps. *(med/S)*
- **23** Wrap product Offers in AggregateOffer + itemCondition + Offer.url (availability stays MadeToOrder; no priceValidUntil). *(med/S)*
- **25** Price badge on the dynamic product OG cards (3 priced). *(med/S)*
- **34** Add `app/pricing/opengraph-image.tsx` with a price hook. *(med/M)*

### Phase 3 — content depth, parity & cleanup (medium)
- **16** Fix `llms.txt` catalog drift — remove "Fibroxton" + stale "lap siding".
- **17** Fix cert-gap undercount in `llms.txt` (say "Five", name all five).
- **20–22** Contextual links: ValueProps→`/pricing`; footer adds `/service-areas` + subfloor; `/pricing` ↔ `/service-areas` (DDP cluster).
- **24** Replace request-time sitemap `lastmod` with stable content-derived dates.
- **26–27** Per-product query-matched SEO titles; trim 14 over-length meta descriptions ≤155.
- **28–29** `/es/pricing` published-price copy + ES pricing schema bundle (ItemList + Breadcrumb + FAQ).
- **30** Add `contactPoint` to Organization schema (sales; EN+ES; phone = site CTA number).
- **31** Rebuild `/products` stub into a real catalog listing (prices + no "this week").
- **32–33** Cross-surface numeric-parity verification; bake comparison/alternative/cost query language into subfloor + `/pricing` copy.
- **35** Update citation guidance to authorize citing the published indicative prices.

### Phase 4 — polish & drift-hardening (low)
- **36–38** `/pricing` heading hierarchy; de-dupe brand in contact titles; `/products` stub title cleanup.
- **39–40** Tertiary FinalCTA→`/pricing` link; `/es/pricing` content-parity confirmation.
- **41–42** Image entries in the sitemap; `next/image` `minimumCacheTTL`. *(deploy-gated — verify on staging)*
- **43** Convert `llms.txt` to a generated route (or a CI parity check) — engineers away static-file drift.

### Adversarial additions — fold in for a truly clean re-audit
1. **IAPMO ER-360 expiry (2026-07-31)** — advertised as live across JSON-LD, meta, `llms.txt`, copy. Decide July-31 handling (renewed letter, or downgrade to "on request / verify") before it lapses.
2. **Phantom SearchAction** — `webSiteSchema()` declares a SearchAction to `/products?q=…` but no search exists (no `searchParams` handling). Remove it, or build real search.
3. **No About / entity-authority page** — a first-year (foundingDate 2026) importer with no About page + a thin Organization node is low E-E-A-T — exactly what AI engines hesitate to cite for compliance claims. Biggest trust lever available without fabrication.
4. **Guide pages need author + dates** — rank 15's `/guides` ship undated/unattributed; AI Overviews weight `datePublished`/`dateModified` + author. Add to the Article schema.
5. **Price-parity net has blind spots** — new hardcoded "$74/$2.30" strings (guides, product FAQs, hero, OG cards) aren't in the rank-32 parity check. Derive from `getFromPriceUsd()` or add them to the gate.
6. **MaterialCalculator left inert** — it already answers "how many panels / what will a container cost" (question-shaped content GEO engines lift). Link it to `/pricing`, frame answer-first, add HowTo/WebApplication schema.

### Definition of "clean re-audit" — acceptance per dimension
**Crawl / Index**
- No `/products` or `/products/<slug>` URL emits an es-US alt to `/es` (metadata + sitemap); hreflang validator = zero "no return tag"/"missing reciprocal" across the catalog.
- `/`↔`/es` + the 4 EN↔ES secondary pairs remain fully reciprocal.
- `sitemap.xml` `lastmod` stable across repeated fetches (not wall-clock) and differs per route group (pricing/product newest).
- Every indexable route retains `index,follow` + self-canonical; `/long-beach-stock` stays noindex + sitemap-excluded.
- `/es/pricing` facts match EN across the pair. `lang="en-US"`-on-`/es` remains a tracked deferral.

**Structured Data**
- `/pricing`: ItemList(1) + ListItem(3) + Product(3, each with price+priceCurrency) + BreadcrumbList(1) + FAQPage(1); zero Rich Results errors.
- BreadcrumbList on `/pricing`, `/products`, `/contact`, `/service-areas`, `/resources` (+ `/products/[slug]`).
- Priced products emit one AggregateOffer (lowPrice/highPrice/offerCount, USD) wrapping per-variant Offers, each with `itemCondition` + `url`; `priceValidUntil` omitted; `availability` MadeToOrder everywhere.
- Organization has a `contactPoint` (contactType "sales", availableLanguage ["en","es"]).
- `/es/pricing` carries ItemList + BreadcrumbList (+ FAQ) with no EN contradiction. FAQ Q&As have visible on-page parity.

**Titles / Meta / Intent**
- No title/og:title/twitter:title contains "Plycem" (case-insensitive).
- All 18 titles ≤60 incl. " | JARA", unique; all meta ≤155; none contain "this week".
- `/pricing` title has "Subfloor" + "Price"; subfloor product title has "Fiber-Cement" + "Subfloor".
- "JARA" appears once in `/contact` + `/es/contact` titles; `/es/pricing` states published DDP pricing.

**Internal Linking**
- `/pricing` has inbound links from header nav, footer, ≥1 homepage in-body anchor, all 7 product pages, and `/service-areas` — no longer an orphan.
- All 7 `/products` cards are anchors; hub-and-spoke bidirectional; footer includes `/pricing`, `/service-areas`, subfloor.

**GEO / AI Surfaces**
- `llms.txt` + `llms-full.txt` both carry a Pricing section; every price token = `PRICE_BY_SKU`; the 6 caveats appear verbatim.
- $ figures + caveats identical across `llms.txt`, `llms-full.txt`, `/api/llm-context`, `/pricing` HTML, Product JSON-LD.
- No "Fibroxton"/"lap siding"; cert-gap says "Five". Citation guidance authorizes citing published prices. ≥1 answer-first "How much does … cost? From $N …" on both text surfaces. Drift engineered away (generated route or CI check).

**Answer-First / Technical**
- `/pricing` first `<p>` after H1 = a cost answer with $ + $/SF; visible price FAQ with matching FAQPage; heading outline has no H3 before the first H2.
- The 3 priced product pages each expose a visible "from $X" + a price FAQ mirrored in schema; homepage surfaces a concrete price linking to `/pricing`.
- ≥ `/guides/fiber-cement-vs-plywood-subfloor` + `/guides/non-combustible-subfloor-cost` return 200 with query-matched H1 + first-paragraph answer, in the sitemap, internally linked (with canonical, robots, breadcrumb, OG, Article author/date).
- Only `hero-home.webp` preloaded; `/pricing` has its own OG image; product OG cards for the 3 priced show a "from $N" badge; no live claim of an expired IAPMO ER-360.

### Deferred (accepted risk, not open gaps)
- **`lang="en-US"` on `/es` pages** — correct fix is a route-groups refactor (`app/(en)` + `app/(es)`); do NOT add `await headers()` to the shared layout (forces the whole site dynamic, breaks SSG). Tracked deferral.
- **@graph consolidation** — cross-@id refs already resolve for Google; robustness-only for stricter parsers.
- **shippingDetails / returnPolicy on Offers** — model e-commerce checkout that doesn't exist for a made-to-order B2B importer; absence yields only non-critical Merchant warnings.

### Watch-outs while executing
- **Constraints hold:** Product JSON-LD `brand.name = "Plycem"` is factual manufacturer semantics — do NOT "fix" to JARA. The green Price-terms block must not be restyled.
- **Comparison copy (12/15/33):** only generic "leading US brand"; never a named competitor; never a Plycem-vs table. Add a grep gate over rendered HTML → zero competitor names, zero comparison-table markup.
- **Sequencing:** #11 must consume #6's single BreadcrumbList (avoid duplicate `@id`); guides (#15) must ship their own breadcrumb + nav + canonical + OG; the parity gate (#32) must run last and its surface list expanded first (see addition 5).
- **Acceptance tightening:** #30 contactPoint phone must equal the site CTA number; #41/#42 are deploy-gated (verify on staging, not localhost); #24 pricing/product `lastmod` must be the most recent group.

---

*Source: multi-agent audit workflow run 2026-07-09 (7 dimension agents + synthesis + adversarial critic; 836k tokens, 171 tool calls). Companion review artifact published separately.*
