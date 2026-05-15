# Round 10 — Sprint 4 + Sprint 5 Planning: Legacy-port Architecture + DESIGN.md Integration

**Type:** Sprint 4 planning consensus + Sprint 5 architectural prep + DESIGN.md adoption depth.
**Voters (5):** DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1, Codex (GPT-5.1), Claude Opus 4.7.
**Quorum:** ≥3/5 simple majority per item (ADR-032, updated from prior 3/4 rule). Synthesis MUST report vote margin (e.g., "locked 5-0 unanimous" vs "locked 3-2 bare quorum").
**Strategic priority (still active):** Launch in DAYS. Time-to-launch dominates.

**This round is the first 5-voter round.** Codex joins as a new voter for implementation-feasibility / framework-specifics critique. See §7 voter-role notes.

---

## 1. WHAT'S LOCKED (do not re-debate)

### Catalog data & product detail pages
- 6 products in `data/products.ts` (single source of truth). 26 hand-authored FAQs across 6 products. Sprint 3 detail-page template (`/products/[slug]`) shipped + audited (Rounds 8 + 9).
- `lib/jsonld.ts` schemas (Product / FAQPage / BreadcrumbList) shipped with collision-safe `@id` anchors.
- `scripts/validate_jsonld.py` exists for live URL validation.

### Sprint 2 shipped + audited
- Home page (Hero, ValueProps, FeaturedProducts, TrustBar, MaterialCalculator, FinalCTA, StickyCTABar, SiteFooter) — Round 7 cleanup applied.
- `MaterialCalculator` is the canonical a11y exemplar — port its patterns to any new form (fieldset/legend, aria-required, aria-describedby, aria-live=polite on result, focus rings).
- Stub pages exist at `/products`, `/products/[slug]`, `/resources`, `/contact`, `/es`, `/not-found` — Sprint 4 expands the stubs into real content.

### Brand & visual system — `docs/design/DESIGN.md` is now canonical
- Per ADR-033, all visual design tokens (colors, typography, layout, elevation, shapes, components) live in `docs/design/DESIGN.md` (Google Labs spec format).
- JARA palette (locked): navy `#062B49`, navy-dark `#04233D`, steel `#5F7894`, bluegray `#B8C7D6`, bg `#FFFFFF`, bg-soft `#F4F6F8`, ink `#1F2933`. **Forbidden:** orange, yellow, green, royal blue, red (except narrow error UI), pure black.
- Typography: Montserrat (display) + Inter (sans) via `next/font/google`. Sizes/weights/tracking enumerated in DESIGN.md `typography:` block.
- Light mode only. No three-panel symbol decoration. CTA pattern: navy primary on light, white-on-navy primary on dark.

### Ship blockers (NO VOTE — contractual)
SB-1..SB-9 from MASTER_AUDIT §5 remain hard floors:
- SB-1 No "PLYCEM" in domain. SB-2 JARA brand identity. SB-3 No Plycem-vs-USG comparisons. SB-4 No Plycem list prices. SB-5 No "PLYCEM" in meta titles. SB-6 No "Authorized Distributor" without approval. SB-7 No Plycem logo without approval. SB-8 Footer = "© 2026 JARA International Inc." SB-9 Email = `@jarainternational.com`.

### Convergent constraints (already locked by Round 9, no vote needed)
- C1: n8n webhook production migration + domain whitelist before any form ships — Sprint 4 checklist item.
- C2: IAPMO ER-360 expires 2026-07-31 — 90-day renewal reminder required.
- C3: Calculator no-currency CI gate (already enforced via `formatEstimate()` helper).
- C6: hreflang en-US + es-US + x-default on every page.
- C10: Sprint 4 `/resources` PDF library MUST NOT list any document whose filename or display name contains a price or currency string (carry-forward of SB-4).

### Voter pool (ADR-032)
- 5 voters from this round onwards. Codex slug `openai/gpt-5.1-codex` smoke-tested 2026-05-14 (returned exact "codex-online", cost $0.00064).

---

## 2. WHAT THIS ROUND IS NOT

