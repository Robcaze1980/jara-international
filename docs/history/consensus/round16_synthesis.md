# Round 16 — Synthesis: Price Promotion Rollout

**Round date:** 2026-07-09
**Voters:** Codex (GPT-5.1), DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1 (Claude not a voter).
**Quorum rule:** ≥3/4 per item.
**Overall recommendation:** **SHIP — unanimous 4/4.**

> Attribution note: some voters echoed the schema's example `voter` value in their
> body. Votes are attributed by the OpenRouter `model` field of each file, not the
> self-reported name.

---

## Vote tally

| Q | Topic | Codex | DeepSeek | Gemini | GLM | Result |
|---|---|---|---|---|---|---|
| Q1 | Price format | C | C | C | C | **C — 4-0 unanimous** (per-panel + per-SF) |
| Q2 | Surfaces | C | C | C | C | **C — 4-0 unanimous** (/pricing + product pages + hero hook) |
| Q3 | JSON-LD schema | A | B | C | B | **FAILED QUORUM — 2-1-1** (B plurality) |
| Q4 | Honesty caveats (i–v) | all IN | all IN | all IN | all IN | **All 5 INCLUDE — 4-0 unanimous** |
| Q5 | Leading-brand placement | C | C | C | B | **C — 3-1 strong** (GLM dissent) |
| Q6 | Quote-only products | A | A | A | A | **A — 4-0 unanimous** (visual-parity CTA) |
| Q7 | Lead capture | C | C | C | C | **C — 4-0 unanimous** (static CTA + calculator-to-lead) |
| Q8 | AI/LLM surfaces (i–iv) | all IN | all IN | all IN | all IN | **All 4 INCLUDE — 4-0 unanimous** |
| Q9 | Tariff hedge | A | A | A | B | **A — 3-1 strong** (GLM dissent) |

---

## Decisions (locked, ≥3/4)

- **Q1 = C (4-0):** Show **both per-panel and per-SF** (panel = 4×8 ft = 32 SF). Buyers ship in panels, comparison-shop in $/SF. *Exception (GLM catch): Deck is a 12-ft plank, not a 4×8 panel — keep it per-plank, no forced $/SF.*
- **Q2 = C (4-0):** Prices on **`/pricing` (rebuilt) + the 3 priced product pages + a homepage hero price hook** for Subfloor ("Non-combustible subfloor from $74/panel, delivered").
- **Q4 = all 5 caveats (4-0):** Every published price carries: (i) DDP duty-paid, (ii) ~3–4 wk direct-from-factory, (iii) full-container (40HQ), (iv) within 100 mi of port, (v) "as of [date], subject to change".
- **Q5 = C (3-1):** Generic "leading US brand" mention on **homepage + /pricing + Subfloor page**. ⚠️ *GLM dissent (worth founder awareness): keep the comparison OFF the homepage hero — it makes the first brand impression comparative and raises SB-3 scrutiny at the highest-traffic surface; restrict to /pricing + Subfloor.*
- **Q6 = A (4-0):** The 4 quote-only products get a **prominent "Request delivered price" CTA in the same visual slot** where the priced products show their number (visual parity — not afterthoughts).
- **Q7 = C (4-0):** **Both** an inline "Get your delivered price" CTA **and** wire `MaterialCalculator` to end in "email me this delivered price for my quantity".
- **Q8 = all 4 (4-0):** Publish prices to **llms.txt, llms-full.txt, /api/llm-context, and product JSON-LD** (parity between what humans and AI agents see).
- **Q9 = A (3-1):** `priceValidUntil` ≈ **2026-07-24** in schema + visible "subject to change". ⚠️ *GLM dissent (worth founder awareness): that expiry date is approximate; committing it publicly risks a broken-promise or a forced re-publish sprint — prefer no public date + a scheduled internal re-price review (option B).*

## Failed quorum — Q3 (JSON-LD schema): 2-1-1

- **B** (Offer + `UnitPriceSpecification`, `eligibleQuantity`=FCL): DeepSeek, GLM — encodes the full-container constraint machine-readably so Google won't surface a per-panel price as retail.
- **A** (Offer + flat price/currency/MadeToOrder/priceValidUntil): Codex — simpler.
- **C** (AggregateOffer low/high): Gemini — range across variants.
- **Lean:** B (plurality + strongest rationale; A and B both put price in an `Offer` — the only difference is FCL encoding). **Resolution needed:** founder tie-break to B, or a fast Round 16.5 (Q3 re-scoped A-vs-B).

## Convergent Q10 action items (all/most voters) → mandatory follow-ups

1. **Get the 4 missing prices from Plycem/Luis** (cement-board, deck-modular, siding, corrugated) to close the catalog gap. *(4/4)*
2. **Build an automated re-price workflow** tied to the Section 122 tariff expiry → one-pass update of JSON-LD + llms.txt + llms-full.txt + API + visible copy. *(4/4)*
3. **Per-SF calculator** on Subfloor/`/pricing` that funnels into the MaterialCalculator lead form (Q7-B). *(3/4)*
4. **Deck $/SF handling** — plank ≠ panel; footnote or omit SF for deck. *(GLM)*
5. **Single pre-approved "leading brand" wording template** to prevent SB-3 drift across pages. *(GLM)*
6. **Calculator must state** its estimate includes the current 15% surcharge. *(Codex)*

---

## Overall
All four voters: **SHIP.** The rollout is scoped, honest (Q4 unanimous), and compliant (SB-3 generic-only, ADR-049 DDP framing, no internal cost data). Two dissents (Q5 homepage, Q9 dated validity) are legal/strategic-tinged and flagged for founder awareness. Q3 is the only open item needing resolution before schema implementation.
