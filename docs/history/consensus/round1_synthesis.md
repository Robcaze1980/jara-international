# Round 1 — Synthesis (Architecture & Stack)

**Date:** 2026-05-10
**Type:** Foundational architecture consensus
**Voters captured:** Claude Opus 4.7, Gemini 3.1 Flash Lite, GLM-5.1, DeepSeek V4 Pro (4/4)
**Quorum rule:** ≥3/4 per item (R-CONS-7)
**Prompt:** [`round1_prompt.md`](round1_prompt.md)
**Vote files:** [`round1_claude.md`](round1_claude.md), [`round1_gemini.json`](round1_gemini.json), [`round1_glm.json`](round1_glm.json), [`round1_deepseek.json`](round1_deepseek.json)

---

## 1. Vote tally

| Item | Claude (Opus 4.7) | Gemini (3.1 FL) | GLM-5.1 | DeepSeek (V4 Pro) | Tally | Quorum? | **Action** |
|---|---|---|---|---|---|---|---|
| **A** Tech stack | A1 | A2 | A2 | A3 | A1=1, **A2=2**, A3=1 | ❌ no quorum (max 2/4) | **Round 1.5 needed** |
| **B** Architecture | B2 | B2 | B3 | B3 | B2=2, B3=2 | ❌ split 2-2 | **Strategic call to user** |
| **C** Domain | C1 | C1 | C1 | C1 | **C1=4** | ✅ 4/4 | **🔒 LOCK C1** |
| **D** AI strategy | D2 | D2 | D2 | D2 | **D2=4** | ✅ 4/4 | **🔒 LOCK D2** |
| **E** Lead capture | E2 | E3 | E3 | E3 | E2=1, **E3=3** | ✅ 3/4 | **🔒 LOCK E3** |
| **F** Plycem brand depth | F3 | F3 | F3 | F3 | **F3=4** | ✅ 4/4 | **🔒 LOCK F3** |
| **G** SEO keywords | G1 | G1 | G3 | G3 | G1=2, G3=2 | ❌ split 2-2 | **Round 1.5 needed** |
| **H** Bilingual | H1 | H3 | H3 | H3 | H1=1, **H3=3** | ✅ 3/4 | **🔒 LOCK H3** |
| **I** Email convention | I3 | I1 | I3 | I1 | I1=2, I3=2 | ❌ split 2-2 | **Strategic call to user** |

**Verdicts:** Gemini=ship, DeepSeek=ship, Claude=revise, GLM=revise. **2-2 split → no quorum on verdict** → respect the revise voices and resolve open items before declaring Round 1 closed.

---

## 2. Locked decisions (5 items at quorum)

These become ADRs immediately:

### 🔒 ADR-002 — Canonical domain: `jarainternational.com`
- **Vote:** C1, 4/4
- **Decision:** `jarainternational.com` is canonical for the public site. `jaraintl.com` 301-redirects to canonical. Both can route to the same email inbox via Cloudflare Email Routing.
- **Rationale:** Matches legal entity name and JARA brand guideline wordmark; consolidates SEO link equity.

### 🔒 ADR-004 — AI-friendly strategy: D2 (llms-full.txt + LLM-context API)
- **Vote:** D2, 4/4
- **Decision:** `/llms.txt` + `/llms-full.txt` + JSON-LD (Organization/Product/FAQPage/BreadcrumbList) + public `/api/llm-context` endpoint exposing structured product data.
- **Rationale:** Maximum LLM citation visibility without operational risk of a chatbot or prematurity of an MCP server.

### 🔒 ADR-005 — Lead capture: E3 (calculator + form + sticky bar)
- **Vote:** E3, 3/4
- **Decision:** Home page features the ported material calculator (input SF + construction type → estimated panels, NO PRICE per SB-4) with email capture for full quote, plus E2's sticky bottom bar with phone + WhatsApp Business.
- **Rationale:** High-value contractor utility, complies with SB-4 by omitting prices, leverages already-built calculator from legacy site.
- **Dissent (Claude voted E2):** Calculator is acceptable IF the no-price constraint is rigorously enforced. See convergent finding F3.

