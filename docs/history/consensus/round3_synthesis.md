# Round 3 — Synthesis (SEO + AI Tactical Maximization)

**Date:** 2026-05-10
**Type:** SEO + AI tactical decisions per user mandate ("en toda fase esto debe priorizarse")
**Voters captured:** Claude Opus 4.7, Gemini 3.1 Flash Lite, GLM-5.1, DeepSeek V4 Pro (4/4)
**Quorum rule:** ≥3/4 per item (R-CONS-7)
**Prompt:** [`round3_prompt.md`](round3_prompt.md)
**Vote files:** [`round3_claude.md`](round3_claude.md), [`round3_gemini.json`](round3_gemini.json), [`round3_glm.json`](round3_glm.json), [`round3_deepseek.json`](round3_deepseek.json)

---

## 1. Vote tally — STRONGEST ROUND OF PROJECT

| Item | Claude | Gemini | GLM | DeepSeek | Tally | Action |
|---|---|---|---|---|---|---|
| **SA** Schema depth | SA2 | SA3 | SA2 | SA2 | **SA2=3** | ✅ **LOCK SA2** (3/4) |
| **SB** AI crawler permissions | SB3 | SB3 | SB3 | SB3 | **SB3=4** | ✅ **LOCK SB3** (4/4) |
| **SC** Pillar pages | SC2 | SC2 | SC2 | SC2 | **SC2=4** | ✅ **LOCK SC2** (4/4) |
| **SD** Local SEO depth | SD2 | SD2 | SD2 | SD2 | **SD2=4** | ✅ **LOCK SD2** (4/4) |
| **SF** FAQ strategy | SF2 | SF2 | SF2 | SF2 | **SF2=4** | ✅ **LOCK SF2** (4/4) |
| **SH** Performance targets | SH2 | SH2 | SH2 | SH2 | **SH2=4** | ✅ **LOCK SH2** (4/4) |

**6/6 items locked. 5 unanimous, 1 at 3/4 quorum. Verdicts: 4/4 ship.**

This is the cleanest consensus round of the project.

---

## 2. Locked decisions — full SEO+AI playbook

### 🔒 ADR-014 — Schema.org depth: SA2 (intermediate)
- **Vote:** 3/4 (Claude/GLM/DeepSeek voted SA2; Gemini voted SA3 more aggressive)
- **Decision:** Implement these JSON-LD schemas:
  - `Organization` (root, all pages)
  - `LocalBusiness` (warehouse Long Beach)
  - `Product` (each product detail page) — with `sku`, `mpn`, `additionalProperty[]` for compliance ratings (per GLM convergent finding)
  - `FAQPage` (per-product + global)
  - `BreadcrumbList` (every page)
  - `Article` (resources hub + pillar page)
  - `ImageObject` (hero + product photos)
  - `Review` (placeholder, populated post-launch when reviews collected)
- **Rationale:** SA2 captures high-impact entity types Google + AI agents prioritize, without SA3's non-standard schemas (ManufacturerStatement, CertificationStatement) that Google ignores. Compliance data carried via `Product.additionalProperty[]` (per GLM finding) achieves SA3's intent through standard mechanisms.

### 🔒 ADR-015 — AI crawler permissions: SB3 (allow all + comprehensive llms.txt)
- **Vote:** 4/4 unanimous
- **Decision:** `robots.txt` allows ALL major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, YouBot, anthropic-ai, ChatGPT-User, etc.). Publish detailed `/llms.txt` + `/llms-full.txt` declaring attribution preferences and usage guidance.
- **Rationale:** Maximum corpus inclusion for LLM training → maximum future citation likelihood. IP control argument is weak for technical product specs Plycem already publishes publicly. Modern B2B sites doing this stand out in LLM training corpora.
- **Per-page meta robots (Claude addition):** `max-snippet:-1, max-image-preview:large, max-video-preview:-1` for richest Google rich-result eligibility.

### 🔒 ADR-016 — Pillar content at launch: SC2 (1 pillar page)
- **Vote:** 4/4 unanimous
- **Decision:** Single pillar page at launch — **"Non-Combustible Fiber Cement Subfloor: Complete Guide for Type I and II Construction (US, 2026)"** at `/resources/non-combustible-subfloor-guide` (or similar slug). 2000-3500 words. Internal-links to `/products/high-performance-subfloor`, `/resources` document library, and `/contact`.
- **Rationale:** Captures the highest-volume search intent for the day-1 product (subfloor) without SC3's 3-pillar content burden. The other 2 pillars (cladding, fire-code-compliance) ship with the Phase 4.5 product page batch in week 1+.

