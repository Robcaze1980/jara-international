# Round 15.5 — Synthesis

**Round date:** 2026-05-21
**Scope:** Failed-quorum tiebreaker from Round 15 Q3 (deck plank disposition).
**Voters:** Codex (GPT-5.1), DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1
**Quorum rule:** ≥3/4 simple majority
**Total round cost:** ~$0.018 (Codex $0.005 · DeepSeek $0.004 · Gemini $0.001 · GLM $0.008)

---

## Result: 4/4 unanimous → C (DROP)

All four voters chose **C (Drop deck plank entirely)** with **301 redirect to `/products/deck-modular`**.

| Voter | Choice | Redirect | Previous R15 Q3 | Changed |
|---|---|---|---|---|
| Codex | C | /products/deck-modular | A (Keep deprioritized) | ✅ Yes |
| DeepSeek | C | /products/deck-modular | B (Consolidate) | ✅ Yes |
| Gemini | C | /products/deck-modular | C (Drop) | No |
| GLM | C | /products/deck-modular | C (Drop) | No |

Three of the four R15 positions converged to C after R15-Q4's Deck Modular promotion made consolidation visibly harmful to the new tier's positioning. The two voters who held minority positions in R15 (Codex on A, DeepSeek on B) explicitly cited the **R15-Q4 promotion** as the reason their R15.5 calculus changed.

## Convergent rationale across voters

1. **R15-Q4 changes the math.** Consolidating a low-conversion plank with the newly-promoted Deck Modular tile would dilute the clean-compliance niche positioning the previous round just voted to elevate. The two products serve different buyer personas; a combined page would weaken both.

2. **Product-market fit headwind is fundamental.** Heavy, cold fiber-cement plank decking competes against a US composite-decking market (Trex, TimberTech, AZEK) where the dominant products feel warm underfoot. No regulatory documentation closes this gap.

3. **301 to /products/deck-modular** preserves SEO equity for "deck" queries and routes users to the closest functional substitute with documented US demand. Matches the Roof Sheathing + Fibroxton playbook already executed this session.

4. **Founder positioning gain**: "subfloor-as-hero, full envelope" is better served by 6 high-confidence products than 7 with one dead-weight SKU.

## Confidence

| Voter | Confidence |
|---|---|
| Codex | medium |
| DeepSeek | high |
| Gemini | high |
| GLM | high |

3 of 4 high-confidence votes plus 1 medium-confidence — the highest aggregate confidence of any R15 / R15.5 question.

---

## Action

Execute **R15.5-Q3: Drop deck plank slug, redirect to /products/deck-modular**.

- Remove `deck` entry from `data/products.ts`
- Remove `deck` from `FeaturedProducts.tsx` `ENVELOPE_DISPLAY_ORDER`
- Add 301 redirect in `next.config.mjs` (third entry alongside roof-sheathing and fibroxton)
- Remove from `llms.txt`
- Remove from `/es` page
- Update `app/products/page.tsx` description
- Update `lib/site.ts` description
- Update `_README.md` image-checklist
- Update `app/llms-full.txt/route.ts`

Resulting catalog: **6 products** (matches R15-Q8 majority verdict).

1. High Performance Subfloor (anchor)
2. Deck Modular (specialty/clean-compliance tier — R15-Q4)
3. Exterior Hidden Joint (cert-gap)
4. Exterior Cement Board (claims stripped, awaiting Plycem reply)
5. Siding (cert-gap)
6. Corrugated Roof Tile (cert-gap)

## Notes on voter quality

- **All 4 voters returned valid JSON.**
- **GLM, DeepSeek, and Gemini miscopied the `voter` field** (set to "codex" or "gemini"). The wrapper records the actual model name. Worth a prompt-level fix in future rounds — add explicit instruction to set `voter` to the model's actual name.
- **GLM's self-recall of its R15 Q3 vote was incorrect**: GLM stated `previous_r15_q3_vote: A` in R15.5, but its actual R15 vote was C. Confirmed by reading the R15 GLM JSON directly. The error doesn't affect the verdict but indicates voter introspection is unreliable — always verify against the recorded R15 file rather than the R15.5 self-attestation.
- **DeepSeek similarly misreported** `previous_r15_q3_vote: C`, but its actual R15 vote was B. Same pattern.
