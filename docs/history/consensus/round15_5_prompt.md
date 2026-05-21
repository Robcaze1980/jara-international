# Round 15.5 — Deck Plank Disposition Tiebreaker

**Type:** Failed-quorum follow-up from Round 15 Q3. Single question rerun.

**Voters (4):** Codex (GPT-5.1), DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1.
**Claude is NOT a voter** (per CLAUDE.md governance).
**Quorum:** ≥3/4 simple majority. If 15.5 also fails to reach quorum, founder decides directly.
**Round date:** 2026-05-21.

---

## 0. WHY THIS ROUND EXISTS

Round 15 Q3 ("Deck plank disposition") split 1A / 1B / 2C with no option reaching ≥3/4. The convergent finding was that **3/4 voters want to NOT keep deck plank as a standalone product card** — they split only on the mechanism. This round eliminates option A (keep deprioritized) and asks for a clean B-vs-C choice.

The Round 15 Q3 ratios were:
- A (Keep deprioritized): Codex
- B (Consolidate with Deck Modular into `/products/decking`): DeepSeek
- C (Drop entirely): Gemini, GLM

For full context including the original prompt, see `docs/history/consensus/round15_prompt.md` and `docs/history/consensus/round15_synthesis.md`.

---

## 1. THE PRODUCT IN QUESTION

`/products/deck` — Plycem Deck plank system. `data/products.ts:163-205`.

**Compliance on file (honest, no overclaim):**
- ASTM C1186-08 Type A
- ISO 8336:2018
- ASTM E-84 (FSI 0, SDI 0)

**Form factor:** 30mm × 150mm × 3657mm planks. Hidden stainless-steel clip installation. Max 16" o.c. joist spacing. 2 SKUs.

**US regulatory standing:**
- IRC R507 / IBC 1607 govern decking; prescriptive listing is wood / wood-composite.
- No ICC-ES ESR. Trex carries ESR-2645 family as the bar.
- Fiber-cement plank decking requires IBC 104.11 alternative-materials approval per project.

**Market headwind:**
- US residential deck market is dominated by Trex / TimberTech / AZEK composites.
- Fiber-cement plank decking is *heavier* than wood/composite and feels cold/hard underfoot — fundamental product-market fit problem for residential.
- Honest material claims, no overclaim, but very low conversion likelihood.

**Companion product:**
- `/products/deck-modular` — interlocking 300×300×14mm fiber-cement tiles. No regulatory blocker (finish tiles don't require ESR). Genuine US niche (rooftop terraces, balconies). Round 15 Q4 voted 3/4 to promote it out of the envelope grid into a "Specialty / clean compliance niche" tier.

---

## 2. THE TWO OPTIONS

### Option B — Consolidate into `/products/decking`

Merge `/products/deck` and `/products/deck-modular` into a single page with two variant sections. URL: `/products/decking`. Two slugs in the data file consolidate to one with variant metadata.

**Pros (DeepSeek's R15 rationale):**
- Reduces catalog clutter for the lowest-conversion segment
- Retains both compliant products under one navigable URL
- Preserves the SEO-relevant slug and working SKU for deck plank

**Cons:**
- Unscoped page-architecture work: URL structure, variant selector, JSON-LD for two products under one URL, sitemap handling, /es page mapping
- Dilutes Deck Modular's "clean compliance niche" positioning (Round 15 Q4 just voted to promote it visually)
- Mixed messaging: combining a low-conversion plank with a niche-strong tile under one page may pull Deck Modular down rather than lift Deck plank up

### Option C — Drop deck plank entirely

Remove the `deck` slug from `data/products.ts`. Add 301 redirect from `/products/deck` to `/products/deck-modular` (since Deck Modular is the closest functional substitute — outdoor fiber-cement flooring). Update llms.txt, /es page, sitemap, `ENVELOPE_DISPLAY_ORDER`. Same playbook as Roof Sheathing + Fibroxton.

**Pros (Gemini/GLM's R15 rationale):**
- Cleanest catalog: every remaining product justifies its slot
- Preserves Deck Modular's "clean compliance niche" tier without dilution
- Faster to execute (parallels the Roof Sheathing + Fibroxton playbook already in motion this session)
- Removes a product with severe product-market fit headwinds in the US market

**Cons:**
- Loses a working compliant product with honest material claims
- Deck plank's specific use cases (commercial outdoor walkways, mountain/coastal long-grain plank applications, drained floors in industrial contexts) aren't covered by Deck Modular alone
- Permanent — re-adding later means re-creating the data entry, copy, schema, etc.

---

## 3. CONSTRAINTS — DO NOT vote against these

- **A (Keep deprioritized) is OFF the table.** Round 15 already established 3/4 against keep-as-standalone. Voters MUST choose B or C.
- **Deck Modular stays in the catalog and gets the Round 15 Q4 promotion** regardless of this round's outcome.
- **No price emissions** in any proposed schema (ship blocker SB-4).
- **Decision must include the 301 redirect destination** in the rationale if voting C. (Options: redirect to `/products/deck-modular`, to `/`, or to a new `/products/decking` page if voting B.)

---

## 4. QUESTION TO ADJUDICATE

### Q3 (rerun) — Deck plank: Consolidate or Drop?

Pick ONE:

- **B. CONSOLIDATE** into `/products/decking` with deck + deck-modular as two variant sections.
- **C. DROP** deck plank slug entirely; 301 redirect to a specified destination.

Return a 3–6 sentence rationale addressing:
1. Why this option better serves the founder-locked positioning ("subfloor-as-hero, full envelope, US distributor, direct factory shipping")
2. What you would do with the resulting page-architecture work (B) or what the 301 destination should be (C)
3. Whether the Round 15 Q4 promotion of Deck Modular changes your calculus from your Round 15 Q3 vote (if applicable — Codex, DeepSeek, Gemini, GLM each had different R15 Q3 votes)

---

## 5. RESPONSE SCHEMA

Return a single JSON object:

```json
{
  "voter": "your model name (codex|deepseek|gemini|glm)",
  "round": "15.5",
  "date_iso": "2026-05-21",
  "verdict": {
    "choice": "B|C",
    "redirect_destination_if_C": "/products/deck-modular | / | other (specify)",
    "consolidation_url_if_B": "/products/decking | other (specify)",
    "rationale": "3–6 sentences..."
  },
  "changed_from_r15": true | false,
  "previous_r15_q3_vote": "A|B|C",
  "confidence": "high|medium|low"
}
```

Return **only** the JSON object — no markdown fence, no preface, no trailing prose.
