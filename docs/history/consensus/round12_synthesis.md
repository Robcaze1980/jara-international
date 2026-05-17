# Round 12 — Synthesis: Independent SEO + AI-Friendliness + Cloudflare Infra Audit

**Round date:** 2026-05-17
**Round shape:** Independent comprehensive audit (each voter audited alone; consensus = overlap across 4 independent audits)
**Voters:** 4 — Codex / DeepSeek / Gemini / GLM (Claude NOT a voter from R12+ per CLAUDE.md governance)
**Quorum:** ≥3/4 simple majority per finding
**Round cost:** **$0.168** (Codex $0.049 + GLM $0.088 + DeepSeek $0.027 + Gemini $0.004)
**Total findings across 4 voters:** 36 raw → deduped to 19 unique
**Voter findings counts:** Codex 8 / DeepSeek 7 / Gemini 4 / GLM 17

> Note: Both Codex and DeepSeek mis-identified themselves as "Gemini" or "Codex" in their `voter` field — this is a known artifact of including model names in the prompt and is benign. The `model` field in the OpenRouter response wrapper is ground truth.

---

## 1. Convergence summary

| Severity | 4/4 unanimous | 3/4 strong | 2/4 split | 1/4 single |
|---|---|---|---|---|
| Critical | 0 | **1** | 0 | 0 |
| High | **3** | 0 | 1 | 2 |
| Medium | 0 | 0 | 4 | 7 |
| Low | 0 | 0 | 1 | 1 |
| **Total** | **3** | **1** | **6** | **10** |

---

## 2. 3/4 strong-majority — CRITICAL (ship immediately)

### R12-C1 · SB-5 contractual violation: "PLYCEM" appears in every audited `<title>` tag

**Voters who flagged:** Codex, DeepSeek, GLM (3/4) — **Gemini missed this entirely**
**Severity:** Critical (contractual ship blocker SB-5)
**Dimension:** technical_seo / onpage_seo

**Evidence (live curl, §4.3 of prompt):**
- Homepage: `<title>PLYCEM Non-Combustible Subfloor — Multifamily & Commercial USA</title>`
- Product page: `<title>High Performance Subfloor — PLYCEM Fiber-Cement Panel | JARA International Inc.</title>`
- Spanish page: `<title>JARA International Inc. — PLYCEM Entrepiso Alto Desempeño Subfloor en EE.UU. | JARA International Inc.</title>`

Code roots (§4.5–§4.8):
- [app/page.tsx:31](app/page.tsx) — `title: 'PLYCEM Non-Combustible Subfloor — Multifamily & Commercial USA'`
- [app/products/[slug]/page.tsx:60](app/products/[slug]/page.tsx:60) — `title: '${product.name} — PLYCEM Fiber-Cement Panel'` (propagates across all 9 product pages)
- [app/es/page.tsx:19](app/es/page.tsx:19) — `title: '${SITE.name} — PLYCEM Entrepiso Alto Desempeño Subfloor en EE.UU.'`

**Fix (consensus):**
1. `app/page.tsx`: change title to `'Non-Combustible Fiber-Cement Subfloor — Multifamily & Commercial USA'` (also set as `{ absolute: '...' }` per R12-S2 below to restore brand suffix)
2. `app/products/[slug]/page.tsx`: change title template (line 60), `openGraph.title` (line 76), and `twitter.title` (line 85) from `'${product.name} — PLYCEM Fiber-Cement Panel'` → `'${product.name} — Fiber-Cement Panel'`
3. `app/es/page.tsx`: change title to `'Entrepiso Alto Desempeño — Subfloor en EE.UU.'` (also removes the duplicate-brand issue R12-S4)
4. Grep `app/**/*.tsx` for any remaining `'PLYCEM'` strings inside `title:` keys to catch leftovers

**Ship blocker impact:** SB-5 — contractual obligation to Plycem. Must ship before any further marketing.

---

## 3. 4/4 unanimous — HIGH (ship next)

### R12-U1 · Sitemap is a stub — only homepage listed, 20+ routes missing

**Voters:** Codex, DeepSeek, Gemini, GLM (4/4)
**Severity:** High
**Dimension:** technical_seo

**Evidence (§4.12):** [public/sitemap.xml](public/sitemap.xml) contains only the homepage URL. The comment acknowledges "Sprint 2+: regenerate at build time" but the dynamic sitemap was never built. [app/sitemap.ts](app/sitemap.ts) does not exist.

