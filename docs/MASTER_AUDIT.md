# JARA INTERNATIONAL INC. — Website Master Audit

This document is the **master architectural blueprint and state machine** for the JARA International Inc. website redesign.

It tracks: phase status, voter pool, consensus decisions, and the source of truth for what is locked vs. open.

---

## 1. THE COLLABORATIVE MECHANISM

All non-trivial decisions pass through a multi-LLM consensus loop before code is written or shipped. **Quorum rule: ≥3/4 voters must agree to lock a decision; otherwise status quo holds.**

Pattern adapted from Robertson's Ensemble Trading Bot consensus methodology (`AUDIT_CONSENSUS_REVIEW.md`).

### Round structure

1. **Proposal** (Claude Opus 4.7) — Drafts the round prompt with voting items A/B/C…, each with numbered options.
2. **Vote** — 4 voters respond with structured JSON (vote per item + reasoning + any single-voter findings).
3. **Synthesis** (Claude Opus 4.7) — Tally votes, lock items at ≥3/4 quorum, document convergent findings (≥2 voters), defer single-voter findings.
4. **Execution** — Apply locked decisions to code/architecture. Move to next phase.

### Quorum rule (R-CONS-7, inherited from trading bot)

- **≥3/4 vote for an option** → option is **locked**, applied, no further debate this round
- **2/4 leader, 2/4 split or other** → **no quorum**, status quo holds, item remains open for future round
- **Convergent findings** (issues flagged by ≥2 voters but not on the ballot) → **applied** as fixes
- **Single-voter findings** → **deferred**, documented in synthesis but not actioned

---

## 2. VOTER POOL

| Voter | Model ID | Role | How invoked |
|---|---|---|---|
| **Claude Opus 4.7** | `claude-opus-4-7` (1M context) | Architecture, brand strategy, Plycem compliance reviewer | Manual capture in chat session → `roundN_claude.md` |
| **DeepSeek V4 Pro** | `deepseek/deepseek-v4-pro` (OpenRouter) | Quant, technical SEO, structured data | `consensus_call.py` |
| **Gemini 3.1 Flash Lite** | `google/gemini-3.1-flash-lite` (OpenRouter) | Visual design, Stitch integration, Core Web Vitals | `consensus_call.py` |
| **GLM-5.1** | `z-ai/glm-5.1` (OpenRouter) | Anchor, safe stable reasoning | `consensus_call.py` |

**Cost per round:** ~$0.10–0.25 USD total.

**Self-id quirk note** (from trading bot Round 3 synthesis): voters may mislabel themselves in the `agent` field of their JSON output. Authoritative attribution = the `model` field at top of each `roundN_*.json` file.

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
| 0.5 | ✅ Complete | Legacy audit (35 Plycem violations, 6-product catalog from PDFs) | 2026-05-10 |
| 1 | ✅ Complete | `round1_synthesis.md` + `round1_5_synthesis.md` — 9/9 items locked | 2026-05-10 |
| 2 | ✅ Complete | Round 2 — 4/4 resolved (3 consensus + 1 user-strategic) | 2026-05-10 |
| 3 | ✅ Complete | Round 3 — 6/6 locked (5 unanimous, 1 at 3/4). Full SEO+AI playbook + sprint checklist | 2026-05-10 |
| 4 | 🔄 Sprint 1 ✅ COMPLETE + reviewed (Round 5) | Sprint 2 next | 2026-05-10 (Sprint 1) |
| 5 | ⏸ Blocked on Phase 4 | Pre-launch ship/hold vote | — |
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

**Status:** Completed 2026-05-10
**Inputs reviewed:**
- v0 site: 6 pages, 6 custom components, 2 API routes, 53 shadcn/ui components, 4 images
- 10 Plycem PDFs in `PLYCEM_docs/`: 6 Technical Data Sheets + 3 UL/ASTM certificates + 1 IAPMO ER-360
- 2 brand guidelines: JARA Brand Strategy (14 pages), Plycem Distributor Usage (7 pages)

**Key findings (full detail to be moved to `docs/audit/*.md`):**

1. **35 Plycem compliance violations** in v0 site across 9 categories (domain, brand identity, comparisons, prices, SEO, CSI specs, footer claims, inventory claims, video attribution).
2. **6-product catalog** derived from PDFs (vs v0 site's 1 product). Forces multi-product architecture.
   - High Performance Subfloor (4 thicknesses)
   - Roof Sheathing (2 thicknesses)
   - Deck (planks)
   - Exterior Hidden Joint (5 thicknesses)
   - Exterior Cement Board (1 thickness, fiberglass mesh)
   - Fibroxton (1 thickness, contains wood)
3. **UL R15140 covers 20+ Plycem product names** — Jara has wide product runway.
4. **IAPMO ER-360** (valid through 2026-07-31) is the highest-value SEO/B2B asset for US architects.
5. **3 manufacturing origins** (Costa Rica, El Salvador, Honduras) — supports "Global Sourcing" tagline narrative.
6. **18 technical debt items** in v0 stack (orange theme conflicts JARA navy, Space Grotesk vs Montserrat, hardcoded data, no JSON-LD, no llms.txt, duplicate hooks, n8n webhook in test mode, etc.).

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

### [🔄 NEXT] PHASE 2: Visual Design System

**Status:** Ready to begin
**Pre-requisites met:** Stack locked (A1 Next.js + Tailwind), brand identity defined (JARA navy/steel-blue palette, Montserrat/Inter typography), product catalog defined (6 products from Plycem PDFs), user-provided visuals workflow established.
**Owner of voter prompt:** Claude Opus 4.7 to draft `round2_prompt.md` covering: hero treatment, typography display choice, product card pattern, iconography library, three-panel symbol motif treatment, Stitch integration go/no-go.

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

**Performance Feedback Loop (planned — implementation phased):**
- Pre-launch (Phase 4 Sprint 1): GSC + Bing Webmaster verification (DNS TXT) + sitemap submission + `scripts/pull_gsc.py` stub
- Month 2+ (Phase 6): full pull scripts (GSC, Bing, CF Web Analytics, CF Workers AI-crawler logs) + weekly digest generator + dedicated consensus rounds for data-driven iteration
- Storage: `docs/performance/raw/{source}/{YYYY-MM-DD}.json` (immutable) + `docs/performance/digest/weekly_{date}.md` (human-readable)
- Auth: OAuth service account + API keys via env vars, never committed

---

## 8. CONVENTIONS

- All dates in ISO 8601 (`YYYY-MM-DD`)
- Round artifacts named `roundN_<voter>.{md,json}` and `roundN_synthesis.md`
- `MASTER_AUDIT.md` is the single source of truth for phase status — update it when status changes
- Voter prompts live in `docs/history/consensus/`, never modified after sent (immutable)
- Synthesis docs reference vote files by exact filename for reproducibility
