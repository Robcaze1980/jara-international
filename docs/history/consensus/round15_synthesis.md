# Round 15 — Synthesis

**Round date:** 2026-05-21
**Voters:** Codex (GPT-5.1), DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1
**Quorum rule:** ≥3/4 simple majority per question
**Total round cost:** ~$0.057 (Codex $0.022 · DeepSeek $0.006 · Gemini $0.003 · GLM $0.027)

---

## Per-question tally

### Q1 — Cement Board promotion deploy gate

**Result: 4/4 unanimous → B (DEFENSIVE_REVERT)** ✅

| Voter | Choice |
|---|---|
| Codex | B |
| DeepSeek | B |
| Gemini | B |
| GLM | B |

**Action**: Roll back only the cement-board promotion. Keep all other improvements deploy-ready (canonical fix, honeypot, email collection, Hidden Joint warning, Roof Sheathing deletion). Re-promote in one commit when Plycem confirms the 6 unsupported US claims.

### Q2 — Fibroxton disposition

**Result: 4/4 unanimous → A (DROP)** ✅

| Voter | Choice |
|---|---|
| Codex | A |
| DeepSeek | A |
| Gemini | A |
| GLM | A |

**Action**: Remove Fibroxton from catalog (same playbook as Roof Sheathing). Add 301 redirect from `/products/fibroxton` to `/`. Update llms.txt, /es page, sitemap, ENVELOPE_DISPLAY_ORDER.

### Q3 — Deck (plank) disposition

**Result: FAILED QUORUM** ⚠️ (no option reached ≥3/4)

| Voter | Choice |
|---|---|
| Codex | A (Keep deprioritized) |
| Gemini | C (Drop) |
| GLM | C (Drop) |
| DeepSeek | B (Consolidate with Deck Modular) |

**Convergent finding**: 3/4 voters want to NOT keep deck plank as a standalone product card. They split on the mechanism — drop entirely (Gemini, GLM) vs. consolidate into `/products/decking` with two variants (DeepSeek). Codex is the lone voice for keep-as-is.

**Recommended Round 15.5 follow-up**: ask the 4 voters specifically between **B (Consolidate)** and **C (Drop)**, with the framing that "keep as standalone" lost to the combined pruning vote. Brief the follow-up with these arguments:
- B (Consolidate) preserves an SEO-relevant slug + working SKU at the cost of unscoped page-design work (DeepSeek noted this).
- C (Drop) is cleaner and faster, parallels the Roof Sheathing playbook, but loses a working compliant product (Gemini/GLM rationale).

**Interim action**: Hold deck plank in place until 15.5 resolves. Do NOT execute either drop or consolidation pending the follow-up vote.

### Q4 — Deck Modular promotion

**Result: 3/4 strong majority → A (LIGHT_PROMOTION — new tier above grid)** ✅

| Voter | Choice |
|---|---|
| Codex | A |
| DeepSeek | A |
| Gemini | A |
| GLM | C (Reorder first-in-grid) |

**Action**: Elevate Deck Modular out of the envelope grid into a third tier ("Specialty / clean compliance niche") visually distinct from the two anchors and the cert-gap grid. GLM's dissent (reorder, not new tier) noted — implementer should consider whether the new tier requires UI design work that justifies its scope.

### Q5 — Plycem follow-up email items

**Per sub-item tally:**

| Sub-item | INCLUDE | SKIP | Margin | Result |
|---|---|---|---|---|
| (i) Allura ESR-3500 for Siding | 4 | 0 | 4/4 unanimous | **INCLUDE** ✅ |
| (ii) Fibroxton ASTM C1186 | 0 | 4 | 4/4 unanimous | **SKIP** ✅ (moot — Fibroxton dropped) |
| (iii) UL 790 Class A for Eureka | 3 | 1 | 3/4 strong majority | **INCLUDE** ✅ |
| (iv) US distribution rights for ESR pursuit | 4 | 0 | 4/4 unanimous | **INCLUDE** ✅ |
| (v) Annual recertification cycle | 4 | 0 | 4/4 unanimous | **INCLUDE** ✅ |

**Action**: Draft `docs/plycem-cert-verification-followup.md` (separate from the already-sent file) with 4 INCLUDE items. Hold until the first email gets a reply — sending a follow-up before the first is acknowledged risks looking pushy.

### Q6 — Corrugated Roof Tile FAQ cleanup

**Result: 4/4 unanimous → C (REPLACE_WITH_OFFSITE — prescriptive US default)** ✅

| Voter | Choice |
|---|---|
| Codex | C |
| DeepSeek | C |
| Gemini | C |
| GLM | C |

