# JARA INTERNATIONAL INC. — Website Master Audit

This document is the **master architectural blueprint and state machine** for the JARA International Inc. website redesign.

It tracks: phase status, voter pool, consensus decisions, and the source of truth for what is locked vs. open.

---

## 1. THE COLLABORATIVE MECHANISM

All non-trivial decisions pass through a multi-LLM consensus loop before code is written or shipped. **Quorum rule (from Round 10 onwards): ≥3/5 voters must agree to lock a decision; otherwise status quo holds.** (Rounds 1–9 used the prior 4-voter pool with ≥3/4 quorum — see migration note at end of §2.)

Pattern adapted from Robertson's Ensemble Trading Bot consensus methodology (`AUDIT_CONSENSUS_REVIEW.md`).

### Round structure

1. **Proposal** (Claude Opus 4.7) — Drafts the round prompt with voting items A/B/C…, each with numbered options.
2. **Vote** — 5 voters respond with structured JSON (vote per item + reasoning + any single-voter findings).
3. **Synthesis** (Claude Opus 4.7) — Tally votes, lock items at ≥3/5 quorum, document convergent findings (≥2 voters), defer single-voter findings.
4. **Execution** — Apply locked decisions to code/architecture. Move to next phase.

### Quorum rule (R-CONS-7, inherited from trading bot; pool size updated Round 10)

- **≥3/5 vote for an option** → option is **locked**, applied, no further debate this round
- **2/5 or worse leader, or 2-2-1 split** → **no quorum**, status quo holds, item remains open for future round
- **Convergent findings** (issues flagged by ≥2 voters but not on the ballot) → **applied** as fixes
- **Single-voter findings** → **deferred**, documented in synthesis but not actioned

Note: a 4-1 or 5-0 outcome is "unanimous-or-near-unanimous" and remains the strongest possible lock; a bare 3-2 is the new floor for `locked` status. Synthesis docs should call out the margin so future readers can sense decision confidence.

---

## 2. VOTER POOL

| Voter | Model ID | Role | How invoked | Joined |
|---|---|---|---|---|
| **Claude Opus 4.7** | `claude-opus-4-7` (1M context) | Architecture, brand strategy, Plycem compliance reviewer, prompt drafter, synthesis author | Manual capture in chat session → `roundN_claude.md` | Round 1 |
| **DeepSeek V4 Pro** | `deepseek/deepseek-v4-pro` (OpenRouter) | Quant, technical SEO, structured data | `consensus_call.py` | Round 1 |
| **Gemini 3.1 Flash Lite** | `google/gemini-3.1-flash-lite` (OpenRouter) | Visual design, Stitch integration, Core Web Vitals | `consensus_call.py` | Round 1 |
| **GLM-5.1** | `z-ai/glm-5.1` (OpenRouter) | Anchor, safe stable reasoning | `consensus_call.py` | Round 1 |
| **Codex (GPT-5.1 Codex)** | `openai/gpt-5.1-codex` (OpenRouter) | Code-level critique, implementation-feasibility reviewer, framework/library specifics | `consensus_call.py` | **Round 10** |

**Cost per round:** ~$0.12–0.30 USD total (5-voter pool, includes Codex incremental ~$0.02–0.05).

**Self-id quirk note** (from trading bot Round 3 synthesis): voters may mislabel themselves in the `agent` field of their JSON output. Authoritative attribution = the `model` field at top of each `roundN_*.json` file.

### Voter pool migration note (Round 10)

**Decision:** 2026-05-14 user-strategic — add Codex as 5th voter; apply forward-only (Round 10+); change quorum to 3/5 simple majority.

**Rationale:**
- Codex brings code-implementation-feasibility perspective the existing 4-voter pool lacks (the others are stronger at architecture/design/quant than at framework specifics).
- Forward-only application preserves the 31 ADRs already locked in Rounds 1–9 (re-litigating would cost weeks of code).
- 3/5 simple majority chosen over 4/5 supermajority: lower decision-locking friction during the Sprint 4–5 implementation push when blocking-on-quorum slows shipping. 4-1 / 5-0 outcomes still register as high-confidence locks; the new floor 3-2 surfaces "close calls" honestly in synthesis instead of forcing artificial deferrals.

**Operational change in `consensus_call.py`:** No code change required — the script already accepts any `--model` argument. Codex invocation is just an additional line in each round's runner:

```powershell
python scripts/consensus_call.py `
  --prompt docs/history/consensus/round10_prompt.md `
  --model openai/gpt-5.1-codex `
  --out docs/history/consensus/round10_codex.json `
  --temperature 0.3
```

Verify connectivity before Round 10 by running the above against a placeholder 1-line prompt — costs <$0.01 and confirms the model slug, auth, and response format.

---

## 3. PRE-WORK: PHASE 0 SETUP TASKS

Tasks the user must complete before Round 1 can execute.

### 3.1 DNS / Cloudflare configuration

User owns 2 domains in Cloudflare:
- `jarainternational.com` (canonical, expires 2027-05-07)
- `jaraintl.com` (redirect, expires 2027-03-31)

| Task | Status | Owner |
|---|---|---|
| `jarainternational.com` → A/AAAA records pointing to hosting | ⏳ Pending | User |
| `www.jarainternational.com` → 301 redirect to apex | ⏳ Pending | User |
| `jaraintl.com` → 301 redirect (Bulk Redirect) to `https://jarainternational.com/$1` | ⏳ Pending | User |
| SSL: Full Strict on both | ⏳ Pending | User |
| MX records: Cloudflare Email Routing → Google Workspace (both domains) | ⏳ Pending | User |
| Decide canonical email convention (`info@jarainternational.com` vs `info@jaraintl.com`) | ⏳ Round 1 vote item | — |

### 3.2 OpenRouter API key (for `consensus_call.py`)

User must have `OPENROUTER_API_KEY` set in environment to run consensus rounds. Get one at https://openrouter.ai/keys.

```powershell
# One-time, persistent for current user
[Environment]::SetEnvironmentVariable("OPENROUTER_API_KEY", "sk-or-v1-...", "User")
# Verify
$env:OPENROUTER_API_KEY  # may need new shell after the SetEnvironmentVariable call
```

### 3.3 Claude Code CLI install (required for Cloudflare MCP setup)

User's PowerShell does not have `claude` on PATH. Install globally:

```powershell
npm install -g @anthropic-ai/claude-code
claude --version  # verify
```

### 3.4 Cloudflare MCP servers (5 total)

After 3.3 is done, run these 5 commands to give Claude Code direct access to Cloudflare for DNS, Workers, deployment, observability, and AI Gateway routing:

```powershell
claude mcp add cloudflare-docs --transport sse https://docs.mcp.cloudflare.com/sse -s user
claude mcp add cloudflare-bindings --transport sse https://bindings.mcp.cloudflare.com/sse -s user
claude mcp add cloudflare-builds --transport sse https://builds.mcp.cloudflare.com/sse -s user
claude mcp add cloudflare-observability --transport sse https://observability.mcp.cloudflare.com/sse -s user
claude mcp add cloudflare-ai-gateway --transport sse https://ai-gateway.mcp.cloudflare.com/sse -s user
```

OAuth flow opens browser on first tool use (not at `add` time). Verify with `claude mcp list`.

### 3.5 (Optional) Stitch MCP for visual design (Phase 2)

Defer until Phase 2 begins. Setup at https://stitch.googleapis.com — requires Stitch API key.

---

## 4. THE MASTER ROADMAP

```
PHASE 0    — Foundation                             [Setup tasks above]
PHASE 0.5  — Legacy Site Audit                      [✅ Complete — see docs/audit/]
PHASE 1    — Architecture & Stack                   [Round 1 ← we are here]
PHASE 2    — Visual Design System                   [Round 2 — Stitch enters]
PHASE 3    — Content + SEO/AI Strategy              [Round 3]
PHASE 4    — Implementation Sprints (1 week each)   [Mini-rounds for blockers]
PHASE 5    — Pre-Launch Audit                       [Round 4]
PHASE 6    — Launch + Post-launch (30-day review)   [Round 5]
```

### Phase status

