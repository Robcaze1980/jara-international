# Legacy v0 Site — Full Audit Dossier (Phase 0.5 deep pass, for Round 10)

**Date:** 2026-05-14
**Author:** Claude Opus 4.7 (1M context)
**Subject:** `plycemca.com - previuos website built with v0.com/Web/v0 version/`
**Purpose:** Pre-Round 10 evidence package. The Phase 0.5 summary in `MASTER_AUDIT.md` §6 catalogued 35 Plycem-compliance violations at a high level but did not write file-by-file findings to `docs/audit/`. This dossier closes that gap and frames the inputs Round 10 voters will grade.
**Method:** Read every page, every custom component, every API route, plus tailwind/next config and globals. Cross-referenced against the 31 locked ADRs (`MASTER_AUDIT.md` §7) and the 9 ship-blockers (`MASTER_AUDIT.md` §5).

> **Reading mode for voters.** Sections 2–4 are *neutral evidence* (what v0 did, with file:line refs). Section 5 grades v0 along the four axes the user named (Design / SEO / AI / Reference). Section 6 is the **Round 10 ballot input** — every item where the new site has a gap, redundancy, or open question relative to v0. Sections 7–8 are constraints + appendix.

---

## 0. TL;DR for the impatient voter

The v0 site is a **single-product, manufacturer-branded technical brochure** with strong B2B substance (CSI spec, IBC sections, UL designs, ASTM standards, tiered pricing, multi-step submittal form) and weak SEO/AI surface (no JSON-LD, no llms.txt, no sitemap/robots, no canonical, no hreflang).

The new jara-website (31 ADRs, 3 sprints shipped) **inverts this**: multi-product JARA-branded catalog, zero pricing surface, comprehensive AI/SEO layer (JSON-LD trio per page, llms.txt + llms-full.txt + `/api/llm-context`, allow-all crawler robots), but **has not yet replicated v0's deepest technical authority content** — and never will, in some cases, because Plycem ship-blockers SB-3 / SB-4 / SB-5 forbid it without written approval.

**Three classes of finding:**

1. **KEEP-AND-PORT** — v0 patterns the new site should absorb but has not yet (Sprint 4+ work).
2. **KILL** — v0 content/patterns that violate ship-blockers and must NEVER appear in the new site.
3. **UPGRADE** — v0 content the new site is *already* doing better; voters confirm the upgrade landed.

24 items total across the three classes (see §6).

---

## 1. v0 site inventory

### 1.1 Stack

| Concern | v0 value | New site value (per ADR-001) | Verdict |
|---|---|---|---|
| Framework | Next.js 16.1.6 + App Router | Next.js 16.2.6 | ✅ Same family; new site newer patch |
| React | 19.2.3 | 19.x | ✅ Same |
| Styling | Tailwind 3.4.17 | Tailwind 3.4 | ✅ Same |
| UI primitives | Radix UI + 53 shadcn/ui components | Radix UI (selectively imported) | ⚠️ New site avoided full shadcn dump, only imports what it uses |
| Icons | lucide-react 0.544 | lucide-react | ✅ Same |
| Forms | react-hook-form + zod (deps present but not used in submittal form) | TBD Sprint 4 | ⚠️ v0 form bypasses RHF — Sprint 4 should adopt it properly |
| Theming | next-themes (installed but unused, single-mode site) | Not installed | ✅ Stripped correctly |
| Build target | Vercel default (Node) | OpenNext → Cloudflare Workers (ADR-020) | ⬆️ Upgrade |

**Note (`Web/v0 version/package.json:62-68`):** v0 lists `@tailwindcss/postcss ^4.1.13` and `tailwindcss ^3.4.17` simultaneously — an unstable mix. The new site uses Tailwind 3.4 only. ✅

### 1.2 Pages (6 total)

| Route | v0 file | LOC | Function |
|---|---|---|---|
| `/` | `app/page.tsx` | 333 | Hero + 7-cert bar + product overview + 5-feature grid + 7-row cert table + 3-card value props + 13-row competitor comparison + 4 nav cards |
| `/technical-specifications` | `app/technical-specifications/page.tsx` + `tech-specs-content.tsx` | 82 + 198 | Material composition + 11-row mechanical-properties table + 4 thickness-variant sections + 7-row product-codes table + downloads sidebar |
| `/fire-code-compliance` | `app/fire-code-compliance/page.tsx` + `fire-code-content.tsx` | 38 + 230 | ASTM E-84, E-136, UL assemblies (5 rows), IBC 2021 (4 sections), CBC, CSI spec (06 16 00), QA programs |
| `/installation` | `app/installation/page.tsx` + `installation-content.tsx` | 44 + 191 | Substrate, wood/steel framing, fastening schedule (4-row table), T&G, tools/safety, finishes, **6 YouTube video embeds** |
| `/pricing` | `app/pricing/page.tsx` | 255 | 4-tier pricing card grid ($69-78/panel), 13-row full comparison table, 10K-SF cost-benefit, 4-card logistics, container load specs |
| `/resources` | `app/resources/page.tsx` + `resources-content.tsx` | 26 + 300 | Multi-step submittal form, document library (7 docs), ISO management links, **9 technical FAQs**, contact card |

**Architecture pattern:** every non-home page uses a thin server `page.tsx` (sets metadata + intro) + a `"use client"` content component that mounts `<SectionNav>` and renders the body. This split is the right shape — keep it.

### 1.3 Custom components (6 total — not counting 53 shadcn/ui)