- NOT re-debating the 31 prior ADRs. They are locked unless flagged in `additional_findings` with severity=blocker.
- NOT planning the post-launch (Phase 6) work — full Spanish rollout, video deep-integration with Plycem approval, analytics dashboards.
- NOT a re-vote on the 18 KILL items from the legacy v0 dossier — those are ship-blocker-driven removals, not architectural questions.
- NOT planning the Round 10 ballot itself — that selection was done as the proposal step per MASTER_AUDIT §1 (Claude proposed, 24 dossier candidates narrowed to 10 + R10-Y on DESIGN.md = 11 total).

## 3. WHAT THIS ROUND IS

11 architectural decisions for Sprint 4 (`/resources` + `/contact` + form security + routing) and Sprint 5 (Subfloor pillar page + `/service-areas` + `/installation` + CSI spec content). Plus one meta-item (R10-Y) on DESIGN.md tooling depth.

The 11 items were filtered from a 24-item gap matrix in the legacy v0 dossier (`docs/audit/legacy_v0_dossier.md` §6) using a rubric: include only items where (Sprint-blocking=Y) AND (open-question=Y) AND (not-already-locked=Y). Items failing the rubric became convergent constraints (C11–C14 below) or got deferred to Round 11+ (§5 explicit deferrals).

---

## 4. SPRINT 4 + SPRINT 5 SCOPE (deliverable summary)

**Sprint 4 — Routes + form architecture (decisions from items A, B, E, P, T, V, Y, partial F):**
- `/resources` — full page: submittal form (shape per item B) + document library (per item E) + contact card.
- `/contact` — full page replacing stub: contact card with Anna AI + Robertson direct + email + warehouse info, plus prompt-to-form path.
- `/pricing` — handling per item P (currently 404 / no route — visitors typing the URL hit Cloudflare default).
- `/service-areas` (per item F) — landing page on California coverage; possibly per-city expansion.
- Form security pattern per item T.
- Home TrustBar / pillar prep per item V (IAPMO ER-360 prominence).
- DESIGN.md tooling pipeline per item Y.

**Sprint 5 — Pillar + reference content (decisions from items C, J, R, partial F):**
- `/products/high-performance-subfloor/guide` (or similar) — the Subfloor pillar page per ADR-016, scope per item C.
- CSI MasterFormat spec block per item J (lives in pillar or as standalone resource per C-J interaction).
- `/installation` content per item R.
- Final `/service-areas` city/region structure per item F.

**Components new in Sprint 4 (tokens per DESIGN.md `SubmittalForm` / `DocumentLibrary` / `SectionNav` placeholder definitions):**
- `SubmittalForm` (item B locks shape)
- `DocumentLibrary` (item E locks scope)
- `ContactCard` (no vote — straightforward composition)
- `SectionNav` (item A) — used in Sprint 4 `/resources` and `/contact`, Sprint 5 pillar

**Cross-cutting Sprint 4 carry-forward (already locked, applied implicitly):**
- Production n8n webhook migration before form ships (C1)
- AbortController + 10s timeout on webhook delivery (new constraint C12 below — port from v0 `api/submittal/route.ts:76-114` per dossier K-13)
- Honeypot OR Turnstile per item T
- WCAG 2.1 AA — port `MaterialCalculator` a11y patterns to `SubmittalForm`
- hreflang en-US + es-US + x-default on every new route (C6)

---

## 5. VOTING ITEMS (11 items)

### Item A — SectionNav component port (Sprint 4 + Sprint 5 cross-cutting)

The legacy v0 site had a SectionNav component (`components/section-nav.tsx`, 144 LOC) — sticky sidebar desktop / horizontal scrolling pills mobile, IntersectionObserver-driven active-section tracking with requestAnimationFrame throttle, hash-link landing with 100ms smooth-scroll delay, `-80px` offset for sticky header. Used on 4 v0 long-content pages. The new site has no equivalent. Sprint 4 `/resources` and Sprint 5 pillar page need it (pillar especially — long content + AI deep-anchor citations).