**Missing from sitemap:** `/contact`, `/pricing`, `/products`, 9 `/products/:slug` pages, `/resources`, `/service-areas`, `/es`, `/es/contact`, `/es/pricing`, `/es/resources`, `/es/service-areas`.

**Fix (consensus):**
- Create `app/sitemap.ts` using Next.js `MetadataRoute.Sitemap`:
  - Iterate all static routes + all `PRODUCTS` slugs
  - Include `lastmod` (from data source if available, else build date)
  - Include `xhtml:link` hreflang alternates for all EN/ES pairs (note: hreflang alternates on product pages should point `es-US` → `/es` marketing root per Round 8 §4 disposition, NOT to nonexistent per-slug Spanish routes)
  - Include `image:image` entries for product pages once images exist
- Delete `public/sitemap.xml` stub
- Verify in Google Search Console after deploy

**Why unanimous:** The omission is undisputable — every voter recognized the stub. Highest-confidence finding of the round.

---

### R12-U2 · `llms.txt` is stale — lists 6 products, catalog has 9

**Voters:** Codex, DeepSeek, Gemini, GLM (4/4)
**Severity:** High (downgraded from "medium" per voter consensus; severity bumped to high here because R11 added 2 of the missing products with cert-gap warnings AI must see for accuracy)
**Dimension:** ai_friendliness

**Evidence (§4.13):** [public/llms.txt](public/llms.txt) Products section lists 6 products. The 3 added in Round 11 (`deck-modular`, `lap-siding-tongue-and-groove`, `corrugated-roof-tile`) are missing — including the 2 products with cert-gap warnings.

**Fix (consensus):**
- **Short-term (this round):** Update [public/llms.txt](public/llms.txt) to include all 9 products with slugs, compliance status, and cert-gap warnings. Particularly important to surface the Lap Siding "no ICC-ES ESR" and Corrugated Roof Tile "no UL Class A" gaps to LLMs — omitting them means AI-generated answers may misrepresent these products as fully certified.
- **Longer-term:** Generate `llms.txt` dynamically from `data/products.ts` at build time (move to `app/llms.txt/route.ts` mirroring [app/llms-full.txt/route.ts](app/llms-full.txt/route.ts)) — single source of truth, no future drift.

**Why unanimous:** Stated fact in the artifacts (`§4.13` note explicitly called out the mismatch). Trivially verifiable; trivially fixable.

---

### R12-U3 · Cloudflare edge is not caching HTML — persistent `x-nextjs-cache: MISS`

**Voters:** Codex, DeepSeek, Gemini, GLM (4/4)
**Severity:** High
**Dimension:** performance / infra

**Evidence (§4.2 + §4.15):**
- Every HTML route returns `x-nextjs-cache: MISS` with no `CF-Cache-Status` header
- `Cache-Control: s-maxage=31536000` is set but ignored at the CDN layer because Worker-generated responses bypass Cloudflare's HTTP cache
- [open-next.config.ts](open-next.config.ts) is `defineCloudflareConfig({})` — no R2 incremental cache backend
- Active deployment median CPU: 100.75 ms (vs 7-day median 54 ms) — symptom of regenerating prerendered output on every request