| Component | File | Purpose | Notable patterns |
|---|---|---|---|
| `SiteHeader` | `components/site-header.tsx` | Sticky top nav | Active-link state, mobile Sheet drawer |
| `SiteFooter` | `components/site-footer.tsx` | Footer + CTA banner | 3-column layout, cert badges grid |
| `SectionNav` | `components/section-nav.tsx` | In-page TOC with active-section tracking | **IntersectionObserver + requestAnimationFrame throttle**, sticky sidebar desktop, horizontal scrolling pills mobile, hash-link landing |
| `SubmittalForm` | `components/submittal-form.tsx` | 3-step lead-capture form | Honeypot anti-bot, panel estimate (32 SF/panel), per-step validation, n8n webhook delivery, success card with panel count |
| `DocumentRequestButton` | `components/document-request-button.tsx` | Per-doc request CTA | 4-state UI (idle/sending/sent/error), 3-second auto-reset, calls `/api/document-request` |
| `ThemeProvider` | `components/theme-provider.tsx` | next-themes wrapper | Unused — single-mode site, dead code |

### 1.4 API routes (2 total)

| Route | File | Purpose | Notes |
|---|---|---|---|
| `/api/submittal` | `app/api/submittal/route.ts` | Submittal-form intake | Honeypot check, 14 required-field validation, panel calc, **10s timeout** on webhook delivery, structured response with webhook delivery status |
| `/api/document-request` | `app/api/document-request/route.ts` | Single-doc request intake | Lightweight — just relays `{documentName, documentType, fileName}` |

**Both routes POST to the same n8n test webhook** (`8n8-n8n.80r4dr.easypanel.host/.../webhook-test/...`). The form payload includes `source: "plycemca.com"`. The submittal route's logging is verbose (good for debugging, noisy for prod) and the diagnostic fields (`webhook.delivered`, `webhook.status`, `webhook.error`) leak internal system details to the client — **fix this in Sprint 4**.

### 1.5 Visual identity (legacy)