- **A1: Port v0 component verbatim, JARA-restyle.** Same `IntersectionObserver({ rootMargin: "-80px 0px -60% 0px" })` + RAF throttle pattern. Replace orange accent with `{colors.steel}` active state, `{colors.navy}` text. Fastest path; production-grade pattern already validated in v0. ~3 hours work.
- **A2: Build with Radix UI Tabs primitive.** Use `@radix-ui/react-tabs` for a11y baseline (keyboard nav, ARIA built-in). Loses the scroll-spy auto-update behavior (Tabs are click-driven, not scroll-driven). Less work to verify a11y; loses the "as you scroll, the nav follows" UX. ~2 hours.
- **A3: Skip — anchor links only.** Each long section gets a plain `<h2 id="...">` and a static list of anchor links at the top of the page. No active-section tracking. Simplest, least JS, fastest LCP. Worst UX for users skimming long pages. ~30 min.

### Item B — SubmittalForm shape (Sprint 4 core)

The Sprint 2 cleanup left `/resources` as a stub reading calculator prefill params. Sprint 4 must build the real form. The v0 site had a 3-step form (`components/submittal-form.tsx`, 598 LOC) with honeypot + per-step validation + n8n webhook + success card with computed panel estimate.

- **B1: 3-step with progress chips (v0 pattern).** Step 1: Project Information. Step 2: Product Requirements. Step 3: Contact + Timeline + Documents requested. Per-step validation, numbered progress chips, back/next nav. Highest conversion rate for B2B per industry norms; longest scroll-on-mobile if collapsed. Mirrors v0 — established UX. ~6 hours.
- **B2: Single-screen long form.** All ~18 fields on one page with section dividers (Project / Product / Contact). Easier to scan; one Submit at bottom. Better LCP (no client-state machinery), worse engagement for novice users (intimidating wall of fields). ~4 hours.
- **B3: Calculator-first with optional expansion.** Lands on `MaterialCalculator` (existing component), calculator submit reveals an expandable "Refine request" section with project/contact fields. Highest entry-point clarity (one CTA above fold), but two-stage commitment may lose users who skip the expansion. ~5 hours including state plumbing.

### Item C — Subfloor pillar page scope (Sprint 5 core)

ADR-016 (Round 3, 4/4) locks 1 pillar page at launch: a comprehensive guide to fiber-cement subfloor for Type I/II construction. The v0 site had four authoritative content blocks (UL Designs, IBC code-section cards, CBC chapter refs, CSI MasterFormat spec) plus 6 Plycem training videos. New site dropped the videos. Pillar must restore reference-authority content (dossier §5.4 grades v0 8/10 on Reference vs new site 6/10 currently).

- **C1: Reference cards only — UL + IBC + CSI + CBC.** Port: UL Design assembly table (5 designs H502/H504/H511/U449/U487), IBC section cards (602/711/803/Table 601), CBC Chapter 7A + Section 420 + OSHPD, CSI MasterFormat `06 16 00`. No videos, no cost narrative. Tight, AI-citation-friendly, ~8 hours content + layout.
- **C2: C1 + cost-narrative block (reframed without dollar values).** Adds a "Schedule-risk vs material-cost" narrative card grid (3 cards: lead time / proximity / in-stock) per dossier §6 R10-L. NO dollar amounts (SB-4 compliant) — focus on lead-time and schedule-risk reduction. ~10 hours.
- **C3: C1 + Plycem training video embeds.** Restores the 5 manufacturer training videos under "Supplier Training Resources" framing (SB-7 carve-out for distributor education materials). Requires roll-up into the consolidated Plycem approval request (C4) — videos cannot ship until approval granted. ~9 hours content + 1-2 week wait on approval.
- **C4: Full — C1 + C2 + C3.** Maximum content depth. Higher Sprint 5 cost; gated on Plycem approval for the video portion. ~14 hours + approval wait.

### Item E — Document library port (Sprint 4 /resources)