**Fix (consensus):**
1. In [open-next.config.ts](open-next.config.ts), configure R2 as incremental cache backend. The OpenNext-on-Cloudflare docs (https://opennext.js.org/cloudflare) document the exact binding pattern. Add the R2 binding in [wrangler.toml](wrangler.toml).
2. In the Worker entry, use the Cache API to explicitly `cache.put()` prerendered HTML responses at the edge (Cloudflare Workers do NOT auto-cache responses — this must be explicit).
3. **Reduce `s-maxage` from 31536000 to 86400 with `stale-while-revalidate=604800`** (1 day fresh, 1 week stale). The 1-year value is risky if a deploy purge fails. (GLM raised this as a separate medium finding R12-S6; rolled in here.)
4. Consider stripping RSC-specific `Vary` headers (`rsc, next-router-state-tree, ...`) for non-RSC user-agent requests to avoid cache-key fragmentation.

**Why unanimous:** Headers were in the artifacts; every voter recognized the cache miss. Solution is well-documented OpenNext pattern.

---

## 4. 2/4 split — escalate to founder

These were surfaced by 2 of 4 voters. Apply at founder's discretion. Not auto-applied because quorum failed.

### R12-S1 · Product JSON-LD missing required `image` field

**Voters:** Codex, GLM (2/4)
**Severity:** High (both voters agreed)
**Dimension:** schema

**Evidence (§4.9):** `productSchema()` in [lib/jsonld.ts](lib/jsonld.ts) does not include an `image` field. Google's Product rich result documentation requires at least one image. All 9 Product schemas on the homepage + 1 per product detail page fail rich-result eligibility.

**Why split:** DeepSeek flagged Organization missing logo (different schema type) but didn't catch the Product issue. Gemini missed both.

**Recommendation:** **Ship.** This is the kind of finding where 2 voters with strong evidence outweigh 2 silent voters. Google Search Console will flag this as a Product structured-data error.

**Fix:** Add `image` field to `productSchema()` in [lib/jsonld.ts](lib/jsonld.ts). Product data needs an `images: string[]` field. Until product images exist (Phase 6 backlog), use placeholder or `/images/og/og-default.png` (after R12-S3 SVG→PNG conversion).

---

### R12-S2 · Organization schema missing `logo`, `sameAs`, full address

**Voters:** DeepSeek, GLM (2/4)
**Severity:** Medium (GLM) / Low (DeepSeek) → use higher = Medium per runbook
**Dimension:** schema

**Evidence (§4.9 + §4.10):** `organizationSchema()` has no `logo`, no `sameAs`. Address is only `{ addressCountry: 'US' }`. `SITE.social.linkedin` and `SITE.social.youtube` are empty TODOs.

**Recommendation:** **Ship partial.** Add `logo` immediately (logo asset exists per brand guideline). Defer `sameAs` until social channels go live (Phase 6 backlog). Skip expanded address — JARA has no public physical address (ADR-049 lock).

**Fix:**
- `lib/jsonld.ts:organizationSchema()`: add `logo: \`${SITE.url}/images/logo.png\`` (verify asset path)
- Add `sameAs: [SITE.social.linkedin, SITE.social.youtube].filter(Boolean)` — array will be empty until socials populated, which is acceptable schema
- **Do not** add `addressLocality` / `addressRegion` — JARA's address is intentionally `country-only` per ADR-049 (no US warehouse, no physical site)

---

### R12-S3 · OG image is SVG — social platforms won't render it

**Voters:** GLM (single voter, but evidence is verifiable and high-impact)
**Severity:** High (GLM)
**Dimension:** onpage_seo

**Evidence (§4.5):** [app/layout.tsx:68](app/layout.tsx:68) sets `openGraph.images` to `/images/og/og-default.svg`. [app/es/page.tsx:47](app/es/page.tsx:47) references the same SVG. Facebook, Twitter/X, and LinkedIn require raster formats (PNG/JPG) for OG images.

**Why single-voter:** Other voters didn't pattern-match on SVG-not-renderable issue. Evidence is irrefutable — the file extension is in the artifact.

**Recommendation:** **Ship.** Single-voter but high-evidence and high-impact. Every social share is currently producing a broken preview.

**Fix:**
1. Convert `/public/images/og/og-default.svg` → `/public/images/og/og-default.png` (1200×630). Keep the SVG as source artwork if useful.
2. Update OG `url` references in [app/layout.tsx](app/layout.tsx) and [app/es/page.tsx](app/es/page.tsx) to `.png`
3. Per-product OG images already exist via [app/products/[slug]/opengraph-image.tsx](app/products/[slug]/opengraph-image.tsx) (per CLAUDE.md) — verify these are PNG/raster, not SVG

---

### R12-S4 · `/es` page title has duplicate "JARA International Inc."

**Voters:** GLM (single voter, but verifiable from artifact §4.3)
**Severity:** Medium
**Dimension:** onpage_seo

**Evidence:** Live `<title>` is `JARA International Inc. — PLYCEM Entrepiso Alto Desempeño Subfloor en EE.UU. | JARA International Inc.` — the custom title in [app/es/page.tsx:19](app/es/page.tsx:19) starts with `${SITE.name} —` AND the root layout template appends `| ${SITE.name}`.

**Recommendation:** **Ship — combined with R12-C1 fix.** Single voter but the duplicate is visible in the curl output. Fix is to remove the leading `${SITE.name} —` from the manual title in `app/es/page.tsx:19`; the template will add the brand on the right side.

**Fix:** In [app/es/page.tsx:19](app/es/page.tsx:19), change title from:
```ts
title: `${SITE.name} — PLYCEM Entrepiso Alto Desempeño Subfloor en EE.UU.`,
```
to:
```ts
title: 'Entrepiso Alto Desempeño — Subfloor en EE.UU.',
```
Resolved title becomes: `Entrepiso Alto Desempeño — Subfloor en EE.UU. | JARA International Inc.` (one brand, no PLYCEM, fixes both R12-C1 and R12-S4 for /es).

---

### R12-S5 · `/es/*` subpages likely have `<html lang="en-US">` (wrong language attribute)

**Voters:** GLM (single voter, structurally inferred from artifact §4.4)
**Severity:** High (WCAG + SEO impact)
**Dimension:** technical_seo

**Evidence:** Route map shows [app/es/page.tsx](app/es/page.tsx), [app/es/contact/page.tsx](app/es/contact/page.tsx), etc. — but **no `app/es/layout.tsx`**. Root [app/layout.tsx:107](app/layout.tsx:107) sets `<html lang="en-US">`. Without an `/es` layout override, all Spanish pages inherit `lang="en-US"`.

**Why single-voter:** GLM is the only voter that connected the missing `/es/layout.tsx` (not in route map) to the inherited root layout.

**Recommendation:** **Ship.** Verify first by curling the rendered HTML — if `<html lang="en-US">` is indeed served on `/es`, ship the fix. WCAG screen-reader pronunciation + Google hreflang/lang conflict.

**Fix:**
- **Option A (preferred):** Create [app/es/layout.tsx](app/es/layout.tsx) that re-renders the html element with `lang="es-US"`. Caveat: Next.js App Router only allows one root `<html>` tag — overriding lang per nested layout requires the root layout to read the route segment, OR using a route group `app/(es)/es/layout.tsx`. Test carefully.
- **Option B (simpler):** Move the language attribute into a dynamic var in the root layout that reads the pathname (server component) and emits `lang="es-US"` for `/es*` routes.

---

### R12-S6 · `s-maxage=31536000` (1 year) too aggressive for HTML

**Voters:** GLM (raised separately, but conceptually part of R12-U3 cache fix)
**Severity:** Medium

Rolled into R12-U3 fix step #3.

---

### R12-S7 · `wrangler.toml` routes + Smart Placement commented out

**Voters:** Codex, GLM (2/4)
**Severity:** Medium
**Dimension:** infra

**Evidence (§4.16):** Routes array and `[placement] mode = "smart"` are commented out. Domain binding is configured via Cloudflare dashboard.

**Recommendation:** **Founder decision.** Two angles:
1. **IaC resilience:** Uncomment routes to bring domain binding under version control. Risk: may conflict with existing dashboard config; needs a careful one-time migration.
2. **Smart Placement:** With 0 outbound subrequests (§4.1), placement near users (not near data sources) is optimal — Smart Placement may help. But traffic is currently mostly crawlers; impact is marginal.

**Suggested action:** Schedule a 30-min maintenance window to migrate domain binding from dashboard → wrangler.toml. Defer Smart Placement until real US traffic exists to measure impact.

---

## 5. 1/4 single-voter additional findings — info only

These were each surfaced by only one voter. Surface for awareness; not auto-applied unless the evidence is independently verifiable (see notes).

| # | Voter | Severity | Title | Verifiable? | Recommendation |
|---|---|---|---|---|---|
| A1 | Codex | Medium | Secondary pages fall back to generic title template | Yes (§4.5 template + §4.4 routes) | Audit `/contact`, `/pricing`, `/resources`, `/service-areas` titles; if generic, add page-specific titles |
| A2 | DeepSeek | Medium | Product `Offer.areaServed` not a valid schema.org property of Offer | Maybe — needs schema.org doc check | Verify against schema.org/Offer; if invalid, move `areaServed` to Product level |
| A3 | Gemini | Medium | Potential @id collision in JSON-LD | No — JSON-LD `@id`s appear collision-safe per `lib/jsonld.ts` | Not actionable as-stated; existing `@id` strategy looks correct |
| A4 | DeepSeek | Low | llms.txt phone is secondary, not primary (Anna AI) | Yes (§4.10 vs §4.13) | Fix as part of R12-U2 llms.txt rewrite — use `phonePrimary` |
| A5 | GLM | Medium | Homepage meta description ~350 chars (will truncate) | Yes (§4.6) | Rewrite to ≤155 chars; remove "PLYCEM" (SB-2 alignment) |
| A6 | GLM | Medium | Homepage description mentions only Costa Rica, not all 3 countries | Yes (§4.6 vs §4.13) | Match llms.txt — "Costa Rica, El Salvador, and Honduras" |
| A7 | GLM | Medium | Homepage title missing brand "&#124; JARA" suffix despite template | Yes (live `<title>` shows no suffix) | Use `title: { absolute: '...' }` form to explicitly include brand. Investigate why template isn't applying. |
| A8 | GLM | Low | `SearchAction` target URL has no search functionality | Yes (§4.9) | Either implement `/products?q=` search (Phase 6 backlog) OR remove `potentialAction` from `webSiteSchema()` until ready |
| A9 | GLM | Low | `compatibility_date` outdated (2025-12-01, ~6 months stale) | Yes (§4.16) | Update to `2026-05-01`; review Workers changelog for breaking changes |
| A10 | DeepSeek | Open | 7 additional open questions about per-page canonicals, alt text, etc. | N/A | Rolled into §7 below |

**Of these, A1, A4, A5, A6, A7 are trivially verifiable from artifacts and cheap to fix — recommend bundling into the R12 application commit as polish.** A2 (Offer.areaServed) needs a schema.org doc check; A3 appears to be a false positive; A8/A9 are low-priority cleanup.

---

## 6. Strengths (deduped across voters)

The four voters agreed on what the site is doing well:

1. **Hreflang implementation** is consistent and correct across en-US, es-US, and x-default (all 4 voters mentioned)
2. **AI-friendliness stack** is best-in-class — robots.txt explicit AI-crawler allowlist, llms.txt, llms-full.txt with proper caching, /api/llm-context machine endpoint (3 voters)
3. **SB-4 + R11-G2 compliance** is correct — no price/priceCurrency in Product schema, availability = MadeToOrder (3 voters)
4. **Image format optimization** — AVIF/WebP enabled, next/font/google with display: swap, trimmed Montserrat weights (3 voters)
5. **Cert-gap warnings** preserved as locked from Round 11 — honest compliance positioning builds B2B trust (2 voters)
6. **JSON-LD @id strategy** generally collision-safe via canonical URL + suffix (2 voters, contradicts Gemini A3)
7. **Robots.txt** comprehensive AI-bot allowlist (2 voters)

---

## 7. Open questions (deduped, ranked by voters who raised)

These were flagged across multiple voters' `open_questions` arrays — worth answering before or during the application phase.

| # | Question | Voters | Action |
|---|---|---|---|
| Q1 | Do `/contact`, `/pricing`, `/resources`, `/service-areas` set per-page `alternates.canonical`? If not, they all inherit the root canonical (= homepage), creating duplicate-content signals. | DeepSeek + GLM (2) | Audit during R12 application — should be quick |
| Q2 | Does `app/es/layout.tsx` exist? Layout files may not appear in standard route maps. | DeepSeek + GLM (2) | Resolved via R12-S5 verification (curl the rendered HTML) |
| Q3 | What alt text is used on hero/product/component images? | Codex + DeepSeek + GLM (3) | Code-level audit — not verifiable from this round's artifacts; consider for R13 |
| Q4 | Does `/api/llm-context` return all 9 products or is it also stale like llms.txt? | DeepSeek + GLM (2) | Verify during R12-U2 application; should be dynamic per route source |
| Q5 | What does `/not-found.tsx` render? Proper 404 status, helpful navigation, meta tags? | DeepSeek + GLM (2) | Quick check |
| Q6 | What are the 9 errors observed over 7 days (§4.1)? Error rate is 0% on active deployment but root cause unknown. | DeepSeek + Gemini + GLM (3) | Cloudflare Observability tab → filter status 5xx |
| Q7 | Do `/es/contact`, `/es/pricing`, etc. have Spanish-language metadata? | DeepSeek + GLM (2) | Audit during R12-S5 |
| Q8 | H1/heading hierarchy across pages — not verifiable from artifacts | GLM (1) | Defer to R13 with component-level artifacts |
| Q9 | Is `x-nextjs-stale-time: 300` value intentional for production? | Gemini (1) | Resolved via R12-U3 — fix the cache strategy holistically |

---

## 8. Voter errors / lock conflicts

None. All four voters respected the locked constraints in §2 of the prompt (ADR-049 warehouse lock, SB-1..SB-9, subfloor-as-hero strategy, MadeToOrder schema, cert-gap warnings).

GLM's recommendation in F12 to expand `Organization.address` with city/state was rejected at synthesis time because JARA intentionally has no public address (ADR-049). Documented in R12-S2 fix.

---

## 9. Action plan — concrete TODO list (shippable order)

Ordered for one commit (or one small series), high-impact first:

### Phase A — Contractual fixes (must ship before any further marketing)
- [ ] **R12-C1**: Remove "PLYCEM" from all `<title>` tags
  - `app/page.tsx:31` (use `title: { absolute: '...' }` to also fix A7 brand suffix)
  - `app/products/[slug]/page.tsx:60,76,85` (title, openGraph.title, twitter.title)
  - `app/es/page.tsx:19` (also resolves R12-S4 duplicate brand)
  - Final grep: `grep -rn "PLYCEM" app/ | grep -i title`

### Phase B — High-impact unanimous fixes
- [ ] **R12-U1**: Create `app/sitemap.ts` (dynamic, all routes, hreflang alternates), delete `public/sitemap.xml`
- [ ] **R12-U2**: Update `public/llms.txt` to include all 9 products + cert-gap warnings; fix phone to `phonePrimary` (A4); add TODO to make dynamic in future
- [ ] **R12-U3**: Enable R2 incremental cache in `open-next.config.ts` + `wrangler.toml`; reduce `s-maxage` to `86400, stale-while-revalidate=604800` (resolves R12-S6 too)

### Phase C — High-evidence single-voter fixes (verifiable, ship-worthy)
- [ ] **R12-S3**: Convert OG default SVG → PNG; update references in `app/layout.tsx` + `app/es/page.tsx`
- [ ] **R12-S5**: Fix `/es` `<html lang>` to `es-US` (verify first with curl, then implement via new `/es/layout.tsx` or dynamic root layout)
- [ ] **R12-S1**: Add `image` field to `productSchema()` in `lib/jsonld.ts`

### Phase D — Polish (additional findings, cheap to ship together)
- [ ] **A5**: Rewrite homepage meta description to ≤155 chars
- [ ] **A6**: Update homepage description to include all 3 manufacturing countries
- [ ] **A1**: Audit `/contact`, `/pricing`, `/resources`, `/service-areas` per-page titles & canonicals (resolves Q1)
- [ ] **R12-S2** (partial): Add `logo` to `organizationSchema()`; skip address expansion (ADR-049)
- [ ] **A2**: Verify `Offer.areaServed` is valid schema.org; move to Product level if not

### Phase E — Optional / deferred
- [ ] **R12-S7**: Migrate wrangler routes from dashboard → wrangler.toml (founder decision, schedule maintenance window)
- [ ] **A9**: Update `compatibility_date` to `2026-05-01`
- [ ] **A8**: Decide on SearchAction — implement `/products?q=` search or remove from `webSiteSchema()`
- [ ] **Q6**: Investigate the 9 errors in Cloudflare Observability

---

## 10. Cost / process notes (for the apply phase)

**Round cost:** $0.168 (within 6% of R11's $0.178). Cost savings target from dropping Claude (~$0.13/round) was offset by GLM running notably hot (17 findings, $0.088). Net cost still in line with R11 baseline.

**Voter quality observations:**
- **GLM-5.1** was the highest-recall voter (17 findings) and surfaced 5 unique high-evidence findings (R12-S3, R12-S4, R12-S5, A5, A6, A7) that no other voter caught. Worth keeping in the pool for thoroughness.
- **Codex** caught the critical SB-5 violation that **Gemini missed**, despite Gemini also having access to the same `<title>` artifacts in §4.3. This vindicates the 4-voter quorum: a single voter (especially a faster/cheaper one) can have systematic blind spots on contractual constraints.
- **DeepSeek** was the only voter to flag the schema.org Offer.areaServed validity question (A2) — narrow expertise win.
- **Gemini** flagged the fewest findings (4) but no false positives.

**Operational notes:**
- GLM returned wrapped in ```json fences once and failed JSON parsing once (require retry). Synthesis parser was patched to strip fences. Recommend tightening voter prompt to "return raw JSON only, no markdown fences" for future rounds.
- All 4 voters self-reported the wrong `voter` field (copying example text from prompt). Synthesis layer uses the `model` field in the OpenRouter wrapper as ground truth. Future prompts should drop the literal `"voter": "<your model name>"` example.

---

**Status:** Ready for apply phase. Recommend a fresh session to apply Phase A + Phase B + Phase C in one commit with subject `feat(round12): apply consensus — SB-5 fix, dynamic sitemap, R2 cache, OG PNG, /es lang, llms.txt sync`.
