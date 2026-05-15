# Round 10 — Synthesis (Sprint 4 + Sprint 5 Planning + DESIGN.md Adoption)

**Date:** 2026-05-14
**Type:** Sprint 4 planning + Sprint 5 architectural prep + R10-Y meta-decision
**Voters captured:** Claude Opus 4.7 (manual), DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1, Codex GPT-5.1 — **5/5 (first 5-voter round; Codex first appearance per ADR-032)**
**Quorum rule:** ≥3/5 simple majority (R-CONS-7 updated). Margin called out per §8 convention.
**Prompt:** [`round10_prompt.md`](round10_prompt.md) (immutable, commit `ccc6d2d`)
**Vote files:** [`round10_claude.md`](round10_claude.md), [`round10_deepseek.json`](round10_deepseek.json), [`round10_gemini.json`](round10_gemini.json), [`round10_glm.json`](round10_glm.json), [`round10_codex.json`](round10_codex.json)

**Voter self-id quirk:** all 4 OpenRouter voters mislabeled themselves in the `agent` field of their content JSON (DeepSeek/Gemini both said "claude-opus-4.7", GLM said "Codex", Codex said "gpt-4.1"). Authoritative attribution = the top-level `model` field of each file, per MASTER_AUDIT §2 quirk note. Below uses authoritative attribution.

---

## 1. Vote tally

| Item | Claude | DeepSeek | Gemini | GLM | Codex | Tally | Margin | Action |
|---|---|---|---|---|---|---|---|---|
| **A** SectionNav | A1 | A1 | A1 | A1 | A1 | A1=5 | **5-0 unanimous** | 🔒 LOCK A1 |
| **B** SubmittalForm | B1 | B1 | B1 | B2 | B1 | B1=4, B2=1 | **4-1 strong** | 🔒 LOCK B1 |
| **C** Pillar scope | C2 | C2 | C1 | C1 | C2 | C2=3, C1=2 | **3-2 bare** | 🔒 LOCK C2 |
| **E** Doc library | E2 | E2 | E1 | E2 | E2 | E2=4, E1=1 | **4-1 strong** | 🔒 LOCK E2 |
| **F** /service-areas | F4 | F4 | F4 | F4 | F4 | F4=5 | **5-0 unanimous** | 🔒 LOCK F4 |
| **J** CSI spec | J1 | J1 | J1 | J1 | J2 | J1=4, J2=1 | **4-1 strong** | 🔒 LOCK J1 |
| **P** /pricing | P2 | P2 | P2 | P3 | P2 | P2=4, P3=1 | **4-1 strong** | 🔒 LOCK P2 |
| **R** /installation | R3 | R3 | R1 | R3 | R2 | R3=3, R1=1, R2=1 | **3-2 bare (3-way split among dissenters)** | 🔒 LOCK R3 |
| **T** Form security | T2 | T2 | T2 | T2 | T2 | T2=5 | **5-0 unanimous** | 🔒 LOCK T2 |
| **V** IAPMO ER-360 | V3 | V3 | V3 | V3 | V3 | V3=5 | **5-0 unanimous** | 🔒 LOCK V3 |
| **Y** DESIGN.md depth | Y2 | Y2 | Y2 | Y2 | Y2 | Y2=5 | **5-0 unanimous** | 🔒 LOCK Y2 |

**Aggregate:** 11/11 items locked. 5 unanimous (A, F, T, V, Y), 4 strong-majority (B, E, J, P), 2 bare-quorum (C, R). **No item failed quorum.**

**Verdicts:** 5/5 ship. No revise, no hold.

---

## 2. Locked decisions

### 🔒 ADR-034 — SectionNav port (Item A → A1, 5-0 unanimous)
- **Decision:** Port the v0 `components/section-nav.tsx` verbatim (IntersectionObserver + RAF throttle + hash-link landing + `-80px` sticky offset). Restyle with JARA tokens — orange accent → `{colors.steel}` active state, `{colors.navy}` text. Used in Sprint 4 `/resources` + `/contact` and Sprint 5 pillar page.
- **Convergent rationale:** Production-validated pattern, scroll-spy auto-update preserves the UX intent, lowest implementation cost (~3h), no framework-integration risk on Next.js 16 + Cloudflare Workers.
- **Implementation constraints from convergent findings (§4 F2.R10):** must call `observer.disconnect()` on unmount (Gemini), feature-detect Safari <16.4 rootMargin behavior (GLM), test on Safari 17+ for the off-by-one quirk (DeepSeek).