v0 had a 7-document email-request library (UL R15140 cert, ASTM E84 cert, CERZ.R15140 cert, Plycem brochure, Plycem customer pricing PDF, UL technical report, technical data sheets) with a `DocumentRequestButton` component (4-state idle/sending/sent/error, calls `/api/document-request` webhook). New site has no library; `/resources` is a stub.

- **E1: Port verbatim minus Plycem-pricing PDF.** Same 7-doc table, drop "Plycem_Customer_Pricing.pdf" (SB-4 violation per dossier X-14). Port `DocumentRequestButton` pattern with JARA styling. ~4 hours.
- **E2: Slim 4-doc list.** Keep only: UL R15140 cert, ASTM E-84 cert, IAPMO ER-360 (US-architect-relevant, expires 2026-07-31), generic tech sheet. Drops the redundant UL CERZ/BQXR variants + brochure (which is Plycem-branded — SB-2/SB-7 risk without rebrand). Cleaner; lower future maintenance. ~3 hours.
- **E3: Skip — direct contact only.** No library at all. `/resources` becomes the form-only page with text "documentation packets available on request — fill the form below." Lowest engineering work; loses a 7-touchpoint lead-magnet surface present in v0. ~0 hours.

### Item F — /service-areas content structure (Sprint 4 or 5 SEO)

ADR-017 (Round 3, 4/4) locks LocalBusiness schema + dedicated `/service-areas` page. JARA serves 10 areas from Long Beach (per `lib/site.ts`): Long Beach, LA, Orange County, San Diego, Inland Empire, Bay Area, Sacramento, Central Valley, Phoenix AZ, Las Vegas NV. The structure decides SEO surface area and content depth.

- **F1: Single CA-only page.** One `/service-areas` route with all 10 areas listed as text + map snapshot + general lead-time table. Cheapest; thin SEO surface. ~3 hours.
- **F2: Per-city pages (4 launch cities + index).** `/service-areas/los-angeles`, `/san-francisco`, `/san-diego`, `/sacramento` + `/service-areas` index. Each city page: schema with `areaServed` + 1-2 paragraphs of geographic-specific content + lead-time + nearby project examples (placeholder until we have real). Strongest SEO play; 5x content authoring overhead. ~10 hours.
- **F3: Per-region (3 region pages + index).** `/service-areas/southern-california`, `/northern-california`, `/southwest`. Mid-grain. ~6 hours.
- **F4: Single page now + per-city expansion post-launch.** F1 ships in Sprint 4. F2 backlogged to Phase 6 once we have analytics + real customer examples. Pragmatic. ~3 hours Sprint 4, ~7 hours Phase 6.

### Item J — CSI MasterFormat spec block scope (Sprint 5 reference authority)

v0 had a copy-paste CSI spec snippet on the fire-code page (`fire-code-content.tsx:180-196`), targeting architects directly. Section `06 16 00 - Sheathing`. New site has no equivalent. Specifiers expect this content; architects can't write spec books without it. SB-2/SB-5 compliance requires generic-manufacturer wording at launch.

- **J1: Copy v0 single-paragraph format, swap manufacturer.** Single boxed paragraph titled "CSI Specification 06 16 00" with body: *"Fiber cement subfloor panels shall be non-combustible per ASTM E136, classified per UL R15140 for use in designated fire-rated assemblies, and shall meet ASTM C1186-08 Type A, Grade I requirements…"* — manufacturer-agnostic, SB-2-compliant. ~1 hour.
- **J2: Expand to full 3-part CSI spec.** Part 1 (General — references, submittals, quality assurance, delivery), Part 2 (Products — manufacturers, materials, accessories), Part 3 (Execution — examination, installation, protection, cleaning). Industry-grade authority content; lengthy. Best AI-citation hook. ~4 hours authoring + review.
- **J3: Skip on-page — CSI offered via email request only.** Add "CSI Specification (3-part) available on request" link in document library (Item E). Lowest commitment; loses on-page SEO hook. ~30 min.

### Item P — /pricing route handling (Sprint 4 routing)