### 🔒 ADR-006 — Plycem brand presence: F3 (text-only day 1, logo post-approval)
- **Vote:** F3, 4/4 — strongest unanimous decision of the round
- **Decision:** No Plycem logo at launch. Text mentions only ("We distribute PLYCEM Cement Board for…"). Submit consolidated approval request to Plycem post-launch; logo and "Authorized Distributor" badge added in controlled post-launch update once approval received.
- **Rationale:** Avoids blocking launch on Plycem's 5-business-day approval cycle; nominative/fair-use brand mention is defensible without prior approval.

### 🔒 ADR-008 — Bilingual scope at launch: H3 (EN primary + ES landing only)
- **Vote:** H3, 3/4
- **Decision:** Full English site at launch + a single Spanish landing page (`/es`) summarizing core value prop and contact, targeted at US Hispanic construction labor market. Full ES content rollout deferred to Phase 6+.
- **Rationale:** Acknowledges the secondary US Hispanic audience without doubling Phase 4 sprint cost; validates i18n routing scaffold for later expansion.
- **Dissent (Claude voted H1):** Acceptable — Claude's H1 was reluctant and noted Spanish-priority for Phase 6.

---

## 3. Items without quorum — require resolution

### Item A — Tech stack (split 1/2/1/0)
- **Tally:** A1 (Next.js)=1, A2 (Astro)=2, A3 (Next.js+Payload)=1, A4 (SvelteKit)=0
- **Why no quorum:** 3 different stacks proposed. A2 leader at 2/4 is not enough.
- **Strategic vs technical:** **Pure technical** — should NOT be sent to user. Needs Round 1.5 with narrowed options.
- **Round 1.5 ballot:** Drop A4 (zero votes). Add framing question: "Given multi-brand catalog (B3 likely) + content management need + 4 React components to port, choose between A1 (Next.js, port React directly), A2 (Astro, port as islands), or A3 (Next.js+Payload CMS, non-dev editing)."

### Item B — Site architecture (split 2-2)
- **Tally:** B2 (multi-product Plycem)=2, B3 (multi-brand catalog)=2, B1 (single-product)=0
- **Why no quorum:** Voters split on whether to scaffold for future suppliers from day 1.
- **Strategic vs technical:** **STRATEGIC** — this is a brand positioning question. **Send to user.**
- **Question for user:** _Is JARA always going to distribute only Plycem, or do you intend to onboard additional fiber-cement suppliers (e.g., Eternit, James Hardie alternatives, regional manufacturers) within 12-24 months?_
  - If **only Plycem**: B2 wins — multi-product Plycem catalog
  - If **multiple suppliers planned**: B3 wins — multi-brand catalog with Plycem as first

### Item G — SEO keywords (split 2-2)
- **Tally:** G1 (generic-first only)=2, G3 (hybrid: generic at launch, Plycem in body post-approval)=2
- **Why no quorum:** Both paths comply with SB-5 at launch; difference is whether to commit to a path for adding Plycem brand keywords later.
- **Strategic vs technical:** **TECHNICAL** — should NOT be sent to user. Needs Round 1.5.
- **Round 1.5 ballot:** Reframed as "Do we plan a Phase 4 sprint for Plycem brand keyword rollout once approval received (G3) or skip Plycem brand keywords entirely (G1)?"

### Item I — Email convention (split 2-2)
- **Tally:** I1 (`info@jarainternational.com` only)=2, I3 (both, role-based)=2, I2=0
- **Why no quorum:** Voters split on whether short domain is for personal vs all addresses on canonical.
- **Strategic vs technical:** **STRATEGIC** — naming convention reflects business style preference. **Send to user.**
- **Question for user:** _Do you prefer all email to live on the long professional domain (`info@jarainternational.com`, `sales@jarainternational.com`) for maximum corporate consistency, OR do you want personal/dictation-friendly addresses on the short domain (`rob@jaraintl.com`) alongside formal role addresses on the long one?_

---

## 4. Convergent additional findings (≥2 voters → APPLY)