### 🔒 ADR-035 — SubmittalForm shape (Item B → B1, 4-1 strong)
- **Decision:** 3-step form with progress chips. Step 1 Project Information / Step 2 Product Requirements / Step 3 Contact + Timeline + Documents requested. Honeypot supplemented by Turnstile (per T2 lock), per-step validation, calculator-feedback panel-estimate UX (C14), n8n production webhook (C1) with AbortController timeout pattern (C12).
- **Margin:** 4-1 strong. Codex was the lone B2 (single-screen) dissent on grounds of lower implementation surface + faster ship + LCP.
- **Convergent rationale (B1 voters):** v0's 3-step was airtight (dossier K-2 keep-and-port flagging), proven B2B conversion pattern, cognitive offloading for novice spec-buyers. Codex's dissent applied as a SubmittalForm field-state persistence finding (§4 F3.R10 below) — the 3-step state plumbing must be done right.

### 🔒 ADR-036 — Pillar page scope (Item C → C2, 3-2 bare quorum)
- **Decision:** Reference cards (UL Design table, IBC section cards, CBC chapter refs, CSI MasterFormat block) + a no-currency schedule-risk narrative section (3 cards: lead time / proximity / in-stock). No videos at launch (defer C3 until Plycem SB-7 approval). ~10h Sprint 5 effort.
- **Margin:** 3-2 bare. **This is the new floor under ADR-032's 3/5 quorum — synthesis flags low-confidence.** Gemini and GLM both voted C1 (cards-only, no narrative) for tighter scope and lower content-authoring cost.
- **Margin handling:** Following the new §8 convention, this lock is documented as bare-quorum. If Sprint 5 implementation reveals the cost-narrative cards add meaningful page weight that hurts ADR-019 LCP target, the narrative can be deferred to a Sprint 5.5 follow-up without disturbing the locked pillar scope.

### 🔒 ADR-037 — Document library (Item E → E2, 4-1 strong)
- **Decision:** Slim 4-doc list — UL R15140 certificate, ASTM E-84 certificate, IAPMO ER-360 evaluation report, generic technical data sheet. Port the v0 `DocumentRequestButton` 4-state pattern (idle/sending/sent/error) with JARA styling, calling `/api/document-request`.
- **Margin:** 4-1 strong. Gemini was the lone E1 (port verbatim minus pricing PDF) dissent on grounds of preserving the full 7-doc lead-magnet surface. Convergent E2 rationale was lower brand-risk surface (drops the Plycem-branded brochure → SB-2/SB-7 risk) + lower maintenance + the 4 docs cover the US-architect-essential certifications.

### 🔒 ADR-038 — /service-areas content (Item F → F4, 5-0 unanimous)
- **Decision:** Single `/service-areas` page at Sprint 4 (lists all 10 service areas + LocalBusiness JSON-LD per ADR-017 + lead-time table). Per-city expansion (`/service-areas/los-angeles`, `/san-francisco`, `/san-diego`, `/sacramento`) backlogged to Phase 6 once analytics + real customer examples ground the content. ~3h Sprint 4 effort.
- **Convergent rationale:** Premature per-city pages risk thin content (worse for SEO than 1 strong page); the per-city expansion needs real data to ground. F4 ships the SEO baseline now and preserves the option.

### 🔒 ADR-039 — CSI MasterFormat spec block (Item J → J1, 4-1 strong)
- **Decision:** Single-paragraph manufacturer-agnostic CSI 06 16 00 spec block on the Subfloor pillar page. Wording: *"Fiber cement subfloor panels shall be non-combustible per ASTM E136, classified per UL R15140 for use in designated fire-rated assemblies, and shall meet ASTM C1186-08 Type A, Grade I requirements…"* — SB-2 + SB-5 compliant. ~1h authoring.
- **Margin:** 4-1 strong. Codex was the lone J2 (full 3-part CSI spec) dissent on grounds that full spec is the authoritative deliverable specifiers expect.
- **Codex dissent applied as Phase 6 expansion path:** if Subfloor pillar analytics show CSI-block engagement > median section engagement post-launch, expand to J2's full 3-part spec.

### 🔒 ADR-040 — /pricing route handling (Item P → P2, 4-1 strong)
- **Decision:** `/pricing` route exists as a brand-compliant stub page: brief copy explaining quote-only model + 2 CTAs (call Anna primary + submit form). SB-4 compliant. Preserves SEO juice from inbound `/pricing` links. ~1h.
- **Margin:** 4-1 strong. GLM was the lone P3 (301 redirect) dissent on grounds of minimum implementation surface.
- **GLM dissent value:** flagged Next.js `redirects` + OpenNext compatibility specifics that are useful future reference; documented in §4 single-voter findings.

