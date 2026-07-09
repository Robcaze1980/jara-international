# Round 16 — Price Promotion Rollout: HOW to publish DDP prices (SB-4 now authorized)

**Type:** Strategic + technical rollout round. SB-4 (the "no published Plycem
list prices" ship blocker) has been **authorized by Plycem**, so JARA is now
publishing DDP prices. This round decides the HOW — format, placement, schema,
framing, AI surfaces, tariff hedge. It does NOT re-litigate whether to publish.

**Voters (4):** Codex (GPT-5.1), DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1.
**Claude is NOT a voter** (per CLAUDE.md governance — cost + conflict-of-interest).
**Quorum:** ≥3/4 simple majority per question. Synthesis reports vote margin.
**Round date:** 2026-07-09.

---

## 0. WHY THIS ROUND EXISTS

1. The current site launched **without prices** and has produced **zero leads**
   since launch. The prior v0 site promoted prices and generated ~2–3 leads/mo
   in its first ~2 months. The founder's read: price transparency was the main
   lead driver, and its removal killed inbound.
2. Prices were removed because of **ship blocker SB-4** ("NO Plycem list prices
   published without authorization" — Plycem brand guide p.4). **SB-4 is now
   UNBLOCKED:** Plycem gave **verbal authorization** to publish JARA's DDP list
   prices (phone call to founder, 2026-07-06). Recorded in CLAUDE.md §5 +
   BITACORA. (SB-3 comparison-table/competitor-naming remains blocked; a generic
   non-tabular "leading US brand" mention IS allowed.)
3. **Founder decisions already locked — DO NOT re-litigate:**
   - Full catalog stays listed; **Subfloor is the driver** (best US dossier).
   - Publish **"today's price"** — do not wait for the import-tariff change.
   - **Only 3 of 7 products get published prices now** (the only ones with a
     June-2026 price from Plycem): Subfloor, Exterior Hidden Joint, Deck. The
     other 4 (Cement Board, Deck Modular, Siding, Corrugated Roof Tile) get a
     **"Request delivered price"** quote CTA — no number yet.
   - Competitor framing = **generic mention only** (no naming, no comparison
     table).

This round adjudicates only the execution details below.

---

## 1. CONTEXT

### 1.1 The pricing model (public-safe summary)
Prices are **JARA's own delivered (DDP) list prices** to US ports. DDP includes
ocean freight, marine insurance, US import duty, customs clearance, and inland
trucking within 100 mi of the port. Built up from Plycem factory (FOB) pricing.
**Only the final rounded price is public.** JARA's cost build-up and margin are
internal and must NEVER appear on any surface (page copy, schema, llms.txt,
API). Prices assume **full-container (FCL / 40HQ)** quantities.

### 1.2 The prices to publish (rounded, public) — panels are 4×8 ft = 32 SF
| Product (slug) | Variant | $/panel | ~$/SF |
|---|---|---|---|
| **high-performance-subfloor** | 20 mm square-edge | **$74** | $2.30 |
| | 20 mm T&G | **$83** | $2.60 |
| | 22 mm square-edge | **$85** | $2.66 |
| | 22 mm T&G | **$89** | $2.78 |
| | 25 mm T&G | **$105** | $3.29 |
| **exterior-hidden-joint** | 8 mm | **$28** | $0.88 |
| | 10 mm | **$39** | $1.22 |
| | 12 mm | **$49** | $1.53 |
| **deck** (plank, 12 ft) | 30 mm | **$48 / plank** | — |

### 1.3 Quote-only products (no June-2026 price)
`exterior-cement-board`, `deck-modular`, `siding`, `corrugated-roof-tile`.
(Note: `exterior-cement-board` also has pending Plycem cert verification and
existing CertGapWarnings on siding/corrugated/deck — unrelated to pricing but
present on those pages.)

### 1.4 Positioning constraint (ADR-049)
JARA has **no US warehouse**. Direct factory shipping, **~3–4 week** door-to-door
delivery. Product schema `availability` = `https://schema.org/MadeToOrder`.
Prices must be framed as **delivered DDP, direct-import**, NOT "in stock / 0–3 day".

### 1.5 Tariff timing
Current prices bake in a temporary **15% Section 122 import surcharge** that may
expire **~2026-07-24** (~2 weeks out). Founder chose to publish today's price
anyway; Q9 decides how to hedge price validity.

---

## 2. CONSTRAINTS — DO NOT vote against these

- **SB-4 is authorized** — prices MAY be published. Do NOT propose reverting to
  quote-only for the 3 priced products.
- **SB-3 stands:** no published Plycem-vs-competitor comparison **tables** and no
  **naming** a competitor, without written approval. Generic non-tabular "leading
  US brand" positioning is allowed; keep claims truthful/substantiable.
- **ADR-049 stands:** no warehouse / in-stock / 0–3 day / California-stock claims.
  Availability = MadeToOrder.
- Other ship blockers stand: SB-1 (domain), SB-2 (JARA brand, not Plycem), SB-5
  (no "PLYCEM" in titles), SB-6, SB-7 (no Plycem logo), SB-8, SB-9.
- **Subfloor stays the lead anchor.**
- **NEVER publish** internal cost, freight, duty build-up, margin, or gross
  profit — only the rounded final DDP price.
- The **3-priced / 4-quote split is founder-locked** — do not vote to price the
  other 4 now.
- Published prices must be clearly labeled **full-container (FCL/40HQ)**.

---

## 3. QUESTIONS TO ADJUDICATE

For each, return ONE listed option + a 2–5 sentence rationale citing specifics.

### Q1 — Price unit/format
- **A. PER_PANEL** only (e.g., "20 mm from $74/panel, FCL").
- **B. PER_SF** only (e.g., "from $2.30/SF delivered").
- **C. BOTH** per-panel and per-SF shown together.
- **D. PER_PANEL + PER_CONTAINER** (panel price + full-40HQ total).

### Q2 — Where prices appear
- **A.** Dedicated `/pricing` page only (rebuild the ADR-040 quote-only stub).
- **B.** `/pricing` + the 3 priced product detail pages.
- **C.** `/pricing` + product pages + a **homepage hero price hook** for Subfloor
  ("Non-combustible subfloor from $74/panel, delivered").
- **D.** Product pages + hero hook, with `/pricing` kept minimal.

### Q3 — JSON-LD schema for the 3 priced products
- **A.** `Offer` { price, priceCurrency USD, availability MadeToOrder, priceValidUntil }.
- **B.** `Offer` { priceSpecification: UnitPriceSpecification with eligibleQuantity=FCL, valueAddedTaxIncluded=false }.
- **C.** `AggregateOffer` { lowPrice, highPrice } per product across thickness variants.
- **D.** No price in schema; price in visible copy only.

### Q4 — Mandatory honesty caveats next to every published price (multi-select INCLUDE/SKIP)
- (i) "DDP — duty paid, delivered to US port"
- (ii) "~3–4 week delivery, direct from factory"
- (iii) "full-container (40HQ) pricing"
- (iv) "within 100 mi of port; beyond = additional"
- (v) "price as of [date], subject to change"

### Q5 — Generic "leading brand" mention (option a) placement
- **A.** `/pricing` only.
- **B.** `/pricing` + Subfloor page.
- **C.** Homepage + `/pricing` + Subfloor page.
- **D.** Don't use it — JARA/Plycem own attributes only (DDP, duty-paid, UL R15140).

### Q6 — The 4 quote-only products
- **A.** Prominent **"Request delivered price"** CTA in the same visual slot where
  the 3 priced products show their number (visual parity).
- **B.** Subtle "Contact for pricing" line, de-emphasized.
- **C.** No pricing-related element on those 4; rely on the global quote CTA.

### Q7 — Lead-capture integration
- **A.** "Get your delivered price" quote CTA beside the published prices.
- **B.** Wire `MaterialCalculator` to end in "email me this delivered price for my
  quantity" (turn the estimator into a lead form).
- **C.** BOTH.
- **D.** Neither — static price only.

### Q8 — AI/LLM surfaces (per SEO+AI-priority) — add prices to (multi-select INCLUDE/SKIP)
- (i) `llms.txt`
- (ii) `llms-full.txt`
- (iii) `/api/llm-context`
- (iv) product JSON-LD (ties to Q3)

### Q9 — Tariff-timing hedge (15% may expire ~2026-07-24)
- **A.** `priceValidUntil` ≈ 2026-07-24 in schema + visible "subject to change".
- **B.** No dated field; schedule an internal re-price review at expiry + generic
  "subject to change".
- **C.** Generic "prices subject to change without notice" only; no dated field,
  no scheduled review.

### Q10 — Reframe / open items
Free response (2–5 sentences): anything you'd reframe in Q1–Q9, plus 1–3 items to
queue for a later round (e.g., getting the 4 missing prices from Plycem, per-SF
calculator, re-price workflow at tariff expiry).

---

## 4. RESPONSE SCHEMA

Return a single JSON object — no markdown fence, no preface:

```json
{
  "voter": "codex" | "deepseek" | "gemini" | "glm",
  "round": 16,
  "date_iso": "2026-07-09",
  "verdicts": {
    "Q1": { "choice": "A|B|C|D", "rationale": "..." },
    "Q2": { "choice": "A|B|C|D", "rationale": "..." },
    "Q3": { "choice": "A|B|C|D", "rationale": "..." },
    "Q4": {
      "i":   { "choice": "INCLUDE|SKIP", "rationale": "..." },
      "ii":  { "choice": "INCLUDE|SKIP", "rationale": "..." },
      "iii": { "choice": "INCLUDE|SKIP", "rationale": "..." },
      "iv":  { "choice": "INCLUDE|SKIP", "rationale": "..." },
      "v":   { "choice": "INCLUDE|SKIP", "rationale": "..." }
    },
    "Q5": { "choice": "A|B|C|D", "rationale": "..." },
    "Q6": { "choice": "A|B|C", "rationale": "..." },
    "Q7": { "choice": "A|B|C|D", "rationale": "..." },
    "Q8": {
      "i":   { "choice": "INCLUDE|SKIP", "rationale": "..." },
      "ii":  { "choice": "INCLUDE|SKIP", "rationale": "..." },
      "iii": { "choice": "INCLUDE|SKIP", "rationale": "..." },
      "iv":  { "choice": "INCLUDE|SKIP", "rationale": "..." }
    },
    "Q9": { "choice": "A|B|C", "rationale": "..." },
    "Q10": { "free_response": "...", "future_items": ["...", "..."] }
  },
  "overall_recommendation": "SHIP|REVISE|HOLD",
  "highest_confidence_finding": "...",
  "lowest_confidence_finding": "..."
}
```

Return **only** the JSON object.
