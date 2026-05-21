# Round 15 — Product Catalog Regulatory Pass: Per-SKU Keep/Drop/Reposition Decisions

**Type:** Strategic catalog decision round. Each voter reads the evidence,
applies independent judgment, and votes on per-product actions plus the
homepage Cement Board promotion that is currently in code but not deployed.

**Voters (4):** Codex (GPT-5.1), DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1.
**Claude is NOT a voter** (per CLAUDE.md governance — cost + conflict-of-interest).
**Quorum:** ≥3/4 simple majority per question. Synthesis will report vote margin.
**Round date:** 2026-05-21.

---

## 0. WHY THIS ROUND EXISTS

The founder dropped 4 new Plycem PDFs (Base de Techo catalog, Microconcreto
Exterior June 2024 datasheet, Exterior Junta Invisible catalog, Ultra Junta
Invisible catalog) and asked for a per-product regulatory pass against US
market viability. The pass surfaced:

1. **Roof Sheathing was deleted earlier this session** — no UL 263 / UL 790,
   no ICC-ES ESR, prescriptive US default is OSB/plywood. (R14 scope passed,
   not re-litigating.)
2. **Exterior Cement Board (Microconcreto Exterior) was promoted to a second
   homepage anchor** alongside Subfloor — but the manufacturer's June 2024
   datasheet does NOT list the IAPMO ER-360 / ASTM E-84 / ASTM E-136 / NFPA
   285 / ICC IBC claims currently in `data/products.ts:268-275`. The
   promotion is in code but the deploy is held. A Plycem verification email
   has been sent and is awaiting reply.
3. **Exterior Hidden Joint got a CertGapWarning** mirroring the existing
   Siding warning — accurate per its commercial catalog.
4. **Fibroxton has the weakest compliance dossier in the entire catalog** —
   only Chilean NCh1914 + ISO 9001/14001/45001 manufacturing certs. Even
   ASTM C1186 (which should apply to fiber-cement panels) is not claimed.
5. **Deck (plank), Deck Modular, Corrugated Roof Tile, Siding** each have
   their own US standing — Siding and Corrugated already carry
   CertGapWarnings; Deck and Deck Modular have no overclaim.
6. **Stale reference**: `corrugated-roof-tile`'s FAQ at
   `data/products.ts:572` still recommends "Plycem Roof Sheathing" for
   low-slope roofs — that product was deleted earlier in the same session.

This round asks voters to ratify, modify, or reject the per-product
recommendations and the cement-board deploy gate.

This is NOT a re-audit of Subfloor positioning, the form/webhook architecture,
or the technical fixes shipped earlier this session (canonical, honeypot,
email collection). Stay scoped to catalog composition and the cement-board
promotion.

---

## 1. CONTEXT — current catalog state

After this session's edits, `data/products.ts` contains **8 products**
(Roof Sheathing removed):

| Slug | Name | Status |
|------|------|--------|
| `high-performance-subfloor` | High Performance Subfloor | Lead anchor — full US dossier (UL R15140, ASTM E-136, IAPMO ER-360, IBC Type I/II, CBC 7A) |
| `exterior-cement-board` | Exterior Cement Board (Microconcreto Exterior) | **Currently promoted to second anchor in `FeaturedProducts.tsx` — deploy held pending Plycem verification of unsupported US claims** |
| `exterior-hidden-joint` | Exterior Hidden Joint | CertGapWarning shipped (no ICC ESR, no E-136, no NFPA 285) |
| `siding` | Plycem Siding (4 profiles) | CertGapWarning shipped (no ICC ESR equivalent to HardiePlank ESR-2290) |
| `corrugated-roof-tile` | Eureka Sevillana | CertGapWarning shipped (no UL 263 / UL 790) |
| `deck` | Deck (plank) | No CertGapWarning; honest material claims only |
| `deck-modular` | Deck Modular | No CertGapWarning; surface tiles don't require ESR |
| `fibroxton` | Fibroxton | No CertGapWarning; weakest dossier in catalog |

The `FeaturedProducts.tsx` grid renders products in this `ENVELOPE_DISPLAY_ORDER` after the two anchor cards:

```
['deck', 'siding', 'corrugated-roof-tile', 'exterior-hidden-joint', 'fibroxton', 'deck-modular']
```

`ANCHOR_SLUGS = ['high-performance-subfloor', 'exterior-cement-board']` are
filtered out of the grid.

---

## 2. EVIDENCE — per-product technical findings

### 2.1 Exterior Cement Board (Microconcreto Exterior) — the deploy-gate product

**Claimed in `data/products.ts:268-275`:**

- IAPMO ER-360 Evaluation Report (valid through 2026-07-31)
- ICC IBC 2015/2012 recognized alternative material
- ICC IRC 2015/2012 residential code compliant
- ASTM E-84 (Flame spread 0, smoke developed ≤5, Class A)
- ASTM E-136 (Non-combustible)
- NFPA 285 eligible (assembly-tested for >40 ft)

**Listed in the manufacturer's actual June 2024 technical datasheet
(`Ficha-tecnica-Plycem-Microconcreto-Exterior-Junio-2024.pdf`):**

- Costa Rica RTCR 491:2017
- INTE/ISO 8336:2018
- Chile NCh1914/1.Of84 — with note: *"ensayo reúne resultados similares a
  ASTM E136 y No Combustible ASTM E84"* (similar-results note, NOT a US cert)
- 30-day manufacturer warranty

**Gap:** 6 of 7 US-specific claims in `data/products.ts` are NOT supported
by the manufacturer's current technical document. CLAUDE.md "Currently-open
items" already flagged the IAPMO ER-360 specifically: *"The June 2024 Plycem
Microconcreto Exterior datasheet does NOT list it."* — but the broader gap
goes beyond ER-360 renewal.

**Plycem verification email**: sent today (`docs/plycem-cert-verification-email.md`).
Awaiting reply.

### 2.2 Fibroxton

**Claimed in `data/products.ts:318-321`:**

- NCh1914/1.Of84 (Chilean — *"similar to ASTM E136 / E84"*)
- ISO 9001/14001/45001 (manufacturing)

**That is the entire compliance dossier.** No ASTM, no ICC, no IAPMO, no IBC.
ASTM C1186 not even claimed despite the product being fiber-cement-based.

**Functional positioning**: 10mm only, monolithic-finish facade panel.
Differentiator vs Exterior Hidden Joint = "wood-fiber blend gives different
texture." Same competitive shelf (HardiePanel, Allura, Cembrit, Equitone,
Nichiha).

### 2.3 Deck (plank)

**Claimed in `data/products.ts:177-181`:**

- ASTM C1186-08 Type A
- ISO 8336:2018
- ASTM E-84 (FSI 0, SDI 0)

**US regulatory:** Decking is governed by IRC R507 (residential) and IBC
1607 (commercial loads). Prescriptive listing is wood / wood-composite.
Fiber-cement decking requires IBC 104.11 alternative-materials approval per
project. No ICC-ES ESR. Trex carries ESR-2645 as the bar.

**Market headwind**: US residential deck market is dominated by Trex /
TimberTech / AZEK composites. Fiber-cement plank decking is *heavier* than
wood/composite and feels cold/hard underfoot — a fundamental product-market
fit problem. Honest material claims, no overclaim, but very low conversion
likelihood.

### 2.4 Deck Modular

**Claimed in `data/products.ts:366-371`:**

- ASTM C1186-08 Type A Grade I
- ISO 8336:2018
- ASTM E-84 (surface burning)
- ISO 9001/14001/45001 (manufacturing)

**US regulatory:** Surface finish tiles on rooftop decks don't typically
require ESRs — they're not structural, don't penetrate, don't bear primary
loads. IBC governs the substrate, not the tile. **No regulatory blocker.**

**Market position**: Rooftop terraces, balconies, pool decks where under-
floor access (waterproofing, drains) matters. Competes on aesthetic +
durability vs cheap plastic (IKEA Runnen, ~$3/sqft) and on price + install
speed vs concrete pavers (Buzon, Eterno pedestal systems).

### 2.5 Siding

**Claimed**: ASTM C1186 Type A Grade I + ASTM E-84 (per existing data).