### 🔒 ADR-041 — /installation content (Item R → R3, 3-2 bare quorum)
- **Decision:** Installation content merges into the Subfloor pillar page (ADR-016). No standalone `/installation` route at launch. Non-subfloor installation content (roof sheathing, deck, exterior cladding, etc.) deferred to Phase 6.
- **Margin:** 3-2 bare. Gemini voted R1 (per-product installation sections on each detail page) for contextual relevance; Codex voted R2 (single shared `/installation` route) for canonical surface.
- **Margin handling + cross-item interaction (GLM finding §4 F4.R10):** R3 + C2 together make the pillar page long (~3000+ words across UL/IBC/CBC/CSI/cost-narrative/installation/ER-360 sections). **The SectionNav (A1) is therefore not optional but critical for the pillar.** Sprint 5 dependency: SectionNav (A1, Sprint 4 deliverable) MUST ship before pillar content is authored, or pillar ships in a degraded scroll-only state until SectionNav lands.

### 🔒 ADR-042 — Form bot prevention (Item T → T2, 5-0 unanimous)
- **Decision:** Cloudflare Turnstile only, no honeypot. Free with our Workers deployment, transparent for ~95% of users (managed challenge — no visible UI), modern AI-scraper-resistant. Server-side `siteverify` call verifies token before webhook delivery.
- **Convergent rationale:** T2 is the modern best practice; T1's honeypot pattern is increasingly identifiable by 2025+ AI-trained scrapers; T3's defense-in-depth adds marginal benefit + false-rejection risk for ~30 min more work.
- **Implementation constraints from convergent findings (§4 F1.R10):** Turnstile siteverify call must use AbortController timeout pattern (C12) AND coordinate with the webhook call's timeout budget (10s total may be tight under edge latency — bump to 15s or parallelize verify with payload construction). Reject on cdata/hostname mismatches.

### 🔒 ADR-043 — IAPMO ER-360 prominence (Item V → V3, 5-0 unanimous)
- **Decision:** IAPMO ER-360 surfaced on home `TrustBar` (replacing one of the 6 current certs, likely "ASTM E-136" or "CBC Chapter 7A" — the lowest-architect-salience of the current set) AND as a dedicated featured card on the Subfloor pillar page. ~1.5h total.
- **Convergent rationale:** ER-360 is the #1 SEO/B2B asset per Phase 0.5 audit, US-architect-specific value, expires 2026-07-31 (C2 renewal alarm). Above-fold home discovery + deep pillar context together saturate the architect funnel.

### 🔒 ADR-044 — DESIGN.md integration depth (Item Y → Y2, 5-0 unanimous)
- **Decision:** Install Google Labs `design.md` CLI as devDependency. Add a pre-commit hook that runs `design lint docs/design/DESIGN.md` — catches WCAG contrast violations and structural errors before commit. `tailwind.config.ts`, `globals.css`, `lib/site.ts` remain hand-maintained; the §8 MASTER_AUDIT convention enforces same-commit DESIGN.md sync via reviewer attention. ~3h setup, $0 ongoing.
- **Convergent rationale:** Pre-commit linting catches the contrast-regression class of bug that bit Sprint 2 (F3.R7 calculator) and Sprint 3 (F2.R8 VariantTable). Y3's autoexport is invasive (generated files in PR diff); Y4's diff bot is review-noise on a 1-contributor project.
- **Implementation note:** ADR-033 + ADR-044 together close the DESIGN.md integration loop.

**Total new ADRs: 11 (ADR-034..ADR-044). Updated ADR count: 44.**

---

## 3. Items NOT locked

None. All 11 ballot items hit quorum.

---

## 4. Convergent additional_findings (≥2 voters → APPLY)