v0's `/pricing` page violated SB-3 + SB-4 with comparison tables and $69-$78/panel disclosure. New site removed it. But specifiers will type `/pricing` directly (it's a common URL pattern) and hit a 404 unless we handle it.

- **P1: No route — Cloudflare 404 default.** Status quo. Plain 404 for `/pricing`. Cheapest; worst conversion (visitor leaves). ~0 hours.
- **P2: Stub page explaining quote-only model.** `/pricing` route exists, JARA-brand-compliant, brief copy: *"Pricing is provided per-project. Quote requests typically return within 1 business day."* + 2 CTAs (call Anna / submit form). SB-4 compliant; preserves SEO juice from inbound `/pricing` links. ~1 hour.
- **P3: 301 redirect from `/pricing` → `/contact?from=pricing`.** Permanent redirect via Next.js `redirects` config or middleware. Single source of truth for "ask us" CTA. Loses any potential `/pricing`-as-keyword SEO. ~30 min.

### Item R — /installation content scope (Sprint 5 architecture)

v0 had a dedicated `/installation` page (191 LOC content) with substrate requirements, wood/steel framing tables, fastening schedules, T&G system, tools/safety, finishes — plus 6 YouTube training videos. Per-product installation requirements differ subtly. New site has no installation page. Specifiers and contractors expect it.

- **R1: Per-product installation section on each detail page.** Inline new section between Compliance and FAQ on `/products/[slug]`: brief installation summary + fastener schedule + framing requirements specific to that product. Best contextual fit; ~6x authoring overhead (6 products); each section short. ~8 hours.
- **R2: Single shared /installation route.** `/installation` page with tabs/sections per product family (subfloor / roof sheathing / exterior cladding). Mirrors v0 structure. Single canonical surface for installer search queries. ~5 hours.
- **R3: Merge installation content into Subfloor pillar page.** Installation appears as a major section within the pillar (ADR-016). Tight content focus; pillar becomes the canonical "everything about subfloor" page. Roof sheathing / deck / etc. installation gets deferred (Phase 6). ~3 hours additive on pillar.
- **R4: Skip on-site — datasheets-on-request only.** No installation content visible on site; users requesting datasheets get the installation PDF in the email response. Lowest commitment; worst SEO for installer-query traffic. ~0 hours.

### Item T — SubmittalForm bot prevention (Sprint 4 form security)

v0 used a CSS-hidden honeypot input named `_honey` checked server-side (`api/submittal/route.ts:23-27`). AI scrapers in 2025+ are increasingly honeypot-aware. Cloudflare Turnstile (the CAPTCHA alternative) is free with our Workers deployment and runs transparently for most users.

- **T1: Honeypot only (port v0 pattern).** Zero user friction, zero external deps. Approximately 60-70% effective against modern bots (AI agents trained on form schemas can identify visually-hidden inputs). ~30 min.
- **T2: Cloudflare Turnstile only.** Free, transparent for ~95% of users (no challenge UI; runs as invisible managed challenge). Requires site key (free, Cloudflare dashboard) + secret in env. Verify token server-side before webhook delivery. Modern best practice; harder for AI agents to bypass. ~2 hours.
- **T3: Both — defense in depth.** Honeypot AND Turnstile. Highest false-rejection risk (paranoid bots filter on both); maximum bot deterrence. ~2.5 hours.

### Item V — IAPMO ER-360 prominence (Sprint 4 trust + Sprint 5 pillar)

IAPMO ER-360 (the highest-value SEO/B2B asset for US architects per Phase 0.5 audit) is currently only mentioned on the Exterior Cement Board product detail page in `data/products.ts`. Expires 2026-07-31 (C2 reminder). High specifier salience.

- **V1: Add to home TrustBar.** Replace one current cert (likely "ASTM E-136" or "CBC Chapter 7A" — currently 6 certs surfaced; ER-360 is more architect-relevant than E-136). Higher above-fold visibility. ~30 min.
- **V2: Dedicated card on Subfloor pillar page.** Pillar gets a featured ER-360 callout with link to PDF (when document library lands per item E). Cleaner — pillar is the right home for deep certification context. ~1 hour (in pillar).
- **V3: Both — home TrustBar + pillar card.** Maximum exposure. Slight TrustBar visual rebalancing. ~1.5 hours.
- **V4: Status quo — product-detail only.** No change. Ships the cert reference exactly where it lives in `data/products.ts`. Lowest engagement signal for architects landing on home. ~0 hours.