| Phase | Status | Output | Lock date |
|---|---|---|---|
| 0 | ⏳ In progress | Setup checklist (§3) | — |
| 0.5 | ✅ Complete | Legacy audit (35 Plycem violations, 6-product catalog from PDFs) + deep dossier `docs/audit/legacy_v0_dossier.md` (2026-05-14) | 2026-05-10 / 2026-05-14 |
| 1 | ✅ Complete | `round1_synthesis.md` + `round1_5_synthesis.md` — 9/9 items locked | 2026-05-10 |
| 2 | ✅ Complete | Round 2 — 4/4 resolved (3 consensus + 1 user-strategic) | 2026-05-10 |
| 3 | ✅ Complete | Round 3 — 6/6 locked (5 unanimous, 1 at 3/4). Full SEO+AI playbook + sprint checklist | 2026-05-10 |
| 4 | 🔄 Sprints 1–3 ✅ DONE + audited (Round 5 / Round 7 / Round 9). Sprint 4 next (Round 10 planning underway) | Sprint 4 (/resources + /contact + legacy-port items) | 2026-05-10 / 2026-05-10 / 2026-05-11 |
| 5 | ⏸ Blocked on Phase 4 Sprint 4 + 5 | Pre-launch ship/hold vote | — |
| 6 | ⏸ Blocked on Phase 5 | Launch + analytics review | — |

---

## 5. SHIP BLOCKERS — Plycem Compliance (NO VOTE — contractual)

These are forced by the Plycem Distributor Brand Usage Guide and override any consensus vote. They must be true on day 1 of the new site or Plycem can suspend supply / terminate the agreement (Plycem guide p.7).

| # | Constraint | Source |
|---|---|---|
| **SB-1** | Domain MUST NOT contain "PLYCEM" — `plycemca.com` retired, replaced by `jarainternational.com` | Plycem guide p.3 §2.2 |
| **SB-2** | Site brand identity = JARA International Inc. NOT "PlycemCA"/"PlyceCAL"/"Plycem High Performance Subfloor" | Plycem guide p.4 |
| **SB-3** | NO Plycem-vs-USG comparison tables published without prior written approval | Plycem guide p.5 |
| **SB-4** | NO Plycem list prices published ($69-78/panel et al) without authorization | Plycem guide p.4 |
| **SB-5** | NO "PLYCEM" in SEO meta tags / page titles for positioning purposes without approval | Plycem guide p.5 |
| **SB-6** | "Authorized Distributor" / "Distribuidor Oficial" language requires prior written approval | Plycem guide p.5 |
| **SB-7** | Plycem logo only allowed in dedicated "Suppliers / Brands We Distribute" section, with prior approval | Plycem guide p.4 |
| **SB-8** | Footer copyright MUST be "© 2026 JARA International Inc." — NEVER "© The Plycem Company" | Plycem guide p.3 §2.2 |
| **SB-9** | Email addresses MUST use `@jarainternational.com` or `@jaraintl.com` — NEVER `@plycem*` | Plycem guide p.4 |

These ship-blockers are **the floor**. The consensus rounds decide everything **on top of** this floor.

---

## 6. ACTIVE AUDIT LOGS

### [✅ COMPLETE] PHASE 0.5: Legacy Site Audit

**Status:** Completed 2026-05-10 (summary), deepened 2026-05-14 with full file-by-file dossier `docs/audit/legacy_v0_dossier.md`.
**Inputs reviewed:**
- v0 site: 6 pages, 6 custom components, 2 API routes, 53 shadcn/ui components, 4 images
- 10 Plycem PDFs in `PLYCEM_docs/`: 6 Technical Data Sheets + 3 UL/ASTM certificates + 1 IAPMO ER-360
- 2 brand guidelines: JARA Brand Strategy (14 pages), Plycem Distributor Usage (7 pages)

**Key findings (summary — full evidence in `docs/audit/legacy_v0_dossier.md`):**