### F1.R10 — Turnstile token verification on Cloudflare Workers (DeepSeek + Gemini + GLM + Codex = 4/5 — STRONGEST CONVERGENT)
- **Severity:** medium (rises to high if mishandled at integration time)
- **What's wrong:** Naive Turnstile integration risks: (a) double-timeout-budget collision — siteverify call + webhook call both need to fit inside the 10s AbortController window mandated by C12 (DeepSeek + Gemini); (b) hostname / cdata mismatch attacks — Cloudflare's siteverify response includes `hostname` and `cdata` fields that must be verified server-side or a misconfigured site key passes traffic (Codex); (c) sequential HTTP latency adds up — typical siteverify is ~500ms, leaving <9.5s for webhook delivery (GLM).
- **Fix (APPLY):** Sprint 4 Turnstile implementation MUST: (1) use a 15s total timeout budget (raise from C12's 10s baseline for the form submission path specifically); (2) parallelize Turnstile siteverify with form payload construction where possible (start both `Promise.all`-style); (3) server-side check `siteverify.success === true AND siteverify.hostname === SITE.url's hostname` — reject on either failure; (4) treat `siteverify.cdata` mismatch as failure if cdata is used for replay protection.

### F2.R10 — IntersectionObserver Safari quirks (DeepSeek + Gemini + GLM = 3/5)
- **Severity:** low-medium (degraded UX, not broken)
- **What's wrong:** v0's SectionNav uses `rootMargin: '-80px 0px -60% 0px'` (negative top + percentage negative bottom). Three Safari-specific gotchas:
  - **Safari <16.4** (GLM): negative `rootMargin` values fail silently — observer fires for all entries with no threshold filtering. Effectively no scroll-spy.
  - **Safari 17+** (DeepSeek): off-by-one rootMargin behavior with percentage bottom margins under sticky positioning.
  - **All browsers** (Gemini): observer needs explicit `disconnect()` on unmount or memory leaks in Next.js App Router environment.
- **Fix (APPLY):** Sprint 4 SectionNav implementation MUST: (1) call `observer.disconnect()` in the useEffect cleanup return; (2) add feature-detection or progressive enhancement — if scroll-spy doesn't fire, the page degrades to all-sections-visible (content still works, just no "current section" highlight); (3) test specifically on Safari 16.4, 17.x, and 18.x during Sprint 4 cleanup.
- **Coverage impact (GLM data):** Safari 16.4+ is 97%+ coverage for US architect demographic per public webstats; Safari <16.4 is the long tail.

---

## 5. Single-voter findings — applied or deferred per merit

| Finding | Voter | Severity | Disposition | Rationale |
|---|---|---|---|---|
| Codex first-round operational risk: schema drift | Claude | medium | **Apply as ongoing watch** | All 4 voter files parsed cleanly. Add validation step to synthesis tooling for future rounds. |
| Cross-item R3 + C4 interaction | Claude | medium | **Moot** | C4 lost (C2 won). |
| C1 (n8n prod) must precede T2 (Turnstile verify) | Claude | low | **Apply** | Sprint 4 commit ordering: n8n migration first, Turnstile integration second, so Turnstile tests against prod webhook. |
| DESIGN.md component placeholder updates | Claude | low | **Apply as Sprint 4 cleanup checklist item** | When SubmittalForm / DocumentLibrary / SectionNav ship, their DESIGN.md placeholder blocks become real token definitions in the same PR. |
| SubmittalForm field-state persistence across 3 steps | DeepSeek | medium | **Apply** | B1 won → state continuity is non-negotiable. Use a single form-state object held in the page component (React Context overkill for 3 steps). |
| Next.js `redirects` + OpenNext compatibility | GLM | low | **Defer** | P2 won (no redirect needed). Note retained for future reference if /pricing strategy ever evolves to P3. |
| hreflang on new Sprint 4 routes (/es/resources, /es/contact, /es/service-areas) | GLM | **high** | **Apply explicitly as constraint C15** | C6 already requires hreflang on every page, but GLM's specific enumeration of the /es/ counterparts is concrete enough to call out. Sprint 4 route scaffolding must include /es variants even if English-only at launch. |
| R3 + C1 pillar page length + SectionNav dependency | GLM | medium | **Apply as Sprint 5 sequencing constraint** | Already captured in ADR-041 implementation note. Pillar page authoring blocked on SectionNav (A1) shipping in Sprint 4 — if A1 slips, pillar ships in degraded scroll-only state. |
| `/pricing` 301 status preservation through Cloudflare | GLM | low | **Defer (P2 won, no redirect)** | Documented for future P3 reactivation if relevant. |
| Turnstile siteverify cdata/hostname mismatches | Codex | medium | **Already absorbed into F1.R10** | Codex's specific hostname-check call is the most actionable item from the convergent F1.R10 cluster — applied verbatim. |

**New convergent constraint C15** (raised by GLM finding, applied per high-severity flag):
- **C15:** Sprint 4 route scaffolding for `/resources`, `/contact`, `/service-areas`, and `/pricing` MUST include their `/es/` counterparts (`/es/resources`, `/es/contact`, `/es/service-areas`, `/es/pricing`) in the route map and hreflang `alternates` Metadata even if the Spanish content is a placeholder pointing to `/es` (Sprint 2 pattern). C6 covered the principle; C15 enforces the specific Sprint 4 route list.

---

## 6. Compliments aggregated (reinforce good patterns)

1. **5-0 unanimous on 5 items (A, F, T, V, Y) — strong project alignment.** Even with a fresh voter (Codex) joining the pool, the architecture-level decisions converged cleanly. The dossier-driven framing of the ballot helped.
2. **Codex's framework-specifics findings were the most operationally actionable** (DeepSeek + GLM + Codex all flagged Turnstile siteverify mechanics in different ways — Codex's hostname/cdata specifics were the most concrete). The new 5th voter is earning its slot.
3. **The 3-2 bare-quorum locks (C, R) reflect honest close-calls**, not weak consensus — the dissenting options (C1 cards-only, R1 per-product installation) are genuinely defensible. The new §8 vote-margin convention is doing its job by surfacing these explicitly.
4. **No voter flagged a ship-blocker risk in any of the 11 options** — 31 prior ADRs + 9 ship-blockers + DESIGN.md are doing their job of constraining the option space before voting begins.

---

## 7. Token + cost summary

| Voter | Prompt tokens | Completion tokens | Cost (USD) |
|---|---|---|---|
| DeepSeek V4 Pro | 7,098 | 2,443 (1,521 reasoning) | $0.0052 |
| Gemini 3.1 Flash Lite | 7,484 | 712 (0 reasoning) | $0.0029 |
| GLM-5.1 | 6,999 | 3,931 (2,675 reasoning) | $0.0204 |
| Codex GPT-5.1 | 6,941 | 1,221 (512 reasoning) | $0.0207 |
| Claude Opus 4.7 (manual) | (in-session) | (in-session) | ~$0.05 est |
| **Total Round 10** | — | — | **~$0.10** |
| **Project cumulative (10 rounds: 8 planning + 2 review)** | — | — | **~$0.67** |

**Codex cost performance:** $0.0207 for the round vs the smoke-test extrapolation of $0.05-0.10. Within projection. Token efficiency on output was lower than DeepSeek (1221 completion vs DeepSeek's 2443 — Codex more concise per item).

---

## 8. Verdict + Action plan

✅ **Round 10 status: COMPLETE — 11/11 items locked. First 5-voter round successful.**

**Sprint 4 immediate work (driven by Round 10 locks):**
1. **Commit ordering (C1 + ADR-035 + ADR-042 dependency):** n8n production webhook migration → Turnstile integration → SubmittalForm 3-step build → /resources page (form + slim 4-doc library) → /contact full page → /pricing stub → /service-areas single page.
2. **Cross-cutting Sprint 4 work:** install Google Labs `design.md` CLI + pre-commit hook (Y2); add C15 /es/ route scaffolding to all new routes; port v0 SectionNav (A1) — usable by Sprint 4 /resources AND Sprint 5 pillar.
3. **Sprint 4 cleanup checklist:** TrustBar audit for IAPMO ER-360 inclusion (V3 + C11); DESIGN.md component blocks updated for SubmittalForm / DocumentLibrary / SectionNav as they ship.

**Sprint 5 work (driven by Round 10 locks):**
1. Subfloor pillar page per C2 + R3 + J1 + V3 — sections in order: Breadcrumbs → Hero → SectionNav → UL Design table → IBC code cards → CBC chapter refs → CSI MasterFormat block → Schedule-risk narrative cards → Installation content → IAPMO ER-360 featured card → Related products → Final CTA.
2. Pillar page ships only after Sprint 4 SectionNav (A1) lands.

**Estimated total Sprint 4 work:** ~22 hours focused (form 6h + SectionNav 3h + library 3h + /service-areas 3h + /pricing stub 1h + Turnstile integration 2h + Y2 setup 3h + TrustBar audit + cleanup 1h).

**Estimated total Sprint 5 work:** ~13 hours (pillar content 10h + installation merge 3h).

**After Sprint 4 ships → Round 11 review** (Sprint 4 audit; will use updated 5-voter pool + 3/5 quorum).

**After Sprint 5 ships → Round 12 review** (Sprint 5 audit + pre-launch ship/hold vote = Phase 5 entry).

---

## 9. Status summary

| Metric | Value |
|---|---|
| Items locked | 11 / 11 |
| Unanimous (5-0) | 5 items (A, F, T, V, Y) |
| Strong majority (4-1) | 4 items (B, E, J, P) |
| Bare quorum (3-2) | 2 items (C, R) |
| New ADRs | 11 (ADR-034..ADR-044) |
| New convergent constraints | 1 (C15 — /es/ scaffolding) |
| Single-voter findings applied | 5 |
| Single-voter findings deferred | 2 (P3-related, both moot) |
| Codex first round | ✅ functional, schema-conformant, useful findings |
| Cost | ~$0.10 |