### Item Y — DESIGN.md integration depth (ADR-033 resolution)

ADR-033 (2026-05-14 user-strategic) adopted `docs/design/DESIGN.md` as the canonical visual-design single-source-of-truth. The Google Labs methodology (`https://github.com/google-labs-code/design.md`) ships a CLI offering: structural linting (WCAG contrast checks), diff-reports across versions, and auto-export to `tailwind.config.{json,css}` + W3C DTCG tokens.json. Codex (per its ADR-032 role) specifically benefits from a machine-readable design layer. Integration depth has real ergonomics trade-offs.

- **Y1: File-only (no CLI, no CI).** `docs/design/DESIGN.md` is hand-maintained. `tailwind.config.ts`, `globals.css`, `lib/site.ts` independently edited. Convention (MASTER_AUDIT §8) requires same-commit sync, enforced by reviewer attention only. Cheapest; highest drift risk over 6+ months. ~0 hours.
- **Y2: File + CLI lint in pre-commit hook.** Install Google Labs CLI as devDependency, add a pre-commit hook that runs `design lint docs/design/DESIGN.md` — catches WCAG contrast violations and structural errors before commit. Tailwind config still hand-maintained. Recommended floor. ~3 hours setup + ongoing $0 cost.
- **Y3: Y2 + auto-export to `tailwind.config.ts`.** Pre-commit hook also runs `design export --target tailwind --out tailwind.config.tokens.ts`, with `tailwind.config.ts` importing the generated tokens file. DESIGN.md becomes the *only* place colors/typography are edited. ~6 hours setup; commits get an extra auto-generated file change.
- **Y4: Y3 + diff-report bot on every PR.** Y3 plus a GitHub Action that posts a comment on every PR touching `docs/design/DESIGN.md` showing tokens added/changed/removed + WCAG contrast deltas. Maximum rigor; useful only if multiple contributors. Currently a 1-contributor project. ~10 hours setup; ongoing review noise overhead.

---

## 6. OUTPUT FORMAT (STRICT JSON ONLY)

```json
{
  "model": "your-model-id",
  "agent": "your-name",
  "votes": {
    "A": "A1|A2|A3",
    "B": "B1|B2|B3",
    "C": "C1|C2|C3|C4",
    "E": "E1|E2|E3",
    "F": "F1|F2|F3|F4",
    "J": "J1|J2|J3",
    "P": "P1|P2|P3",
    "R": "R1|R2|R3|R4",
    "T": "T1|T2|T3",
    "V": "V1|V2|V3|V4",
    "Y": "Y1|Y2|Y3|Y4"
  },
  "reasoning": {
    "A": "1-2 sentences",
    "B": "1-2 sentences",
    "C": "1-2 sentences",
    "E": "1-2 sentences",
    "F": "1-2 sentences",
    "J": "1-2 sentences",
    "P": "1-2 sentences",
    "R": "1-2 sentences",
    "T": "1-2 sentences",
    "V": "1-2 sentences",
    "Y": "1-2 sentences"
  },
  "additional_findings": [
    {
      "title": "...",
      "description": "...",
      "severity": "blocker|high|medium|low",
      "applies_to_phase": "4|5|6"
    }
  ],
  "verdict": "ship|revise|hold",
  "verdict_reason": "1-2 sentences"
}
```

---

## 7. Notes to voters