**US regulatory:** IBC 1404.10 / 1405.10 prescriptively permits fiber-cement
siding complying with ASTM C1186 Type A Grade II minimum. Plycem's Grade I
exceeds the bar. **The base prescriptive path works** for residential and
light commercial under 40 ft.

**ESR gap**: HardiePlank's ESR-2290 family is the spec-driven shelf. Plycem
Siding has no equivalent.

**Historical note worth confirming**: Until ~2018, Plycem's US-branded
fiber-cement siding sold under "Allura" carried **ICC-ES ESR-3500**.
Allura was the same factory product as Plycem Siding before the Plycem
Group / Elementia restructuring. If ESR-3500 is still active and covers
Plycem-manufactured product, JARA could potentially reference it and close
the entire Siding cert gap. This is unverified — needs Plycem confirmation.
(Not in the email already sent — would go in a follow-up.)

### 2.6 Corrugated Roof Tile (Eureka Sevillana)

**Claimed in `data/products.ts:552-555`:**

- ISO 9001/14001/45001 (Plycem manufacturing)
- INTE/ISO 8336:2018
- RTCR 491:2017 (Costa Rica)

**No US claims being made.** The existing CertGapWarning honestly states
this product is NOT certified to UL 263 / UL 790 Class A roof assemblies
and cannot be specified in WUI / HVHZ / insurance-driven jurisdictions.

**Stale reference cleanup**: FAQ at `data/products.ts:572` reads:

> *"For low-slope roofs, a different roof system (Plycem Roof Sheathing
> with a separate waterproof membrane, for example) is the appropriate
> product family."*

Plycem Roof Sheathing was deleted from the catalog earlier this session.
Reference is dangling.

### 2.7 Exterior Hidden Joint — out of scope for this round

Already received its CertGapWarning earlier today. The cement-board warning
references Hidden Joint as the alternative-cert-gap product. Not voted on
in this round.

---

## 3. THE PLYCEM EMAIL ALREADY SENT

`docs/plycem-cert-verification-email.md` was sent today asking Plycem to
confirm/refute the following:

- **Subfloor**: UL R15140 vigency, UL Design numbers (H502/H504/H511/U449/U487),
  ASTM C1186 / E-84 / E-136 reports, IAPMO ER-360 renewal, IBC 2021 letter,
  CBC Chapter 7A docs.
- **Cement Board**: All 6 unsupported US claims (ER-360, ICC IBC/IRC, ASTM
  E-84/E-136 from US-accredited lab not Chilean equivalence, NFPA 285).