**Action**: Edit `data/products.ts:572` to replace the dangling Roof Sheathing reference with the prescriptive US default for low-slope roofs (OSB or plywood sheathing with a separate waterproof membrane).

### Q7 — Siding CertGapWarning update

**Result: 3/4 strong majority → C (WAIT_FOR_PLYCEM)** ✅

| Voter | Choice |
|---|---|
| Codex | A (No change) |
| DeepSeek | C |
| Gemini | C |
| GLM | C |

**Action**: Hold any wording change to the Siding CertGapWarning until Plycem confirms Allura ESR-3500 status. If confirmed active and covers Plycem-manufactured product, rewrite the warning entirely (or drop it). If unconfirmed or disconfirmed, no change is needed — current warning is accurate.

### Q8 — Final catalog count

**Result: 3/4 strong majority → C (6 products)** ✅

| Voter | Count | Path |
|---|---|---|
| Codex | 7 | Drop Fibroxton, keep both Decks separate |
| DeepSeek | 6 | Drop Fibroxton, consolidate Deck+Deck Modular into `/products/decking` |
| Gemini | 6 | Drop Fibroxton, drop Deck plank, keep Deck Modular |
| GLM | 6 | Drop Fibroxton, drop Deck plank, keep Deck Modular |

**Action**: Target catalog of 6 product slugs. **The exact composition is contingent on the Q3 Round 15.5 resolution** — either 6 slugs (if drop) or 6 slugs with one being `/products/decking` (if consolidate).

---

## Overall recommendation tally

| Voter | Overall |
|---|---|
| Codex | REVISE |
| Gemini | REVISE |
| GLM | REVISE |
| DeepSeek | SHIP |

**3/4 → REVISE** — Don't deploy current `main` state until the action items below are addressed.

---

## Q9 reframing summary

Two reframings worth carrying forward:

1. **GLM (echoed implicitly by DeepSeek)**: Q1 conflates the deploy gate with the data-file cleanup. Even with the cement-board promotion reverted (Q1=B), the **6 unsupported US claims still live in `data/products.ts:268-275`** and would surface via llms.txt, structured data schema, and `/api/llm-context`. **This is a separate action** — strip the unsupported claims from the data file regardless of the promotion revert, OR add a TODO marker in the entry so the gap is visible to anyone reading the source.

2. **DeepSeek**: The decking consolidation path (Q3=B) needs page-architecture work (URL structure, variant switching, SEO handling) that wasn't scoped in the round. If 15.5 picks consolidation, schedule a separate design pass before implementation.

3. **GLM (minor)**: Whether to rename "Exterior Cement Board" in the schema to the manufacturer's name "Microconcreto Exterior" for naming consistency with the datasheet. Worth queueing for a future round if Plycem's reply uses one term consistently.

---

## Q10 open items (deduplicated union)

1. **Cement Board claims cleanup in `data/products.ts:268-275`** — strip the 6 unsupported US claims down to what the June 2024 datasheet supports, regardless of the promotion revert. (GLM)
2. **`llms.txt`, sitemap, /es page** — sync with final catalog composition after Fibroxton drop + Q3.5 resolution. (Codex, DeepSeek, GLM)
3. **Deck Modular tier UI design** — if Q4=A holds, the new "Specialty / clean compliance niche" tier needs visual design work (badge, border treatment, copy) to read as "best of the rest" without overcommitting layout. (GLM, DeepSeek)
4. **Plycem reply protocol** — define exactly what changes get made when each Plycem reply scenario lands (cement-board confirmed, cement-board disconfirmed, Allura ESR-3500 active, Allura ESR-3500 inactive, etc.). (DeepSeek)
5. **CertGapWarning copy tone** — review whether all warnings sound educational/helpful rather than purely defensive. (Gemini)
6. **Decking consolidated page architecture** — only if Q3.5 = B (Consolidate). (DeepSeek)

---

## Action list — execute in this order

### Immediate (no Plycem reply needed)