### F1 — n8n webhook needs production migration + domain update (Claude + GLM, both severity=blocker)
- **Detail:** Both salvageable forms (submittal + document-request) POST to `https://8n8-n8n.80r4dr.easypanel.host/webhook-test/...`. The path `webhook-test` is n8n's test mode (must be `webhook/{id}` for prod). The `source: "plycemca.com"` field hardcoded in payloads must change. CORS/origin validation needs to allow `jarainternational.com`.
- **Status:** ⚠️ Applied as **Phase 4 blocker**. No form ships to production until: (a) n8n workflows activated to prod path, (b) source field updated, (c) origin validation whitelists new domain.

### F2 — IAPMO ER-360 expiration risk (Gemini + GLM, severity=high/medium)
- **Detail:** ER-360 expires 2026-07-31. Site must display expiration date alongside the document and surface a renewal-tracking signal. Distributing expired compliance docs undermines AHJ credibility.
- **Status:** ⚠️ Applied as **Phase 3 deliverable**. Implementation: (a) all certificate PDFs displayed with "Valid through:" label; (b) calendar reminder for JARA team to request Plycem renewal 90 days before expiry; (c) automated banner if doc within 30 days of expiry.

### F3 — Calculator no-price compliance hardening (Gemini explicit + DeepSeek+GLM via E3 vote rationale)
- **Detail:** The ported material calculator must be audited line-by-line to ensure NO output, hint, or implication of Plycem list prices (SB-4 violation if found). Output limited to: estimated panel count, panel weight, suggested thickness based on application type, and CTA to "Request Quote." Unit conversion imperial↔metric required (Gemini finding).
- **Status:** ⚠️ Applied as **Phase 4 implementation requirement** for the calculator port. Code review checkpoint: a passing build must include a test asserting calculator outputs contain no currency strings, no `$`, no "price", no "cost".

### F4 — Plycem approval consolidated request strategy (GLM explicit + Claude implicit via F3/G1 voting)
- **Detail:** F3 and G1/G3 outcomes all defer Plycem brand assets (logo, "Authorized Distributor" claim, brand keywords in SEO meta) to post-launch. JARA needs a single consolidated approval request to Plycem covering: logo use in `/suppliers`, "Authorized Distributor" claim eligibility, SEO meta inclusion of "PLYCEM" brand. Submitting these piecemeal multiplies the 5-day approval cycle.
- **Status:** ⚠️ Applied as **Phase 5 (pre-launch) deliverable**. Single consolidated email to Andrés Castillo (Plycem Mercadeo, per Plycem guide p.7) with all 3 requests + mockups + intended URL placements.

---

## 5. Single-voter findings — deferred (documented, not actioned this round)

| Finding | Voter | Severity | Disposition |
|---|---|---|---|
| Privacy Policy + CCPA cookie banner for lead forms | DeepSeek | Medium | Defer to Phase 4 — standard requirement, not architecture-shaping |
| LocalBusiness JSON-LD + Google Maps for Long Beach warehouse | DeepSeek | High | Defer to Phase 3 — strong signal, but covered under D2 implementation scope |
| CMS versioning for PDF-derived tech specs | DeepSeek | Medium | Conditional on Item A outcome (only relevant if A3 wins) |
| Astro 5 Cloudflare adapter SSR verification | GLM | Medium | Conditional on Item A outcome (only relevant if A2 wins) |
| Product codes (960140 etc.) as JSON-LD `sku`/`mpn` | GLM | Medium | Defer to Phase 3 — natural part of D2 implementation |
| "© Plycem Company" footer ban | Claude | Blocker | Already covered by ship blocker SB-8; no new action |
| Hero `#e7ff00` chartreuse violation | Claude | High | Already covered by JARA brand guide §12; no new action — design system in Phase 2 will eliminate |
| 3 manufacturing origins (CR/SV/HN) as storytelling asset | Claude | Medium | Defer to Phase 3 — content/copy decision |
| Cloudflare AI Gateway routing for cost reduction | Claude | Low | Defer to Phase 0 setup — already documented in MASTER_AUDIT §3.4 |
| Spanish-language priority for Phase 6 | Claude | Medium | Implicit in H3 lock; explicitly add to Phase 6 backlog |

---

## 6. Token + cost summary