### 🔒 ADR-017 — Local SEO depth: SD2 (warehouse schema + service-areas page)
- **Vote:** 4/4 unanimous
- **Decision:** `LocalBusiness` JSON-LD for Long Beach warehouse (address, phone, hours, geo coordinates) PLUS dedicated `/service-areas` page listing California cities + radius served (Long Beach, Los Angeles, Orange County, San Diego, Inland Empire, Bay Area, Sacramento, Central Valley, Phoenix metro for AZ extension, Las Vegas metro for NV).
- **Rationale:** One extra page captures "fiber cement supplier near me"–style searches across CA without SD3's 5-state-page production burden. Surfaces JARA's key competitive differentiator (in-stock + 0-3 day delivery from Long Beach).

### 🔒 ADR-018 — FAQ strategy: SF2 (per-product + global FAQs)
- **Vote:** 4/4 unanimous
- **Decision:** Each product detail page has 3-5 product-specific FAQs with `FAQPage` JSON-LD schema. `/resources` retains 8 reusable global FAQs (per Phase 0.5 audit) with separate `FAQPage` schema. Total: ~38 FAQ items across the site at launch (8 global + 30 per-product when all 6 products ship).
- **Rationale:** FAQ Q&A pairs are the highest-leverage AI citation atomic units. LLMs disproportionately favor extractable Q&A. Doubles the AI citation surface area vs. SF1.
- **Phase 6+ (deferred):** SF3 dynamic FAQ pipeline (extract common quote-request questions over time).

### 🔒 ADR-019 — Performance targets: SH2 (excellent CWV)
- **Vote:** 4/4 unanimous
- **Decision:** Core Web Vitals targets — **LCP < 1.5s, INP < 100ms, CLS < 0.05** on mobile + desktop.
- **Rationale:** SH2 directly improves both Google ranking and AI bot crawl efficiency. Achievable with Next.js 16 + Cloudflare Pages + AVIF images + next/font + careful component design. SH3 (Lighthouse 100 across 4 categories) is 3-5x effort for diminishing returns.
- **Implementation hooks:** Use Cloudflare Web Analytics' RUM (already locked Phase 2) to monitor field CWV. Set up performance budgets in CI to prevent regression.

---

## 3. Convergent additional findings (≥2 voters → APPLY)

### F1.R3 — hreflang for /es bilingual setup (4/4 — STRONGEST CONVERGENT FINDING IN PROJECT)
- **Detail:** All 4 voters independently flagged this. The H3 lock (EN full + 1 ES landing) requires hreflang declarations. Without them, Google may show ES page to EN searchers or vice versa, AND can flag duplicate content.
- **Implementation:** In every page's `<head>`:
  ```html
  <link rel="alternate" hreflang="en-US" href="https://jarainternational.com/{path}" />
  <link rel="alternate" hreflang="es-US" href="https://jarainternational.com/es{path-or-empty}" />
  <link rel="alternate" hreflang="x-default" href="https://jarainternational.com/{path}" />
  ```
- **Status:** ⚠️ Applied as **Phase 4 implementation requirement** — every page generates these via Next.js `generateMetadata`. Critical, not optional.

### F2.R3 — XML sitemap.xml at launch (Claude + GLM + DeepSeek = 3/4)
- **Detail:** Generate `/sitemap.xml` at build time. Include all 6 launch pages + pillar + service-areas (8 URLs total). Include `<image:image>` entries for product photos (DeepSeek finding) and `<lastmod>` per page. Submit to Google Search Console + Bing Webmaster Tools day 1.
- **Status:** ⚠️ Applied as Phase 4 implementation requirement.

### F3.R3 — llms.txt content conventions (Claude + GLM + DeepSeek = 3/4)
- **Detail:** Beyond just "have an llms.txt", the structure matters. Recommended `/llms.txt` content:
  1. Project name + 1-2 sentence company description
  2. Sectioned URL list grouped by topic (Products, Resources, Compliance, Contact)
  3. Each URL with 1-sentence description
  4. Compliance certifications matrix (UL R15140, IAPMO ER-360, ASTM E84, etc.)
  5. Warehouse location + delivery radius
  6. Explicit citation/usage preference statement
  7. Link to `/api/llm-context` endpoint for machine clients

  `/llms-full.txt` = full markdown form of all page content, generated at build time from same source as HTML.
- **Status:** ⚠️ Applied as Phase 4 implementation requirement.

### F4.R3 — JSON-LD entity linking with @id + additionalProperty for compliance (DeepSeek + GLM = 2/4)
- **Detail:** Assign `@id` to Organization, LocalBusiness, Product, and FAQPage entities. Cross-reference via `mainEntity`, `manufacturer`, `subjectOf`. Use `Product.additionalProperty[]` for compliance ratings (E84 Class A, UL R15140, IAPMO ER-360, CBC Type I/II) — Schema.org-valid mechanism that AI agents parse.
- **Status:** ⚠️ Applied — refines ADR-014 SA2 implementation.