### General voting guidance
- Launch-in-days dominates. When two options are roughly equivalent on UX/value, pick the option that ships fastest.
- Every option above MUST be JARA-brand-compliant and SB-1..SB-9 compliant. Flag in reasoning if any option silently violates one.
- Synthesis WILL call out vote margin (5-0 unanimous / 4-1 / 3-2 bare). If you're voting in a way you expect to be the minority, give your reasoning more depth — single-voter findings get applied when they're well-argued.
- `additional_findings` welcome for Sprint 4–5 implementation gotchas not on the ballot (e.g., Turnstile token verification edge cases, IntersectionObserver Safari quirks, SubmittalForm field-state-persistence across nav, Cloudflare KV for form-draft storage, hreflang on the new routes).
- Cross-item dependencies matter. Items C, J, R are all Sprint 5 pillar/installation content — vote consistently. If C4 wins (full pillar including videos), then R3 (merge installation into pillar) may be redundant; flag the interaction.

### Convergent constraints flagged in Round 9 / dossier (NOT vote items — these are auto-applied)
- **C11**: Sprint 4 cleanup — TrustBar audit for 7-cert parity vs v0 dossier K-12. Verify all 7 certs surface on home (or document why fewer is intentional after vote V resolves).
- **C12**: Sprint 4 — port AbortController + 10s timeout pattern + `isAbortError` type guard from v0 `api/submittal/route.ts:76-114` to all external HTTP calls (form webhook, future GSC pull).
- **C13**: Sprint 4 cleanup — add optional `referenceUrl` slot to `ComplianceCert` type in `data/products.ts`, used for ISO/UL/IAPMO deep-links in JSON-LD `additionalProperty[]` + UI external-link icons.
- **C14**: Sprint 4 — port `MaterialCalculator` panel-estimate inline UX into Sprint 4 `SubmittalForm` (regardless of B1/B2/B3 outcome — the live "X panels needed (32 SF/panel)" feedback pattern).

### Items explicitly deferred to Round 11+ (NOT vote items)
- **D** — Plycem YouTube video embeds (gated on SB-7 approval; address in consolidated Plycem approval request)
- **G** — Compliance schema `referenceUrl` slot (folded into C13 above)
- **H** — Empty/loading/error state design standard (Phase 6 audit)
- **K** — Container/logistics 4-card row on home (low severity)
- **L** — Cost-narrative reframe on home (subsumed by C2 vote inside item C)
- **M** — Volume-quantity messaging cards (low severity)
- **W** — "Brands We Distribute" section (gated on SB-7 approval)
- **X** — CTA-banner-in-footer pattern (low severity, StickyCTABar overlaps)

### Per-voter role notes (per ADR-032 voter pool composition)

- **Claude Opus 4.7** (architecture / brand / Plycem-compliance reviewer / synthesis author): also drafted this prompt. Casts a vote like any other voter; synthesis happens post-vote.
- **DeepSeek V4 Pro** (quant / technical SEO / structured data): focus on items F (SEO surface), J (CSI authority content), V (IAPMO citation value), Y (CLI/CI rigor trade-offs).
- **Gemini 3.1 Flash Lite** (visual design / Core Web Vitals): focus on items B (form LCP impact), C (pillar page Core Web Vitals at scale), A (scroll-spy JS cost vs UX gain).
- **GLM-5.1** (anchor / safe stable reasoning): cross-check options for hidden brand-compliance or a11y risks; weight toward shippable defaults.
- **Codex (GPT-5.1) — FIRST APPEARANCE**: implementation-feasibility reviewer. Focus on framework specifics (Next.js 16 + Cloudflare Workers + OpenNext compatibility), library ergonomics (Radix Tabs in A2; Turnstile token verification in T2; Google Labs CLI install + Tailwind autoexport mechanics in Y3/Y4), code-level cost-to-ship estimates per option. Your additional_findings are particularly welcome for: which option creates the lightest implementation surface, where any option has a "this won't actually work the way the prompt describes" risk, and any framework version pinning concerns.

### Voting independence
- Vote independently. No cross-voter visibility.
- Reasoning fields should be terse (1-2 sentences) but specific enough that synthesis can group convergent rationales.
- This prompt is immutable once sent. Adjustments only via a Round 10.5 follow-up prompt if a blocker `additional_findings` requires it.

---

**Prompt closed. Cast your vote.**