| Voter | Prompt tokens | Completion tokens | Cost (USD) |
|---|---|---|---|
| Gemini 3.1 Flash Lite | 3,409 | 673 | $0.0018 |
| DeepSeek V4 Pro | 3,164 | 3,360 | $0.0043 |
| GLM-5.1 | 3,150 | 3,043 | $0.0138 |
| Claude Opus 4.7 (manual) | (in-session) | (in-session) | ~$0.10 est. |
| **Total** | — | — | **~$0.12** |

---

## 7. Verdict

**Round 1 status: PARTIAL — 5 items locked, 4 items open.**

✅ **Locked (5):** C (domain), D (AI strategy), E (lead capture), F (Plycem brand depth), H (bilingual scope)
🔓 **Open (4):**
- **A (stack)** → Round 1.5 with narrowed options (drop A4)
- **B (architecture)** → Strategic question to user
- **G (SEO keywords)** → Round 1.5 with reframed question
- **I (email convention)** → Strategic question to user

⚠️ **4 convergent findings applied** as constraints on future phases (n8n migration, ER-360 expiration handling, calculator no-price audit, Plycem consolidated approval request).

**Recommended next steps:**
1. **User answers 2 strategic questions** (B and I above) — see §3.
2. **Round 1.5** runs for items A and G with refined ballot (~$0.05 cost).
3. After 1.5 synthesis, all 9 items locked → ADRs written → proceed to Phase 2 (Visual Design + Stitch).

---

## 9. User strategic resolutions (post-synthesis, 2026-05-10)

User resolved 2 of the 4 open items via direct strategic input. These are NOT consensus locks but user-strategic locks (per the user's stated decision-making model: technical decisions → consensus, strategic decisions → user).

### 🔒 ADR-003 — Site architecture: B2 (multi-product Plycem catalog)
- **User input:** "en los proximos 6-12 meses solo Plycem"
- **Decision:** Multi-product Plycem catalog with 6 product detail pages (Subfloor, Roof Sheathing, Deck, Exterior Hidden Joint, Exterior Cement Board, Fibroxton) + ~20 SKUs across thicknesses/codes.
- **Architecture constraint:** Data shape and route structure must allow non-rewrite migration to B3 (multi-brand) when/if additional suppliers are onboarded post-12-month horizon. Implementation: product schema includes `supplier` field (defaulted to "Plycem"), routes scaffold `/products/{slug}` not `/plycem/{slug}`.
- **Resolves consensus split:** B2=2 vs B3=2. User strategic call wins per decision-making model.

### 🔒 ADR-009 — Email convention: I1 with personal-name pattern
- **User input:** "ya tengo un email: robert@jarainternational.com"
- **Decision:** All email lives on the long canonical domain `jarainternational.com`. Pattern: personal first-name addresses for owners/managers (e.g., `robert@`), role-based addresses for shared inboxes (`info@`, `sales@`, `technical@`). Short domain `jaraintl.com` MX routes to the same mailbox via Cloudflare Email Routing for redundancy and dictation convenience, but is not the canonical email home.
- **Resolves consensus split:** I1=2 vs I3=2. User strategic call wins per decision-making model.

### Status update for §3 open items

| Item | Round 1 status | Post-§9 status |
|---|---|---|
| A — Stack | ❌ no quorum (1/2/1) | 🔓 Pending Round 1.5 |
| B — Architecture | ❌ split 2-2 | 🔒 **LOCKED B2** (user strategic) |
| G — SEO keywords | ❌ split 2-2 | 🔓 Pending Round 1.5 |
| I — Email | ❌ split 2-2 | 🔒 **LOCKED I1** (user strategic) |

**Round 1 cumulative locks: 7/9 items.** Remaining for Round 1.5: A (stack), G (SEO keywords).

---

## 8. Self-id quirk note (carries over from trading bot Round 3)

All 3 OpenRouter voters mislabeled themselves in their content's `agent` field:
- DeepSeek V4 Pro → labeled itself "Architect Agent (Claude Opus 4.7)"
- Gemini 3.1 Flash Lite → labeled itself "Gemini 3 Pro" (close, but not the actual model used)
- GLM-5.1 → labeled itself "Claude Opus 4.7"

**Authoritative attribution = the `model` field at the top of each `roundN_*.json` file** (set by `consensus_call.py` from the `--model` argument). This is consistent with the trading bot Round 3 observation (`round3_synthesis.md`).