### F5.R3 — /api/llm-context payload structure defined now (GLM + Gemini = 2/4)
- **Detail:** D2-locked endpoint `/api/llm-context` should return structured JSON: company info, product array (name, sku, mpn, fireRating, certifications, applications), service area, contact, current Long Beach inventory status (Gemini specific). This becomes the machine-readable single source of truth for AI agents.
- **Status:** ⚠️ Applied as Phase 4 implementation requirement.

---

## 4. Single-voter findings — ALL APPLIED (per user SEO+AI mandate)

Per user's explicit mandate that SEO/AI is top priority, single-voter findings on basic SEO hygiene are NOT deferred — they're applied as cheap-but-essential implementation requirements.

| Finding | Voter | Severity | Phase | Applied as |
|---|---|---|---|---|
| E-E-A-T signals (published date, author, last updated, Organization credentials) | Claude | High | 4 | Every pillar/resource page includes published+modified dates, author attribution (Robertson Carrillo + role), Organization JSON-LD with foundedDate + business credentials |
| Product code searches (`PLYCEM 960140`, `subfloor panel 972254`) as specifier high-intent | Claude | High | 4 | Each product page includes ALL SKU codes prominently in body + JSON-LD `sku`/`mpn`. Title pattern: `Product Name (Code 960140) \| Specs & Datasheet \| JARA International` |
| Internal linking cadence per pillar+product cluster | Claude | Medium | 4 | Pillar page links to product page + resources + contact with descriptive anchor text. Reverse links from product page back to pillar. ~30 min implementation |
| Schema validation as CI gate | Claude | Medium | 4 | Add CI step using Google Rich Results Test API or schema.org validator. Fails build on invalid JSON-LD |
| Self-referencing canonical tags on every page | GLM | High | 4 | `<link rel="canonical" href="https://jarainternational.com/{path}">` in every page head via Next.js generateMetadata |
| Open Graph + Twitter Card meta (Perplexity, Bing parse these) | GLM | Medium | 4 | og:title, og:description, og:image, og:url, og:type, twitter:card, twitter:title, twitter:description, twitter:image on every page |

---

## 5. Token + cost summary

| Voter | Prompt tokens | Completion tokens | Cost (USD) |
|---|---|---|---|
| Gemini 3.1 Flash Lite | 2,453 | 507 | $0.0014 |
| DeepSeek V4 Pro | 2,344 | 2,667 | $0.0033 |
| GLM-5.1 | 2,324 | 3,383 | $0.0180 |
| Claude Opus 4.7 (manual) | (in-session) | (in-session) | ~$0.05 est. |
| **Total Round 3** | — | — | **~$0.07** |
| **Phase 1+2+3 cumulative** | — | — | **~$0.31** |

---

## 6. Verdict — PHASE 3 COMPLETE

✅ **Round 3 status: COMPLETE — 6/6 items locked.**
✅ **Phase 3 (SEO+AI tactical) COMPLETE.**

**Project locks to date: 19 of 19 ballot items.** Plus ~25 implementation requirements derived from convergent + single-voter findings (every one applied per user SEO+AI mandate).

**Phase 4 SEO+AI Sprint Checklist** (must be applied to every Phase 4 sprint deliverable):

✅ Pre-flight (every page):
- [ ] hreflang tags (en-US + es-US + x-default)
- [ ] Self-referencing canonical
- [ ] Open Graph + Twitter Card meta
- [ ] `<meta name="robots" content="max-snippet:-1, max-image-preview:large, max-video-preview:-1">`
- [ ] Page in sitemap.xml
- [ ] WCAG AA contrast verified
- [ ] LCP <1.5s, INP <100ms, CLS <0.05 (CI test)

✅ Schema (per page type):
- [ ] BreadcrumbList on every page
- [ ] Organization on every page (root)
- [ ] LocalBusiness on home + contact + service-areas
- [ ] Product + sku + mpn + additionalProperty (compliance) on each product detail
- [ ] FAQPage on /resources + each product detail
- [ ] Article on /resources + pillar page
- [ ] ImageObject on hero photos
- [ ] @id linking + cross-references

✅ AI artifacts (project-level):
- [ ] /llms.txt (structured per F3.R3 conventions)
- [ ] /llms-full.txt (build-time generated)
- [ ] /api/llm-context (per F5.R3 payload structure)
- [ ] robots.txt allows all AI crawlers
- [ ] /sitemap.xml with image entries

✅ Content (E-E-A-T):
- [ ] Author byline on pillar + resources content
- [ ] Published + modified dates visible
- [ ] Organization credentials (foundedDate, industry associations)
- [ ] Product codes prominently in body + title pattern

✅ CI gates:
- [ ] Schema validation passes (Rich Results Test)
- [ ] Calculator no-currency assertion
- [ ] No Plycem ship blocker violations
- [ ] Performance budget within SH2 thresholds

**Next: Phase 4 Sprint 1 — project scaffold + Cloudflare Pages smoke test (Phase 1 constraint C5) + first SEO+AI checklist application.**