- **Hidden Joint**: ASTM C1186, ISO 8336, ASTM E-84 reports for this specific
  SKU (not just the Subfloor's).
- **PDF redistribution permission** for the per-product downloads library.
- **Designated US technical contact**.

**Items NOT in the email already sent** — voters may recommend a follow-up:

- Allura ESR-3500 status for Siding
- Fibroxton ASTM C1186 verification (only relevant if keeping Fibroxton)
- UL 790 Class A pursuit feasibility for Eureka Sevillana

---

## 4. CONSTRAINTS — DO NOT vote against these

- **Subfloor stays the lead anchor.** It is the only product in the catalog
  with a confirmed full US dossier. Founder-locked per CLAUDE.md.
- **No reintroduction of Roof Sheathing.** It was deleted earlier this session
  for documented reasons (no US ESR for deck use, prescriptive default is
  OSB/plywood). Out of scope.
- **No Plycem-vs-USG comparisons** (ship blocker SB-3). Voters may compare
  to competitors (HardiePanel, Trex, DensGlass, Eagle Roofing, etc.) in
  rationale, but not in proposed product copy.
- **No prices in any proposed product schema or copy** (ship blocker SB-4).
- **Honesty discipline**: Where a claim cannot be substantiated by a Plycem
  document, the choice is between (a) honestly disclose the gap via
  CertGapWarning, (b) remove the claim from `data/products.ts`, or (c)
  remove the product. Not between (a)/(b)/(c) and "keep claim, hope for
  the best."

---

## 5. QUESTIONS TO ADJUDICATE

For each question return one of the listed options plus a 2–5 sentence
rationale citing specific evidence (file/line, datasheet, market data).
Where a question asks for ordered preferences, list them as `primary` and
`alternate`.

### Q1 — Cement Board promotion deploy gate

The cement-board promotion is in code at `FeaturedProducts.tsx` (second
anchor card under Subfloor, "two anchor products / sharing the same US
compliance dossier" framing). Plycem reply is awaited. Pick ONE:

- **A. HOLD**: Don't deploy any of this session's commits to production
  until Plycem confirms or refutes the 6 unsupported US claims for Cement
  Board. Subfloor improvements + Hidden Joint warning + Roof Sheathing
  deletion + form fixes sit behind cement-board verification.
- **B. DEFENSIVE_REVERT**: Roll back only the cement-board promotion (move
  it back into the envelope grid). Keep all other improvements deploy-ready.
  Re-promote in one commit when Plycem confirms.
- **C. DEPLOY_AS_IS**: Ship the promotion with current claims. Walk back if
  Plycem disconfirms.
- **D. DEPLOY_WITH_WARNING**: Ship the promotion but add a CertGapWarning
  to the cement-board product page disclosing that some US claims are
  pending manufacturer verification.

### Q2 — Fibroxton

Pick ONE:

- **A. DROP**: Remove Fibroxton from the catalog (same playbook as Roof
  Sheathing). Add a 301 redirect from `/products/fibroxton` to `/`. Update
  llms.txt, /es page, and sitemap.
- **B. KEEP_WITH_STRONG_WARNING**: Add a CertGapWarning *stronger* than
  Hidden Joint's (only Chilean cert + ISO mfg; ASTM C1186 not even claimed).
  Verify C1186 with Plycem in follow-up email.
- **C. KEEP_AS_IS**: Leave as is. Fibroxton stays in the envelope grid
  without a warning.

### Q3 — Deck (plank)

Pick ONE:

- **A. KEEP_DEPRIORITIZED**: Keep in catalog, no marketing emphasis, no
  CertGapWarning needed.
- **B. CONSOLIDATE**: Merge `deck` and `deck-modular` into a single
  `/products/decking` page with two variant sections — reduces catalog
  clutter for the lowest-conversion segment.
- **C. DROP**: Remove `deck` slug entirely. Deck Modular alone covers the
  outdoor flooring story. Add a 301 redirect.

### Q4 — Deck Modular

Pick ONE:

- **A. LIGHT_PROMOTION**: Elevate out of envelope grid into a third tier
  ("Specialty / clean compliance niche") above the rest of the grid. No
  hero anchor, but visually distinguished. Rationale: no regulatory gap
  + real US niche (rooftop terraces) = best US-viable product after the
  two anchors.
- **B. KEEP_IN_GRID**: Leave in the envelope grid alongside the other
  supporting-cast products.
- **C. REORDER**: Move it to the first position of `ENVELOPE_DISPLAY_ORDER`
  but keep it in the grid (no new section).

### Q5 — Plycem follow-up email items

The email already sent (Section 3 above) covers Subfloor / Cement Board /
Hidden Joint / PDF permission / technical contact. What additional items
should JARA queue for a follow-up communication? Multi-select; for each
chosen item, vote `INCLUDE` or `SKIP`:

- (i) **Allura ESR-3500 status for Siding** — if active, could close the
  entire Siding cert gap in one stroke.
- (ii) **Fibroxton ASTM C1186 verification** — only relevant if Q2 = B
  (keep with warning).
- (iii) **UL 790 Class A pursuit feasibility for Eureka Sevillana** —
  speculative; Eagle Roofing and Boral cleared this for concrete tile,
  could Plycem in principle.
- (iv) **Plycem Group / Elementia US distribution rights** — does JARA's
  distributor relationship contractually permit US-market ESR pursuit by
  JARA itself if Plycem won't, or is that exclusively Plycem's call?
- (v) **Annual recertification cycle** — what is Plycem's planned cycle
  for renewing US-relevant ESRs / IAPMO ERs? This determines JARA's
  forward-looking exposure.

### Q6 — Corrugated Roof Tile FAQ cleanup

The FAQ at `data/products.ts:572` references the deleted "Plycem Roof
Sheathing" product as an alternative for low-slope roofs. Pick ONE:

- **A. DELETE_REFERENCE**: Remove the Roof Sheathing sentence entirely.
  Leave the FAQ answer truncated to "For low-slope roofs, a different roof
  system is the appropriate product family."
- **B. REPLACE_WITH_GENERIC**: Replace with a non-product-specific
  recommendation (e.g., "For low-slope roofs, specify a built-up roofing
  system or single-ply membrane over rigid insulation").
- **C. REPLACE_WITH_OFFSITE**: Replace with a reference to the prescriptive
  US default (e.g., "For low-slope roofs, OSB or plywood sheathing with a
  separate waterproof membrane is the prescriptive US default").

### Q7 — Siding CertGapWarning update

Current Siding CertGapWarning copy in `app/products/[slug]/page.tsx:42-44`
mentions HardiePlank's ESR-2290 as the missing equivalent but does NOT
mention Allura's historical ESR-3500 (which Plycem-related supply chain
held until ~2018). Pick ONE:

- **A. NO_CHANGE**: Leave the warning as-is. Allura ESR-3500 is not yet
  confirmed by Plycem; mentioning it would be speculative.
- **B. ADD_ALLURA_HISTORY**: Expand the warning to acknowledge the Allura
  ESR-3500 history and note that JARA is investigating whether it can be
  referenced for Plycem-manufactured supply.
- **C. WAIT_FOR_PLYCEM**: Hold any wording change until Plycem confirms
  Allura ESR-3500 status. If confirmed, drop the CertGapWarning entirely
  (or rewrite it to cite the ESR).

### Q8 — Overall catalog count after this round

Depending on Q2 and Q3, the resulting catalog size will be 6, 7, or 8
products. Pick ONE:

- **A. 8** (keep both Fibroxton and Deck)
- **B. 7** (drop Fibroxton, keep Deck) or (keep Fibroxton, drop Deck)
- **C. 6** (drop both)

Briefly justify why the count you pick best serves the founder-locked
positioning ("subfloor-as-hero, full envelope, US distributor, direct
factory shipping").

### Q9 — Anything you would do differently from this prompt's framing?

Free response, 2–5 sentences. If you would reframe any of Q1–Q8, propose
the reframing. If you would split a question, propose the split. If you
would add a question we missed, add it.

### Q10 — Open items / future-round triage

List 1–3 items that this round did NOT resolve but should be queued for a
later round. Examples: deck consolidation page-design specifics, llms.txt
update post-Plycem-reply, image generation strategy for remaining 4–5
products, etc.

---

## 6. RESPONSE SCHEMA

Return a single JSON object:

```json
{
  "voter": "codex" | "deepseek" | "gemini" | "glm",
  "round": 15,
  "date_iso": "2026-05-21",
  "verdicts": {
    "Q1": { "choice": "A|B|C|D", "rationale": "..." },
    "Q2": { "choice": "A|B|C", "rationale": "..." },
    "Q3": { "choice": "A|B|C", "rationale": "..." },
    "Q4": { "choice": "A|B|C", "rationale": "..." },
    "Q5": {
      "i":   { "choice": "INCLUDE|SKIP", "rationale": "..." },
      "ii":  { "choice": "INCLUDE|SKIP", "rationale": "..." },
      "iii": { "choice": "INCLUDE|SKIP", "rationale": "..." },
      "iv":  { "choice": "INCLUDE|SKIP", "rationale": "..." },
      "v":   { "choice": "INCLUDE|SKIP", "rationale": "..." }
    },
    "Q6": { "choice": "A|B|C", "rationale": "..." },
    "Q7": { "choice": "A|B|C", "rationale": "..." },
    "Q8": { "choice": "A|B|C", "count": 6|7|8, "rationale": "..." },
    "Q9": { "free_response": "..." },
    "Q10": { "items": ["...", "...", "..."] }
  },
  "overall_catalog_recommendation": "SHIP|REVISE|WAIT_FOR_PLYCEM",
  "highest_confidence_finding": "...",
  "lowest_confidence_finding": "..."
}
```

Return **only** the JSON object — no markdown fence, no preface, no trailing
prose. If you must wrap, wrap minimally; the synthesis script will strip.