1. **35 Plycem compliance violations** in v0 site across 9 categories (domain, brand identity, comparisons, prices, SEO, CSI specs, footer claims, inventory claims, video attribution). Dossier §3 confirms 17 of 18 already killed in new site; one (X-14, PDF library scan) requires Sprint 4 re-verification.
2. **6-product catalog** derived from PDFs (vs v0 site's 1 product). Forces multi-product architecture.
3. **UL R15140 covers 20+ Plycem product names** — Jara has wide product runway.
4. **IAPMO ER-360** (valid through 2026-07-31) is the highest-value SEO/B2B asset for US architects.
5. **3 manufacturing origins** (Costa Rica, El Salvador, Honduras) — supports "Global Sourcing" tagline narrative.
6. **13 v0 patterns flagged as KEEP-AND-PORT** (K-1 through K-13 in dossier) — sections 2 of dossier. Highest-priority: SectionNav (K-1), 3-step submittal form (K-2), document-request flow (K-3), CSI spec block (K-4), IBC code-section cards (K-5), UL Design table (K-6).
7. **15 UPGRADE areas** (dossier §4 U-1 through U-15) — ADRs 014–019 + Sprints 2–3 collectively close these; remaining work is *measurement, not implementation*.
8. **Composite quality grade (dossier §5):** v0 4.5/10 → new site current 7.8/10 → post-Sprint-5 9.1/10. New site already exceeds v0 baseline by 3.3 points; Sprint 5 pillar page closes the reference-authority gap.

### [✅ COMPLETE] PHASE 1: Architecture & Stack — Round 1 + Round 1.5

**Status:** Completed 2026-05-10. 9/9 items locked. ~$0.18 total cost.
**Round 1:** [`history/consensus/round1_prompt.md`](history/consensus/round1_prompt.md) → [`round1_synthesis.md`](history/consensus/round1_synthesis.md)
- 5/9 locked at consensus quorum: C, D, E, F, H
- 2/9 user-strategic locks (post-synthesis): B, I
- 2/9 escalated to Round 1.5: A, G

**Round 1.5:** [`history/consensus/round1_5_prompt.md`](history/consensus/round1_5_prompt.md) → [`round1_5_synthesis.md`](history/consensus/round1_5_synthesis.md)
- 2/2 locked unanimously 4/4: A1 (Next.js), G3 (Hybrid SEO)

**Phase 1 close-out checklist:**
- [x] All 9 ADRs identified (see §7 above)
- [ ] ADR files written to `docs/decisions/` (low priority — synthesis docs are authoritative)
- [x] Convergent constraints catalogued (5 cross-cutting items)
- [ ] Next: Phase 2 — Visual Design + Stitch integration

### [✅ COMPLETE] PHASE 2: Visual Design System — Round 2

**Status:** Completed 2026-05-10. 4/4 items resolved (3 unanimous + 1 user-strategic on split).
**Round 2:** [`history/consensus/round2_prompt.md`](history/consensus/round2_prompt.md) → [`round2_synthesis.md`](history/consensus/round2_synthesis.md)
- Hero composition (VA1), Stitch usage (VC3 NO Stitch), Three-panel symbol UI (VD1) all 4/4
- Product card layout (VB1) user-locked after 2-2 split

### [✅ COMPLETE] PHASE 3: Content + SEO/AI Strategy — Round 3

**Status:** Completed 2026-05-10. 6/6 items locked (5 unanimous, 1 at 3/4).
**Round 3:** [`history/consensus/round3_prompt.md`](history/consensus/round3_prompt.md) → [`round3_synthesis.md`](history/consensus/round3_synthesis.md)
- Schema depth (SA2), AI crawler permissions (SB3), Pillar pages (SC2), Local SEO (SD2), FAQ strategy (SF2), Performance (SH2)
- ADRs 014–019 locked

### [🔄 IN PROGRESS] PHASE 4: Implementation Sprints

**Status:** Sprints 1–3 done + audited. Sprint 4 next (Round 10 planning prompt drafting from `docs/audit/legacy_v0_dossier.md` §6 inputs).

#### Sprint 1 ✅ COMPLETE (2026-05-10) — foundation scaffold
- Round 4 (Cloudflare adapter), Round 5 (review) → 2 cleanup commits
- Commit refs: scaffold + `df322e3` (Round 5 cleanup)

#### Sprint 2 ✅ COMPLETE (2026-05-10) — home page composition
- Round 6 (planning, 5 items locked), Round 7 (review, 2-2 split resolved pragmatically)
- 8 components shipped: Hero, ValueProps, FeaturedProducts, TrustBar, MaterialCalculator, FinalCTA, StickyCTABar, SiteFooter
- Commit refs: `c359e85` (build), `1091fa1` (Round 7 cleanup)

#### Sprint 3 ✅ COMPLETE (2026-05-11) — product detail pages
- Round 8 (planning, 5 items locked: PA1 flat table / PB1 inline FAQs / PC1 Jaccard / PD1 email-on-request / PE1 specs-first ordering)
- Round 9 (review, 3/4 ship + 1 F2.R9 OG image params bug found in cleanup)
- 7 components shipped: Breadcrumbs, ProductDetailHero, VariantTable, ComplianceSection, ProductFAQ, RelatedProducts + dynamic OG image route
- 26 hand-authored FAQ items across 6 products (human-reviewed by Robertson before merge)
- Commit refs: `c6e3914` (consensus tooling), `c09ca25` (Sprint 3 build), plus Sprint 3 cleanup commit (this)

#### Sprint 4 🔄 NEXT — /resources + /contact + legacy-port items
- **Round 10 is the first 5-voter round** (Codex joins per §2 migration note).
- Inputs: `docs/audit/legacy_v0_dossier.md` §6 — 24 candidate ballot items; prompt will narrow to 8–10 highest-leverage.
- Voting items to include per Round 9 C7/C8: production secret management + form state persistence
- Builds: 3-step submittal form (calculator URL prefill receiver) + full /contact page (replaces Sprint 2 cleanup stub) + selected K-* legacy-port items

#### Sprint 5 — Subfloor pillar page (ADR-016) + /service-areas (ADR-017)
- Driven by dossier §5.4 — close the reference-authority gap vs v0
- Round 11 plans the content scope (likely C, F, J, R, V items from dossier §6 ballot)

---

## 7. DECISIONS LOCKED (ADRs)

All 9 Phase 1 items locked. ADR files to be written from these locks:

| ADR | Decision | Source |
|---|---|---|
| **ADR-001** Tech stack | Next.js 16 + React 19 + Tailwind + Radix on Cloudflare Pages | Round 1.5 4/4 |
| **ADR-002** Domain | `jarainternational.com` canonical, `jaraintl.com` 301 redirect | Round 1 4/4 |
| **ADR-003** Site architecture | Multi-product Plycem catalog (6 products), schema scaffolds for future multi-brand | Round 1 + user strategic |
| **ADR-004** AI strategy | llms.txt + llms-full.txt + JSON-LD + `/api/llm-context` endpoint | Round 1 4/4 |
| **ADR-005** Lead capture | Calculator (no price) + form + sticky bar (phone + WhatsApp) | Round 1 3/4 |
| **ADR-006** Plycem brand depth | Text-only at launch, logo/badge post-approval via consolidated request | Round 1 4/4 |
| **ADR-007** SEO keywords | Generic at launch, Plycem brand keywords added Phase 4 post-approval | Round 1.5 4/4 |
| **ADR-008** Bilingual | EN full + 1 ES landing page; full ES rollout in Phase 6 | Round 1 3/4 |
| **ADR-009** Email convention | Long canonical domain for all email; personal first-name + role-based pattern | Round 1 + user strategic |
| **ADR-010** Hero composition | Full-bleed photo + dark navy overlay (gradient for AA contrast) | Round 2 4/4 |
| **ADR-011** Stitch integration | NOT used at launch — hand-craft from JARA brand tokens | Round 2 4/4 |
| **ADR-012** Three-panel symbol UI | Logo only (favicon as first post-launch patch) | Round 2 4/4 |
| **ADR-013** Product card layout | VB1 photo-first with brand-compliant generic placeholder fallback | Round 2 + user strategic |
| **ADR-014** Schema.org depth | SA2 — Org + LocalBusiness + Product (sku/mpn/additionalProperty) + FAQ + Breadcrumb + Article + ImageObject + Review | Round 3 3/4 |
| **ADR-015** AI crawler permissions | SB3 — Allow ALL AI crawlers + comprehensive llms.txt | Round 3 4/4 |
| **ADR-016** Pillar pages at launch | SC2 — 1 pillar (Subfloor Guide for Type I/II construction) | Round 3 4/4 |
| **ADR-017** Local SEO depth | SD2 — LocalBusiness schema + dedicated /service-areas page (CA cities) | Round 3 4/4 |
| **ADR-018** FAQ strategy | SF2 — Per-product FAQs + global FAQ, all with FAQPage schema | Round 3 4/4 |
| **ADR-019** Performance targets | SH2 — Excellent CWV (LCP <1.5s, INP <100ms, CLS <0.05) | Round 3 4/4 |
| **ADR-020** Cloudflare adapter | OpenNext (`@opennextjs/cloudflare`) deploy to Workers; Next.js bumped to 16.2.6; Wrangler 4.x | Round 4 user-strategic (split 2-2 → user choice B) |
| **ADR-021** Home calculator UX | HA1 single-screen calculator (no progressive disclosure) | Round 6 4/4 |
| **ADR-022** Home featured products | HB2 top-3 featured with "View all 6 products" link | Round 6 |
| **ADR-023** Home value props | HC1 — 3 props (in-stock + compliance + bilingual support) | Round 6 4/4 |
| **ADR-024** Home section ordering | HD2 — Hero → ValueProps → FeaturedProducts → TrustBar → Calculator → FinalCTA | Round 6 |
| **ADR-025** Sticky CTA bar trigger | HE2 — appears after scroll past hero | Round 6 |
| **ADR-026** Phone strategy | Anna AI agent primary CTA + Robertson direct as secondary; WhatsApp on Robertson number | 2026-05-10 user lock |
| **ADR-027** Product detail variant presentation | PA1 — flat sortable table with WCAG AA scrollable region | Round 8 4/4 |
| **ADR-028** Product FAQ source | PB1 — inline `faqs[]` field on Product type (tiebreak from 2-2 split) | Round 8 + tiebreak §1 |
| **ADR-029** Related products algorithm | PC1 — Jaccard similarity on applications[] with alphabetical-by-slug tiebreak | Round 8 3/4 |
| **ADR-030** Datasheet handling | PD1 — email-on-request CTA (no PDF hosting at launch) | Round 8 4/4 |
| **ADR-031** Product detail section ordering | PE1 — Breadcrumbs → Hero → Variants → Compliance → FAQ → Related → Final CTA | Round 8 4/4 |
| **ADR-032** Voter pool (5-voter, 3/5 quorum) | Add Codex `openai/gpt-5.1-codex` as 5th voter, forward-only from Round 10; quorum lowered from 3/4 to 3/5 simple majority. | 2026-05-14 user-strategic |

**Convergent constraints (cross-cutting, applied as Phase implementation requirements):**
- C1: n8n webhook production migration + domain whitelist update before any form ships (Phase 4 blocker)
- C2: IAPMO ER-360 expiration (2026-07-31) displayed + 90-day renewal reminder (Phase 3)
- C3: Calculator no-currency CI gate during port (Phase 4)
- C4: Single consolidated Plycem approval request with exact meta strings (Phase 5)
- C5: Next.js 16 + Cloudflare Pages RSC smoke test in Phase 1 first sprint (Phase 1)
- C6: hreflang en-US + es-US + x-default on every page (Phase 4 blocker — 4/4 voter convergence)
- C7: GSC + Bing Webmaster verification via Cloudflare DNS TXT records before first deploy (Phase 4 Sprint 1)
- C8: sitemap.xml submission to GSC + Bing on day 1 (Phase 4 Sprint 1)
- C9: Performance data feedback loop scripts stubbed pre-launch, fully activated Month 2+ (Phase 6)
- C10: Sprint 4 `/resources` PDF library must not list any document whose filename or display name contains a price or currency string (per dossier §3 X-14 carry-forward of SB-4)

**Performance Feedback Loop (planned — implementation phased):**
- Pre-launch (Phase 4 Sprint 1): GSC + Bing Webmaster verification (DNS TXT) + sitemap submission + `scripts/pull_gsc.py` stub
- Month 2+ (Phase 6): full pull scripts (GSC, Bing, CF Web Analytics, CF Workers AI-crawler logs) + weekly digest generator + dedicated consensus rounds for data-driven iteration
- Storage: `docs/performance/raw/{source}/{YYYY-MM-DD}.json` (immutable) + `docs/performance/digest/weekly_{date}.md` (human-readable)
- Auth: OAuth service account + API keys via env vars, never committed

---

## 8. CONVENTIONS

- All dates in ISO 8601 (`YYYY-MM-DD`)
- Round artifacts named `roundN_<voter>.{md,json}` and `roundN_synthesis.md`. From Round 10 onwards each round adds a `roundN_codex.json` artifact.
- `MASTER_AUDIT.md` is the single source of truth for phase status — **update it in every sprint cleanup commit** (process note added Round 9 C1 — previous drift cost 2 sprints of stale state)
- Voter prompts live in `docs/history/consensus/`, never modified after sent (immutable)
- Synthesis docs reference vote files by exact filename for reproducibility
- Synthesis docs MUST call out the vote margin (e.g., "locked 5-0 unanimous" vs "locked 3-2 bare quorum") so confidence is visible to future readers (added Round 10 with the 3/5 quorum change)