| Token | v0 value | JARA target | Action |
|---|---|---|---|
| `--primary` | `220 20% 14%` (≈ #1C2330 dark navy) | JARA navy `#0F2A47` | Close, but not the JARA brand value |
| `--accent` | `24 90% 50%` (≈ #FF6F11 orange) | JARA steel-blue `#4A6B8A` | **HARD MISMATCH** — orange contradicts JARA palette |
| `--background` | `30 20% 97%` (warm cream) | Off-white | Close enough |
| `--font-sans` | Inter | Inter | ✅ Same |
| `--font-display` | Space Grotesk | Montserrat | ⚠️ Different — JARA brand specifies Montserrat |
| Logo mark | `"P"` in orange square + `"PlycemCA"` | JARA wordmark/symbol | Must be replaced (SB-1, SB-2) |
| Hero pattern | Single image, `opacity: 0.3` over orange-tinted bg | Full-bleed photo + dark navy gradient overlay (ADR-010) | Upgrade locked, hero photo TBD |
| Yellow H1 (`#e7ff00`) on dark hero (line `app/page.tsx:66`) | High contrast but garish | Not in brand | ⚠️ Brand-strategy noncompliance |

### 1.6 Image assets

`Web/v0 version/public/`:
- `placeholder-logo.png`, `placeholder-logo.svg`, `placeholder-user.jpg`, `placeholder.jpg`, `placeholder.svg` — v0 scaffold default placeholders (unused)
- `images/` folder referenced (`hero-construction.jpg`, `plycem-panels-build-with.png`, `tongue-groove-versatile-finishes.png`, `flexible-installation-load-capacity.png`) but **not present in the checked-in repo** — the build relies on these existing. New site has stricter placeholder discipline (`public/images/{hero,products,og}/_README.md`).

---

## 2. KEEP — patterns to port from v0 to the new site

These v0 patterns are **brand-neutral, well-implemented, and not yet present in the new site.** Each is a candidate Round 10 ballot item.

### K-1. `SectionNav` component pattern *(EVIDENCE: `Web/v0 version/components/section-nav.tsx:1-144`)*

- Sticky sidebar desktop, horizontal scrolling pills mobile.
- **Scroll-spy via `IntersectionObserver`** with `rootMargin: "-80px 0px -60% 0px"` — only marks a section active when it's in the top ~40% of viewport. Sane.
- **RAF-throttled** `setActiveId` — `pendingIdRef` + `rafRef` avoid >60 fps state churn. Production-grade.
- Hash-link landing: reads `window.location.hash` on mount, smooth-scrolls with 100ms delay (lets layout settle).
- Smooth scroll on click with `-80px` offset for sticky header.
- Mobile pill auto-centers on active section (`scrollIntoView({ block: "nearest", inline: "center" })`).

**Where new site needs it:** Sprint 4 `/resources`, Sprint 4 `/contact`, **the Subfloor pillar page (ADR-016)**, any long content page. Currently the new site does not have this pattern — Sprint 3 product detail pages got by without it (they're not long enough), but the pillar page absolutely needs it for AI-citation purposes (deep anchor links).

### K-2. Three-step submittal form pattern *(EVIDENCE: `Web/v0 version/components/submittal-form.tsx:1-598`)*

Strong patterns the new site's `MaterialCalculator` + Sprint 4 submittal-form combo should inherit:

- **Stepped UX with progress indicator** (lines 246–273): numbered chips, hide-on-mobile labels, completed-step coloring.
- **Per-step validation** (`validateStep()`, lines 151–177) — only blocks progression on missing-required, not on individual blur.
- **Honeypot bot trap** (lines 277–286): zero-CSS-visibility input named `_honey`, server rejects on populated.
- **Real-time panel estimate** (line 149, `panelEstimate = areaNumber / 32`) — instant feedback before submission. Already mirrored in `MaterialCalculator`.
- **Success state with computed feedback** (lines 219–243): personalized name + estimated panels + phone CTA fallback.
- **Webhook payload normalization** (lines 57–63): `{...data, estimatedPanels, submittedAt, source}` — clean separation of form data and metadata.
- **n8n webhook with 10s `AbortController` timeout** (`route.ts:69-114`) — production-grade pattern. Sprint 4 must port this.

**Carries forward to Round 10 as a vote item:** does Sprint 4 follow this 3-step structure, or collapse to single-screen (more LCP-friendly, less guided)?

### K-3. Document-request button pattern *(EVIDENCE: `Web/v0 version/components/document-request-button.tsx:1-77`)*

- 4-state inline button (idle/sending/sent/error), auto-resets after 3 seconds.
- One-click POST to `/api/document-request` with `{documentName, documentType, fileName}`.
- **Email-as-fulfillment** model (no PDF hosting, no auth) is well-aligned with ADR-030 (Sprint 3 datasheet handling). New site should port this exact pattern to a Sprint 4 `/resources` document-library section.

### K-4. CSI MasterFormat spec block *(EVIDENCE: `Web/v0 version/app/fire-code-compliance/fire-code-content.tsx:180-196`)*

The "copy-paste-able specification language" block targets architects exactly. v0 uses `06 16 00 - Sheathing`. **This belongs in the Subfloor pillar page** (ADR-016). The block in v0 references Plycem manufacturer by name; new site version must use generic "fiber cement subfloor panels" wording and let the SKU-level data identify the product (per SB-2, SB-5).

### K-5. IBC code-section reference cards *(EVIDENCE: `Web/v0 version/app/fire-code-compliance/fire-code-content.tsx:114-154`)*

Four cards: IBC Section 602, 711, 803, Table 601. Each is a labeled mini-card with code reference + one-line description. **Authoritative-source-cited content is gold for AI citations.** Should be replicated on the Subfloor pillar page.

### K-6. UL Design assembly table *(EVIDENCE: `Web/v0 version/app/fire-code-compliance/fire-code-content.tsx:64-112`)*

5 designs (H502, H504, H511, U449, U487) with fire rating + assembly type + application. v0 also embeds a **deep link to UL's online directory** (`iq.ulprospector.com`). New site's High Performance Subfloor product page (`data/products.ts`) carries these designs as a single string in `compliance[0].detail` — works for JSON-LD but loses table presentation. Pillar page should restore the table format.

### K-7. Volume-pricing-tier card pattern (UI, no prices) *(EVIDENCE: `Web/v0 version/app/pricing/page.tsx:51-72`)*

The 4-tier card UI itself is clean. **Numbers must NOT carry over** (SB-4) but the visual pattern can be repurposed for tiered-by-quantity *messaging* (e.g., "1-49 panels: contact for quote / 50-149: volume pricing available / 150-299: featured tier / 300+: contract pricing") — calls back to the contact form without naming dollar amounts.

### K-8. Cost-benefit case-study card pattern *(EVIDENCE: `Web/v0 version/app/pricing/page.tsx:124-159`)*

3-card "10,000 SF floor" comparison. Numbers must NOT carry over (SB-3, SB-4) but the format — three side-by-side cards summarizing project economics — could be reused as a "What you save" narrative tied to **lead-time + warehouse-proximity advantages** (not material cost). The "Schedule risk eliminated by in-stock availability" angle is brand-safe.

### K-9. Container/logistics 4-card row *(EVIDENCE: `Web/v0 version/app/pricing/page.tsx:166-203`)*

Warehouse / In-stock / Stock delivery / Container orders. This grid format is concise and B2B-targeted. New site's `TrustBar` partially overlaps; the *container orders* tier (6-8 week lead time) is missing — important info for large-project buyers.

### K-10. FAQ accordions using semantic `<details>` *(EVIDENCE: `Web/v0 version/app/resources/resources-content.tsx:25-39`)*

Native `<details><summary>` instead of Radix `<Collapsible>`. Pros: zero JS, content-discoverable by AI crawlers without JS rendering, ships smaller. New site Sprint 3 `ProductFAQ` uses (per Sprint 3 commit) a custom React component — voters should confirm whether it's `<details>` semantics or div-based. **Mandate `<details>` for FAQPage-schema'd content.**

### K-11. YouTube video helper + thumbnail-first embed pattern *(EVIDENCE: `Web/v0 version/app/installation/installation-content.tsx:19-23, 156-188`)*

- `getYouTubeThumb(url)` helper extracts video ID, builds `img.youtube.com/vi/{id}/maxresdefault.jpg` URL.
- Thumbnail-first lazy embed (no iframe until click) — **5 videos lazy-loaded, 1 hero iframe eager**.
- This is the right LCP pattern for video-heavy pages.
- **HOWEVER:** All 5 videos are `youtu.be/...PLYCEM`-branded titles → **content attribution risk under SB-7** (Plycem video usage rules). New site dropped all videos. Round 10 should vote on whether to restore them under "Supplier Training Resources" framing (which is in SB-7's allowed exception).

### K-12. 7-row certifications strip *(EVIDENCE: `Web/v0 version/app/page.tsx:7-15, 87-102`)*

Compact UL R15140 / ASTM C1186-08 / ISO 8336 / ASTM E-84 / ISO 9001/14001/45001 row immediately under hero. **Trust-signal density above the fold.** New site has `TrustBar` (Sprint 2) but voters should confirm parity — does it surface all 7 certs, or is it slimmer?

### K-13. Production webhook timeout pattern *(EVIDENCE: `Web/v0 version/app/api/submittal/route.ts:76-114`)*

`AbortController` + 10s `setTimeout` + try/catch with `isAbortError` type guard. Should be the canonical pattern for any external HTTP call in the new site (Sprint 4 form, future GSC pull, etc.).

---

## 3. KILL — v0 content/patterns that violate ship-blockers (must NEVER appear in new site)

Cross-referenced with `MASTER_AUDIT.md` §5 SB-1 through SB-9. Each entry below is a **non-negotiable removal**, not a vote item.

| # | What v0 has | File:line | Ship-blocker | Confirmed killed in new site? |
|---|---|---|---|---|
| **X-1** | Domain `plycemca.com` | `route.ts:63, 82` (`source: "plycemca.com"`) | SB-1 | ✅ — new domain `jarainternational.com` per ADR-002 |
| **X-2** | Page titles starting with "PlyceCAL", "PlycemCA" | `app/layout.tsx:13-15` | SB-2, SB-5 | ✅ — new metadata uses "JARA International" per `app/layout.tsx` of new site |
| **X-3** | 13-row Plycem-vs-USG-Structo-Crete comparison table | `app/page.tsx:248-298` | SB-3 (explicit) | ✅ — entire section omitted from new home |
| **X-4** | 13-row competitor comparison on pricing page | `app/pricing/page.tsx:76-122` | SB-3, SB-4 | ✅ — `/pricing` route does not exist in new site |
| **X-5** | Footer copyright "© 2025 The Plycem Company" | `components/site-footer.tsx:85` | SB-8 | ✅ — new footer is "© 2026 JARA International Inc." |
| **X-6** | Email `robert@plycemca.com` | `components/site-footer.tsx:52`, multiple | SB-9 | ✅ — new contact uses `@jarainternational.com` |
| **X-7** | Logo mark "P" + word "PlycemCA" in header/footer | `site-header.tsx:27-32`, `site-footer.tsx:30-35` | SB-1, SB-2 | ✅ — new header uses JARA wordmark |
| **X-8** | Subhead "Plycem High Performance Non-Combustible Subfloor Panels" as H1 | `app/page.tsx:66-68` | SB-2 (brand-as-headline) | ✅ — new hero per ADR-010 + Round 6 |
| **X-9** | 4-tier panel pricing $69-$78/panel | `app/pricing/page.tsx:51-72` | SB-4 (explicit) | ✅ — new site is no-currency (C3 CI gate) |
| **X-10** | "20-30% Cost Savings vs. USG Structo-Crete" hero badge | `app/page.tsx:62-65` | SB-3, SB-4 | ✅ — removed |
| **X-11** | Cost-benefit `$23,360 vs $30,400` panel-cost table | `app/pricing/page.tsx:124-159` | SB-3, SB-4 | ✅ — removed |
| **X-12** | "$7,000+ per 10,000 SF" hero claim | `app/page.tsx:220` | SB-3, SB-4 | ✅ — removed |
| **X-13** | "Manufactured by The Plycem Company (Elementia)" footer line | `components/site-footer.tsx:37-39` | SB-2 (subordinates JARA to Plycem) | ✅ — new footer pivots to "B2B distributor… authorized supplier of PLYCEM products" |
| **X-14** | Direct download link to `Plycem_Customer_Pricing.pdf` (or any pricing PDF) in document library | `resources-content.tsx:79` | SB-4 | ⚠️ — verify new site's `/resources` (Sprint 4 stub) does not list any pricing PDF |
| **X-15** | "$69-78/panel (volume dependent)" in body copy | `app/page.tsx:205-207` | SB-4 | ✅ — no equivalent text in new site |
| **X-16** | Robertson's old `+1 (415) 933-5738` framed as primary phone | All pages | ⚠️ Soft: ADR-026 puts Anna AI agent primary, Robertson secondary | ✅ — new site phone strategy locked per ADR-026 |
| **X-17** | "Esencial Costa Rica" cert badge in footer | `components/site-footer.tsx:74` | Soft (manufacturer attribution) | ✅ — JARA is US distributor, not Costa-Rica-origin-of-product story for US construction |
| **X-18** | "55+ Years Manufacturing Excellence" home claim | `app/page.tsx:63` | SB-2 (JARA inherits Plycem's heritage without basis) | ✅ — JARA is a new entity, no inherited claim |

All 18 violations confirmed killed in new site except **X-14** (must be re-verified during Sprint 4 `/resources` build).

---

## 4. UPGRADE — areas where the new site needs to be measurably *better* than v0

These are upgrades the new site has **already attempted** via ADRs 014–019 and Sprints 2–3, but voters should confirm the lift landed (and is measurable).

| # | v0 baseline (what it had) | New-site upgrade target | ADR | Verification gate |
|---|---|---|---|---|
| **U-1** | No JSON-LD anywhere | Org + LocalBusiness on every page; Product + FAQPage + BreadcrumbList on detail pages with `@id` cross-refs | ADR-014 | `scripts/validate_jsonld.py` (Sprint 3 cleanup) — confirmed 5 schemas on detail page, 0 collisions |
| **U-2** | No llms.txt / llms-full.txt | `/llms.txt` (overview + citation guidance + machine endpoint) + `/llms-full.txt` (auto-generated full product manifest) | ADR-015 | live URLs return 200, content matches data/products.ts |
| **U-3** | No `/api/llm-context` programmatic endpoint | Public JSON endpoint serving structured product catalog | ADR-004 | Smoke-test endpoint returns parseable JSON |
| **U-4** | No sitemap.xml | `public/sitemap.xml` enumerating all routes + lastmod | C8 | Submitted to GSC + Bing per C7 |
| **U-5** | No robots.txt | Allow-all + explicit AI-bot allowlist (GPTBot, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, CCBot, etc.) | ADR-015 | live `/robots.txt` validates |
| **U-6** | Single page-title template `'%s | PlyceCAL'` — keyword-stuffed Plycem | Generic JARA-branded titles, Plycem brand keywords deferred to post-approval Phase 4 | ADR-007 | Audit all `<title>` tags for "PLYCEM" violations per SB-5 |
| **U-7** | No hreflang | hreflang en-US + es-US + x-default on every page | C6 | DevTools / view-source check on every route |
| **U-8** | No GSC / Bing verification | DNS TXT records configured pre-launch | C7 | `nslookup -type=TXT jarainternational.com` shows both tokens |
| **U-9** | No multi-product architecture (1 product: subfloor) | 6 products with full schema scaffolds | ADR-003 | `/products` listing + 6 detail pages |
| **U-10** | Manufacturer-brand-centric hero copy | JARA-distributor-brand-centric hero per Round 6 | ADR-010, Round 6 | Hero copy review — does it lead with "Global Sourcing. Built on Trust." or with product? |
| **U-11** | OG image: single static fallback | Per-product dynamic OG image with thickness pill (Sprint 3 commit `635ec9c` F2.R9 fix) | Round 8 | Each product OG image has unique MD5 hash |
| **U-12** | No structured product variant table per thickness | `VariantTable` component with flat sortable WCAG-AA scrollable region | ADR-027 | a11y audit on Sprint 3 component (axe-core or similar) |
| **U-13** | No related-products recommendation | Jaccard-similarity `lib/related-products.ts` | ADR-029 | Sprint 3 verification |
| **U-14** | No FAQ schema on FAQ accordions | FAQPage JSON-LD on every product detail page | ADR-018 | Validator output |
| **U-15** | Performance not measured | Excellent CWV targets LCP <1.5s INP <100ms CLS <0.05 | ADR-019 | Lab + field metrics pre-launch |

**All 15 upgrades appear to be in flight or shipped.** The remaining verification work is **measurement, not implementation** — Round 10 / Round 11 (post-Sprint-5 audit) should confirm each gate.

---

## 5. The four axes — grading the new plan against v0

### 5.1 DESIGN

| Dimension | v0 score | New plan score | Δ |
|---|---|---|---|
| Brand alignment | 2/10 (PlyceCAL identity, orange accent, hijacks Plycem brand) | 9/10 (JARA navy/steel-blue per brand guide, "Global Sourcing. Built on Trust." anchor) | **+7** |
| Visual hierarchy | 7/10 (clean Tailwind defaults, good h1/h2 use) | TBD — Sprint 2 shipped Hero+ValueProps+TrustBar+Calculator; awaiting visual review | **=** |
| Component reuse | 6/10 (53 shadcn components installed, ~10 actually used — bloat) | 8/10 (selective Radix imports only) | **+2** |
| Image discipline | 4/10 (images referenced but not in repo — broken build risk) | 7/10 (placeholder system with `_README.md` per folder) | **+3** |
| Hero treatment | 4/10 (single image @ 0.3 opacity over orange, yellow H1 garish) | 8/10 expected (ADR-010 dark navy gradient overlay; awaiting final hero photo) | **+4** |
| Empty/loading states | 5/10 (form has decent success state; no other loading patterns) | TBD — Sprint 3 components don't yet have explicit empty states (deferred per Round 7 F2 single-voter) | **=** |
| Mobile UX | 7/10 (Sheet drawer nav, horizontal pill section nav) | 8/10 (StickyCTABar, hero responsive) | **+1** |
| Accessibility | 7/10 (sr-only, aria-labelledby, scroll-mt-24) | 9/10 (Sprint 2 calculator passed Round 7 F3.R7 a11y audit; Sprint 3 VariantTable has caption + scope + role=region) | **+2** |

**Design verdict:** new plan substantially better. Two open Sprint 4+ items:
- Port `SectionNav` (K-1)
- Standardize empty/loading/error states across all components (Round 10 ballot)

### 5.2 SEO

| Dimension | v0 score | New plan score | Δ |
|---|---|---|---|
| Meta tags | 5/10 (per-page title/description, but Plycem keyword stuffing) | 9/10 (generic-then-branded after approval, hreflang, OG dynamic) | **+4** |
| Structured data | 0/10 (no JSON-LD whatsoever) | 10/10 expected (Org + LB + Product + FAQ + Breadcrumb per ADR-014) | **+10** |
| Sitemap | 0/10 (none) | 9/10 (sitemap.xml + GSC/Bing submission per C8) | **+9** |
| Canonical URLs | 0/10 (no explicit canonical) | 9/10 (canonical via Next.js metadata) — **VERIFY** | **+9** |
| Hreflang | 0/10 | 9/10 per C6 — **VERIFY** | **+9** |
| URL slugs | 8/10 (semantic /technical-specifications, /fire-code-compliance) | 9/10 (slug per product, en/es separation, /service-areas planned per ADR-017) | **+1** |
| Content depth | 9/10 (extensive ASTM/UL/IBC content) | 6/10 currently (Sprint 3 added product detail but pillar page ADR-016 not yet shipped) | **-3 (Sprint 5 closes)** |
| Internal linking | 6/10 (footer nav, in-content links) | 7/10 (related products via Jaccard; pillar page will add more) | **+1** |
| Local SEO | 3/10 (mentions Long Beach but no schema or service-areas page) | 9/10 (LocalBusiness schema + dedicated /service-areas per ADR-017) | **+6** |
| Page speed | TBD | Targets ADR-019 LCP <1.5s | TBD |

**SEO verdict:** new plan dramatically better on technical-SEO, but **Sprint 5 must restore the content depth** that v0 had — specifically the pillar page (ADR-016) is the lever. Round 10 should treat it as Sprint-5 (or Sprint-4-extended) priority.

### 5.3 AI-FRIENDLINESS

| Dimension | v0 score | New plan score | Δ |
|---|---|---|---|
| llms.txt | 0/10 | 10/10 (clean, well-structured, manufacturer attribution explicit) | **+10** |
| llms-full.txt | 0/10 | 10/10 (full product manifest auto-served as route) | **+10** |
| Machine endpoint | 0/10 | 9/10 (`/api/llm-context` per ADR-004) | **+9** |
| Crawler permissions | TBD (no robots.txt) | 10/10 (explicit allow on 12+ AI bots per ADR-015) | **+10** |
| JSON-LD coverage | 0/10 | 10/10 (5 schemas/page on detail routes, all with `@id`) | **+10** |
| FAQ-as-FAQPage schema | 0/10 (semantic `<details>` but no JSON-LD wrap) | 10/10 (Sprint 3 ProductFAQ + FAQPage schema) | **+10** |
| Citation attribution language | 6/10 (cites UL Directory, ISO standards explicitly) | 9/10 (llms.txt explicit attribution guidance + "do not impersonate" language) | **+3** |
| Source authority signal | 8/10 (UL Online Directory deep link, ISO links) | 8/10 (similar refs in compliance text — VERIFY post-pillar) | **=** |
| Programmatic data access | 0/10 | 9/10 (`/api/llm-context` JSON) | **+9** |

**AI-friendliness verdict:** night-and-day improvement. **v0 was AI-invisible by accident; new site is AI-visible by design.** The single gap is U-15 (citation reference quality) — see §5.4.

### 5.4 REFERENCE / TECHNICAL AUTHORITY

| Dimension | v0 score | New plan score | Δ |
|---|---|---|---|
| UL Directory deep link | ✅ Present (`fire-code-content.tsx:102-110`) | ⚠️ Not yet in any Sprint 3 component (verify) | **-1 (port to compliance section)** |
| ISO standard external links | ✅ 3 ISO standards link directly to iso.org pages | ⚠️ Not in `data/products.ts` compliance strings | **-1 (Round 10 vote: add link slot to ComplianceCert type)** |
| ASTM standard references | ✅ Cited in body | ✅ Cited in compliance | **=** |
| IBC code-section breakdowns | ✅ 4 sections | ❌ Not yet | **-2 (port to Subfloor pillar page)** |
| CSI MasterFormat code | ✅ `06 16 00 - Sheathing` with copy-paste spec block | ❌ Not yet | **-2 (port to Subfloor pillar page)** |
| CBC (California-specific) | ✅ Chapter 7A, Section 420, OSHPD | ❌ Not yet | **-1 (port; valuable for /service-areas California pages)** |
| Document library | ✅ 7 docs with email-request flow | ⚠️ Sprint 4 stub | **=** (parity in Sprint 4) |
| IAPMO ER-360 | ❌ Not mentioned | ✅ In `data/products.ts` for Exterior Cement Board | **+2** |
| Product code (SKU/MPN) granularity | ✅ Per-thickness codes (960140, 972254, etc.) | ✅ Same SKUs in `data/products.ts` variants[] | **=** |
| YouTube video resources | ✅ 6 PLYCEM training videos | ❌ Dropped | **-1 (Round 10 vote item — restore under supplier-training framing?)** |

**Reference verdict:** v0 actually leads here, because the new site has **not yet built the pillar page** (ADR-016) which is the natural home for IBC/CSI/CBC/UL Directory deep-reference content. Sprint 5 closes this. Round 10 must explicitly task Sprint 5 with porting reference items U-1, K-4, K-5, K-6.

**Aggregate four-axis grade:**

| Axis | v0 | New plan (current state) | New plan (post Sprint 5) |
|---|---|---|---|
| Design | 5.3/10 | 8.0/10 | 8.5/10 |
| SEO | 3.1/10 | 7.6/10 | 9.0/10 |
| AI-friendliness | 1.4/10 | 9.4/10 | 9.7/10 |
| Reference | 8.0/10 | 6.0/10 | 9.0/10 |
| **Composite** | **4.5/10** | **7.8/10** | **9.1/10** |

The new plan **already crosses the v0 baseline by 3.3 points** but doesn't max out until Sprint 5 lands the pillar page.

---

## 6. GAP MATRIX → Round 10 ballot inputs

Each row is a candidate vote item for Round 10. Format: `[ID] Item — what to decide / what's at stake — owner sprint`.

| ID | Item | Decision needed | Suggested options | Owner |
|---|---|---|---|---|
| **R10-A** | **SectionNav port (K-1)** | Port v0's SectionNav component (with IntersectionObserver + RAF throttle) to new site? Use on pillar page, /resources, /contact? | A1 Port verbatim with JARA styling. A2 Use Radix Tabs alt. A3 Skip — anchor links only. | Sprint 4 (resources/contact) + Sprint 5 (pillar) |
| **R10-B** | **Sprint 4 submittal-form shape** | New site's Sprint 4 form: 3-step (v0 style) or single-screen (LCP-friendly)? | B1 3-step with progress chips (mirror v0). B2 Single-screen long form. B3 Calculator-first with optional expansion. | Sprint 4 |
| **R10-C** | **Subfloor pillar page (ADR-016) scope** | What sections does the pillar page contain? | C1 UL+IBC+CSI+CBC reference cards (K-4..K-6 ported). C2 Same + cost-narrative section (K-8 reframed). C3 C1 + video resources (K-11 restore). C4 C2 + C3. | Sprint 5 |
| **R10-D** | **YouTube video restoration** | Re-embed Plycem training videos under "Supplier Training Resources" framing (SB-7 carve-out)? | D1 No — too risky without written approval. D2 Yes — frame as supplier-training, request approval in same batch as logo/badge (SB-7). D3 Yes — host transcripts only, not embeds. | Sprint 5 |
| **R10-E** | **Document library port (K-3)** | Port v0's `DocumentRequestButton` + 7-doc list? Which docs survive the Jara rebrand? | E1 Port verbatim, replace Plycem-pricing PDF with no-currency variant. E2 Port pattern, slimmer 4-doc list (UL cert, ASTM E84 cert, IAPMO ER-360, generic tech sheet). E3 Skip — direct-contact only. | Sprint 4 |
| **R10-F** | **CBC / service-areas content** | Build `/service-areas/california` with CBC Chapter 7A + OSHPD content + serving cities? | F1 Yes — single CA page. F2 Per-city pages (LA, SF, San Diego, Sacramento). F3 Per-region (SoCal / NorCal / Central Valley). F4 Single page now, expand per ADR-017. | Sprint 4 or 5 |
| **R10-G** | **Compliance schema reference links** | Add `referenceUrl` slot to `ComplianceCert` type → `additionalProperty` in JSON-LD → external link in UI? | G1 Add slot, hand-populate UL Directory + ISO links. G2 Skip — body copy already references. G3 Add slot but only for cert standards that have free public deep-links. | Sprint 4 |
| **R10-H** | **Empty/loading/error state standard** | Define convention across components? | H1 Skeleton placeholders for async. H2 Plain "Loading…" text. H3 Suspense boundaries with fallback components. H4 Skip — site is largely static. | Sprint 4 |
| **R10-I** | **n8n webhook production migration (C1 closeout)** | Move from test webhook URL to prod, whitelist new domain? | I1 Yes — Sprint 4 first commit. I2 Yes — separate ops PR with secret rotation. I3 Defer to Sprint 5 if Sprint 4 form is single-screen no-server. | Sprint 4 |
| **R10-J** | **CSI MasterFormat spec block** | Include in pillar page? Generic wording (no Plycem brand)? | J1 Yes, copy v0 format, swap manufacturer name to "fiber cement subfloor panels". J2 Yes, expand to full 3-part CSI spec (Part 1 General / Part 2 Products / Part 3 Execution). J3 Skip — CSI offered on email request only. | Sprint 5 |
| **R10-K** | **Container/logistics 4-card row (K-9)** | Add to home or `/service-areas`? | K1 Home — replace one TrustBar card. K2 `/service-areas` page exclusively. K3 Both. K4 Skip. | Sprint 4 or 5 |
| **R10-L** | **Cost-narrative reframing (K-8)** | Build a "schedule-risk vs material-cost" narrative card on home without naming numbers? | L1 Yes — 3-card grid: lead time / proximity / in-stock. L2 Yes — single paragraph. L3 Skip. | Sprint 4 |
| **R10-M** | **Volume-quantity messaging (K-7)** | Add quantity-tier *contact-prompt* cards without prices? | M1 Yes, 4-tier without dollar amounts. M2 Yes, simplified 3-tier. M3 Skip. | Sprint 5 |
| **R10-N** | **TrustBar parity check** | Audit `TrustBar` for 7-cert parity vs v0? | N1 Verify all 7 certs surface (UL R15140, ASTM C1186, ASTM E-84, ISO 8336, ISO 9001, ISO 14001, ISO 45001). N2 Trim to top 3 high-signal certs only. N3 Add IAPMO ER-360. | Sprint 4 cleanup |
| **R10-O** | **next-themes / dark-mode** | Carry next-themes through? v0 had it installed but unused. | O1 Skip — single-mode site. O2 Add dark mode for `/api/llm-context`-style developer-facing pages. O3 Light only. | Locked |
| **R10-P** | **/pricing route handling** | New site has no `/pricing`. Add a redirect or stub explaining "Quote-on-request"? | P1 No route. P2 Stub page that explains quote-only model + links to /contact. P3 301 from `/pricing` → `/contact?from=pricing`. | Sprint 4 |
| **R10-Q** | **AbortController + timeout pattern (K-13)** | Standardize for all external HTTP calls in new site? | Q1 Yes, 10s timeout + isAbortError type guard. Q2 Yes, configurable per route. Q3 Skip — Cloudflare Workers has its own timeout enforcement. | Sprint 4 |
| **R10-R** | **/installation content scope** | New site has no installation page. Should it (a) live inside each product detail, (b) get its own route, (c) merge into pillar? | R1 Per-product variant of installation page. R2 Single /installation route shared across products. R3 Merge into Subfloor pillar (ADR-016). R4 Skip — datasheets on request only. | Sprint 5 |
| **R10-S** | **Round 10 voter onboarding for Codex** | Codex joins as 5th voter — what's the first round to use it? | S1 Round 10 directly. S2 Smoke-test Round 9.5 (no real decision, just verify the API + format). | Round 10 |
| **R10-T** | **Honeypot field on Sprint 4 form (K-2)** | Confirm `_honey` hidden input + server-side rejection? | T1 Yes — port verbatim. T2 Use Turnstile (Cloudflare CAPTCHA) instead. T3 Both. | Sprint 4 |
| **R10-U** | **Inline panel-estimate UX (K-2)** | New site already has MaterialCalculator; preserve the "X panels needed (32 SF/panel)" inline-feedback pattern in Sprint 4 form? | U1 Yes — same logic. U2 Different denominator per product. U3 Skip in form, only in calculator. | Sprint 4 |
| **R10-V** | **IAPMO ER-360 prominence** | New site has it in Exterior Cement Board only. Should it be surfaced on home / pillar too, given its US-architect appeal? | V1 Add to home `TrustBar` (replace one cert). V2 Dedicated card on pillar page. V3 Both. V4 Status quo — product-detail only. | Sprint 4 or 5 |
| **R10-W** | **Architecture for "Manufacturer Plycem" attribution** | New site says "Plycem" in body text per ADR-006. Should there be a single dedicated "Brands we distribute" section as SB-7 allows (with text-only, no logo until approval)? | W1 Yes — `/about` or `/brands` page. W2 Skip — current footer attribution sufficient. W3 Skip until SB-7 logo approval grants. | Sprint 4 or 5 |
| **R10-X** | **CTA-banner-in-footer pattern (K-8 in v0)** | Add the "Ready to spec? Request a quote" CTA banner above footer? | X1 Yes — JARA-themed. X2 Skip — StickyCTABar covers this. X3 Yes but only on detail pages. | Sprint 4 |

**Total: 24 candidate items.** Round 10 prompt will need to be tight — propose narrowing to the **8–10 highest-leverage items** at synthesis time (specifically: A, B, C, E, G, I, P, S are the load-bearing ones for Sprint 4–5 architecture; others can roll to mini-rounds).

---

## 7. Ship-blocker re-check (SB-1 through SB-9) — confirmed killed in new site

See §3 table. **All 9 ship-blockers are actively enforced** in the new site as of Sprint 3 cleanup. The single remaining risk is **X-14** (verifying `/resources` Sprint 4 stub does not list any pricing PDF). Add this to Round 10 as a non-vote constraint: *"Sprint 4 `/resources` must not list any PDF whose filename or display name contains a price or currency string."*

---

## 8. Appendix — file inventory

### 8.1 v0 site file map

```
plycemca.com - previuos website built with v0.com/Web/v0 version/
├── app/
│   ├── api/
│   │   ├── document-request/route.ts        61 LOC — single-doc request webhook relay
│   │   └── submittal/route.ts              153 LOC — full form intake with 10s timeout
│   ├── fire-code-compliance/
│   │   ├── page.tsx                         38 LOC — server wrapper
│   │   └── fire-code-content.tsx           230 LOC — UL/IBC/CBC/CSI sections
│   ├── installation/
│   │   ├── page.tsx                         44 LOC — server wrapper
│   │   └── installation-content.tsx        191 LOC — fastening, T&G, videos
│   ├── pricing/
│   │   └── page.tsx                        255 LOC — SB-3/SB-4 violation surface
│   ├── resources/
│   │   ├── page.tsx                         26 LOC — server wrapper
│   │   └── resources-content.tsx           300 LOC — form + 7 docs + 9 FAQs
│   ├── technical-specifications/
│   │   ├── page.tsx                         82 LOC — server wrapper + downloads sidebar
│   │   └── tech-specs-content.tsx          198 LOC — variants + product codes
│   ├── globals.css                          57 LOC — Tailwind + 22 CSS vars (orange accent)
│   ├── layout.tsx                           41 LOC — root layout, Plycem-keyword title
│   └── page.tsx                            333 LOC — home with SB-3 comparison table
├── components/
│   ├── document-request-button.tsx          77 LOC — 4-state inline button (KEEP K-3)
│   ├── section-nav.tsx                     144 LOC — IntersectionObserver TOC (KEEP K-1)
│   ├── site-footer.tsx                      92 LOC — "© Plycem Company" violation
│   ├── site-header.tsx                      96 LOC — "PlycemCA" wordmark violation
│   ├── submittal-form.tsx                  598 LOC — 3-step form (KEEP K-2)
│   ├── theme-provider.tsx                  small — unused, dead code
│   └── ui/                                  53 shadcn primitives (mostly unused)
├── hooks/
│   ├── use-mobile.tsx                       hook for mobile breakpoint
│   └── use-toast.ts                         shadcn toast hook (unused in custom code)
├── lib/
│   └── utils.ts                             cn() helper (Tailwind merge)
├── public/
│   ├── placeholder-{logo,user,image}.{png,jpg,svg}  scaffold defaults
│   └── images/                              referenced but not committed
├── next.config.mjs                          16 LOC — only YouTube remote image pattern
├── package.json                             pnpm-managed, mixed Tailwind v3/v4 deps
├── postcss.config.mjs                       Tailwind v4 PostCSS plugin (mismatched)
├── tailwind.config.ts                      101 LOC — Inter + Space Grotesk
└── tsconfig.json                            standard
```

### 8.2 New site file map (from origin/claude/sprint3-cleanup) — for reference

See `git ls-tree origin/claude/sprint3-cleanup` output captured during dossier prep. Notable differences from v0:
- `app/api/llm-context/route.ts` — does not exist in v0
- `app/llms-full.txt/route.ts` — does not exist in v0
- `app/not-found.tsx` — does not exist in v0
- `app/products/[slug]/{page.tsx,opengraph-image.tsx}` — new dynamic route
- `data/products.ts` — single source of truth, does not exist in v0
- `lib/{jsonld,related-products,site,calculator,whatsapp,types}.ts` — none exist in v0
- `public/{llms.txt,robots.txt,sitemap.xml,BingSiteAuth.xml}` — none exist in v0
- `scripts/{consensus_call.py,validate_jsonld.py,pull_gsc.py}` — consensus tooling
- 47 consensus artifacts in `docs/history/consensus/`

### 8.3 References cited in v0 (for porting to pillar page)

- **UL Online Certifications Directory:** https://iq.ulprospector.com (cited in `fire-code-content.tsx:102`)
- **ISO 9001:2015:** https://www.iso.org/standard/62085.html
- **ISO 14001:2015:** https://www.iso.org/standard/60857.html
- **ISO 45001:2018:** https://www.iso.org/standard/63787.html
- **Plycem manufacturer training videos** (YouTube IDs):
  - `ePYqJi2w3us` — Residential Subfloor (3:14)
  - `Q4U-l45e3vI` — Roof Sheathing (2:42)
  - `M9q4rrVdNEo` — Deck (2:14)
  - `1m5eTTK0oVo` — Exterior Hidden Joint (2:33)
  - `S7NM__idcCQ` — Interior Exposed Joint (1:57)
  - `8fEDWyZaxNE` — Hero: High Performance Subfloor (3:36)

---

## 9. Process notes

1. **This dossier supersedes the high-level `MASTER_AUDIT.md §6 PHASE 0.5` summary** — that summary remains valid as a phase-level outcome statement, but this dossier is the evidence layer.
2. **Voters in Round 10** should read sections 5 and 6 first, then dip into 1–4 as needed for evidence. Sections 7–8 are constraints/inventory.
3. **The "v0 score" columns in §5** are subjective (my judgment) — voters are encouraged to challenge them.
4. **The 24 R10-* items in §6 are CANDIDATES, not the ballot.** Round 10 prompt will pick 8–10 to put to consensus vote.