1. **R15-Q1: Defensive revert of cement-board promotion** — move `exterior-cement-board` back into `ENVELOPE_DISPLAY_ORDER`, restore the original `FeaturedProducts.tsx` lead-product intro, remove the second-anchor card. One commit. Message: `R15-Q1: Defensive revert of cement-board second-anchor promotion (4-0 unanimous, pending Plycem verification)`.
2. **R15-Q1-cleanup: Mark cement-board unsupported claims** — per GLM's Q9 reframing, the 6 unsupported claims still live in `data/products.ts:268-275`. Decide between: (a) strip them now (matches the manufacturer's June 2024 datasheet), or (b) leave them in place with a `// TODO: pending Plycem verification — see docs/plycem-cert-verification-email.md` marker. Founder choice; (a) is the more honest move per [CLAUDE.md "no unverified claims"](jara-website/CLAUDE.md).
3. **R15-Q2: Drop Fibroxton from catalog** — remove from `data/products.ts`, `FeaturedProducts.tsx` `ENVELOPE_DISPLAY_ORDER`, `llms.txt`, `/es` page, `_README.md` image checklist. Add 301 redirect in `next.config.mjs` (same pattern as roof-sheathing). One commit. Message: `R15-Q2: Drop Fibroxton from catalog (4-0 unanimous — only Chilean NCh1914 + ISO mfg, no US standard)`.
4. **R15-Q4: Light promotion for Deck Modular** — design + ship the "Specialty / clean compliance niche" tier in `FeaturedProducts.tsx`, between the two anchor cards and the envelope grid. Tier introduces with a brief eyebrow + heading explaining the no-cert-blocker positioning. One commit. Message: `R15-Q4: Promote Deck Modular to clean-compliance tier (3-1 strong majority)`.
5. **R15-Q6: Fix corrugated-roof-tile FAQ stale reference** — edit `data/products.ts:572` per Q6 verdict (replace with OSB/plywood + waterproof membrane). One commit. Message: `R15-Q6: Replace stale Roof Sheathing FAQ ref with prescriptive US default (4-0 unanimous)`.
6. **R15-followup-draft: Draft the Plycem follow-up email** — create `docs/plycem-cert-verification-followup.md` with the 4 INCLUDE items from Q5 (Allura ESR-3500, UL 790 Class A, distribution rights for ESR pursuit, recertification cycle). Hold sending until the first email is acknowledged.

### Round 15.5 follow-up (required to resolve Q3 failed quorum)

7. **Round 15.5 prompt** — ask the 4 voters to choose between B (Consolidate) and C (Drop) for the deck plank. Frame as "Q3 split 1A/1B/2C; rerun without option A." Should be a short 1-question round.

### Held pending Plycem reply

8. **R15-Q7: Siding warning rewrite or removal** — execute only after Plycem confirms or refutes Allura ESR-3500 status (Q5.i was included in the follow-up email). 3/4 voters say wait.
9. **Cement-board re-promotion** — execute only after Plycem confirms the 6 US claims. Re-run the second-anchor commit from this session.
10. **`llms.txt` / sitemap / `/es` page updates** — final pass after the catalog has settled (post-Q3.5 + post-Plycem-reply).

### Optional / future round

11. **CertGapWarning copy tone audit** (Gemini Q10) — separate round.
12. **Naming consistency: "Microconcreto Exterior" vs "Exterior Cement Board"** (GLM Q9) — separate round.
13. **Decking consolidated page architecture** — only if Q3.5 picks Consolidate.

---

## Highest- and lowest-confidence findings across voters

**Highest confidence (convergent across voters)**:
- The cement-board promotion as currently shipped overclaims based on the manufacturer's June 2024 datasheet (Q1 4/4 + DeepSeek's "6 of 7 claims unsupported" + GLM's "honesty discipline violation")
- Fibroxton is undefendable in the US market with its current dossier (Q2 4/4 + every voter cited the missing ASTM C1186)
- The corrugated-roof-tile FAQ stale reference is a clear data-integrity defect (Q6 4/4, GLM called it "the unambiguous one")

**Lowest confidence (divergent / uncertain)**:
- Deck plank's correct disposition (Q3 split 1A/1B/2C — needs 15.5)
- Whether the Allura ESR-3500 is actually still active and covers Plycem-manufactured product (every voter flagged this as the highest-leverage unknown — that's exactly why Q5.i unanimously votes INCLUDE)
- Deck Modular's exact promotional treatment (3/4 say new tier, GLM says first-in-grid is enough)

---

## Notes on voter quality

- **All 4 voters returned valid JSON** with all required fields populated.
- **All 4 voters miscopied `"voter": "codex"`** into the `voter` field instead of their own ID. The wrapper records the actual model name in the outer JSON, so this didn't affect synthesis. Worth noting in any future round prompt to remind voters to set their own ID — add an instruction like "Set `voter` to your own model name, not the schema example."
- **Codex (B-only Q1, A on Q3)** was the most conservative voter this round — protected working SKUs (Deck plank) and historical positioning.
- **GLM** had the sharpest Q9 reframing (separating deploy gate from data cleanup) and the highest-quality Q10 items.
- **DeepSeek** was the only SHIP vote — its reasoning ("everything else is deploy-ready after Q1=B revert") is actually consistent with the other voters' REVISE positions; the disagreement is semantic (does "B revert + cleanups" count as SHIP or REVISE?).
- **Gemini** voted fastest (no reasoning tokens, no chain-of-thought) and had the tersest rationales — its reasoning was sound but offered less detail than the other three.
