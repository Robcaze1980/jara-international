# Round 11 — Synthesis

**Date:** 2026-05-16
**Voters (5):** Codex (`openai/gpt-5.1-codex`), DeepSeek V4 Pro (`deepseek/deepseek-v4-pro`), Gemini 3.1 Flash Lite (`google/gemini-3.1-flash-lite`), GLM-5.1 (`z-ai/glm-5.1`), Claude Opus 4.7 (`anthropic/claude-opus-4-7`, fresh session via OpenRouter)
**Quorum rule:** ≥3/5 per item (ADR-032).
**Total OpenRouter spend:** $0.178 (Claude: $0.126, DeepSeek: $0.018, GLM: $0.017, Codex: $0.014, Gemini: $0.003)
**Overall verdict distribution:** 1 × ship (Codex), 4 × tune (DeepSeek, Gemini, GLM, Claude). Zero rollbacks.

---

## Locked decisions — all 8 items hit quorum

| Item | Decision | Margin | Action |
|---|---|---|---|
| **R11-A** | **A1 — KEEP homepage redesign** | **5-0 unanimous** | No code change |
| **R11-B** | **B1 — REMOVE Spanish proprietary names from English copy** | 3-2 (B1: Codex, DeepSeek, Claude · B2 parenthetical: Gemini, GLM) | Code change required |
| **R11-C** | **C1 — KEEP Deck Modular as shipped** | **5-0 unanimous** | No code change |
| **R11-D** | **D2 — ADD cert-gap warning badge to Lap Siding** | **5-0 unanimous** | Code change required |
| **R11-E** | **E2 — ADD top-of-page warning banner to Corrugated Roof Tile** | 4-1 (E2: Codex, DeepSeek, Gemini, Claude · E4 export-only-hide: GLM) | Code change required |
| **R11-F** | **F1 — KEEP `/long-beach-stock` as shipped** | 3-2 (F1: Codex, DeepSeek, Gemini · F2 CTA-tuning: GLM, Claude) | No code change |
| **R11-G** | **G2 — ADD `availability: MadeToOrder` to Product schema** | **5-0 unanimous** | Code change required |
| **R11-H** | **H1 — KEEP regional `serviceAreas` (continental US)** | **5-0 unanimous** | No code change |

**Summary:** 6 unanimous + 1 strong majority (4-1) + 1 bare quorum (3-2 × 2 items). Zero items failed quorum. All 5 strategic / 3 non-strategic shifts that the 2026-05-16 commits introduced are validated.

---

## Per-item synthesis with reasoning + dissent notes

### R11-A — Homepage redesign (Hero + ValueProps + FeaturedProducts)

**Locked: A1 — KEEP, 5-0 unanimous.**

Convergent rationale: subfloor-hero is founder-locked strategy; implementation correctly anchors on the only product with a complete US compliance dossier; ValueProps trio (factory pricing / 3–4 week / spec-ready) supports the new positioning; two-tier FeaturedProducts signals subfloor primacy without hiding the envelope.

No dissent. No code change. The 2026-05-16 homepage ships as-is.

### R11-B — Spanish proprietary names in English-locale copy

**Locked: B1 — REMOVE, 3-2 bare quorum.**

**Majority position (B1):** Spanish proprietary names in English copy read as ESL clutter to US architects and contradict the cleaner English product name already in `data/products.ts`. Removing them aligns with US-locale UX norms and the `data/products.ts` English name "High Performance Subfloor". The `/es` Spanish page preserves Spanish names where culturally appropriate.

**Minority position (B2, Gemini + GLM):** Parenthetical naming (`PLYCEM High Performance Subfloor (Entrepiso Alto Desempeño)`) preserves Plycem datasheet cross-reference for specifiers while addressing the ESL-clutter concern. Pure removal loses a legitimate brand-authenticity thread. This is a defensible alternative; the dissent should be reviewed in Round 12 if any architect feedback indicates the cross-reference is missed.

**Action:** Code change. Remove "Entrepiso Alto Desempeño" from all English-locale surfaces. Audit grep before commit (per Claude's `additional_findings`).

### R11-C — Catalog: Deck Modular

**Locked: C1 — KEEP, 5-0 unanimous.**

ASTM C1186 + ASTM E-84 cert posture is clean for a non-fire-rated outdoor flooring product. Rooftop-deck-above-occupied-space pull-through angle connects naturally to subfloor projects. Low risk, credible US standard. No dissent.

No code change.

### R11-D — Catalog: Lap Siding (T&G)

**Locked: D2 — ADD cert-gap warning badge, 5-0 unanimous.**

All 5 voters agreed the ASTM C1186 + ASTM E-84 cert package is enough to keep the product in the catalog, but the missing ICC-ES ESR-equivalent is a real AHJ risk for specifiers who skim the FAQ. The badge must visually match the `/long-beach-stock` amber-callout pattern for brand consistency (per Claude's additional_findings #6).

**Action:** Code change. Add an amber cert-gap warning callout to `/products/lap-siding-tongue-and-groove` — visible above the fold, persistent (not collapsible), with the existing FAQ content as the deeper read.

### R11-E — Catalog: Corrugated Roof Tile (Eureka Sevillana)

**Locked: E2 — ADD top-of-page warning banner, 4-1 strong majority.**

**Majority position (E2):** Corrugated roof tile without UL Class A is the highest-risk product in the catalog. Quadruple-disclosure in body copy is defensive but a US specifier skimming the page in a Class A jurisdiction can still miss it. A persistent top-of-page amber banner makes the cert gap visually impossible to miss while preserving the international/export use case.

**Minority position (E4, GLM):** Export-only hiding (remove from main catalog, keep reachable via direct URL) eliminates US liability surface entirely. GLM's reasoning is defensible — the risk of an inattentive US specifier ignoring four-place disclosures plus a banner is non-zero. The strong-majority margin (4-1) locks E2 but the minority concern is captured in `additional_findings` for monitoring.

**Action:** Code change. Add an amber top-of-page warning banner to `/products/corrugated-roof-tile` — must always render, never collapsible, visually identical to the Lap Siding badge (D2) for cert-gap signaling consistency.

GLM-flagged consequence: if E2 had failed and E4 had passed, the product's JSON-LD `areaServed` would have needed a per-product override to exclude continental US regions. With E2 passing, this concern is moot for now but the per-product schema-availability granularity issue is captured in additional findings.

### R11-F — `/long-beach-stock` paid-ads page

**Locked: F1 — KEEP as shipped, 3-2 bare quorum.**

**Majority position (F1):** Page existence + structure is locked (per the prompt) and the three-channel CTA layout matches the founder's intent for the paid-ads campaign that is still pending. Don't optimize before the campaign even runs.

**Minority position (F2, GLM + Claude):** Three equal-weight CTAs dilute paid-ads conversion. Standard landing-page practice is a single dominant CTA (phone) with secondary channels. Costs nothing to implement and would materially affect conversion when ads do launch. The bare-quorum margin signals this should be revisited in Round 12 when the paid-ads campaign concrete plan emerges.

**Action:** No code change. F1 wins. Note in ADR-049 open items that the CTA hierarchy should be reconsidered when paid-ads campaign launches.

### R11-G — JSON-LD changes (availability signal)

**Locked: G2 — ADD `availability: MadeToOrder`, 5-0 unanimous.**

MadeToOrder is schema.org-honest for container-direct 3–4 week supply, Google indexes it, and it accurately reflects the operational reality. PreOrder is semantically less accurate. InStock-limited would couple our schema to third-party inventory we don't control. Omitting availability entirely sacrifices SEO for no accuracy gain over MadeToOrder.

**Action:** Code change. Add `availability: 'https://schema.org/MadeToOrder'` back to `productSchema()` in `lib/jsonld.ts`.

**Caveat from GLM's additional_findings #2:** if a product (e.g., Deck Modular) is physically in the Long Beach partner stock, applying MadeToOrder uniformly to all products is slightly loose. Per-product availability granularity in `productSchema()` is the cleaner long-term design but not blocking for this commit. Documented as a low-severity follow-up.

### R11-H — `serviceAreas` regional expansion

**Locked: H1 — KEEP regional list (10 continental US regions), 5-0 unanimous.**

The 10-region list is honest about continental US container-direct reality. The previous 10-city list was anchored on a warehouse JARA doesn't operate. Mixed list (H2) would reintroduce the city-anchored narrative the warehouse correction was meant to remove. Reverting to cities (H3) would directly contradict ADR-049.

No dissent. No code change.

---

## Action items derived from the synthesis

Four code changes to ship in a single follow-up commit (`feat(round11): apply synthesis decisions (R11-A…H)`):

1. **R11-B**: Remove "Entrepiso Alto Desempeño" from all English-locale surfaces. Files: `components/Hero.tsx`, `components/FeaturedProducts.tsx`, `app/page.tsx`, `app/products/page.tsx`, `app/llms-full.txt/route.ts`, `public/llms.txt`. `/es/page.tsx` unchanged.
2. **R11-D**: Add amber cert-gap warning callout to `/products/lap-siding-tongue-and-groove`. Must visually match `/long-beach-stock` amber pattern. Content: "No ICC-ES ESR available — confirm AHJ acceptance before specifying for assembly-tested wall systems."
3. **R11-E**: Add amber top-of-page warning banner to `/products/corrugated-roof-tile`. Same visual pattern as R11-D. Content: "Not currently UL 263/790 Class A fire-rated. Not for California Chapter 7A, Florida HVHZ, or any Class A-required US jurisdiction. International / Caribbean / export use only."
4. **R11-G**: Add `availability: 'https://schema.org/MadeToOrder'` to `productSchema()` in `lib/jsonld.ts`. Restores Google Product rich-snippet eligibility under an accurate schema.org value.

Estimated commit size: ~30 lines changed across 7 files.

---

## Additional findings — triage

### High severity (action required)

- **IAPMO ER-360 verification window** (DeepSeek + Claude). The `exterior-cement-board` catalog claims IAPMO ER-360 valid through 2026-07-31, but the June 2024 Microconcreto Exterior datasheet does not list it. If the cert has been retired, the product page is making a false claim. **Action:** Create a tracked issue with a pre-expiration verification step targeting Plycem contact. Founder direction to "leave as-is for now" remains valid until that verification, but the issue must be tracked, not orphaned in ADR-049 open items.

### Medium severity (next-round eligible)

- **B1 audit grep** (Claude). After R11-B code change, run a grep pass for `Entrepiso Alto Desempeño` across `app/`, `components/`, `lib/`, and content surfaces (`llms.txt`, `llms-full.txt`) to catch stragglers. Mandatory part of the R11-B commit.
- **OpenNext 1-year HTML cache** (DeepSeek). `Cache-Control: s-maxage=31536000` on prerendered pages is OpenNext default. Cloudflare auto-purges on deploy, but runtime data changes that don't trigger a deploy could serve stale HTML. Latent risk for `/long-beach-stock` if inventory data updates outside the deploy pipeline. **Action:** Documented as Round 12 candidate; not blocking R11.
- **`/long-beach-stock` canonical URL** (Gemini). Verify the `noindex,nofollow` page doesn't accidentally become the canonical URL for the products it lists. **Action:** Spot-check live page metadata after R11 commit.
- **Lap Siding badge WCAG contrast** (GLM). The `/long-beach-stock` amber pattern was not audited for WCAG 2.1 AA contrast in the rush commit. Before D2 ships, verify the amber-on-white contrast ratio meets AA. **Action:** WCAG check on the badge component during R11-D implementation.
- **Corrugated roof tile FAQ crawl-visibility** (Claude). If FAQs render as collapsed by default, AI crawlers may not surface the cert-gap text in initial DOM. E2 banner mitigates for human users but not AI surfaces. **Action:** Verify FAQ server-render state in R11-E implementation; if collapsed, mirror critical disclosure text in non-collapsed body copy.
- **ADR-049 supersession in `llms-full.txt`** (Claude). Verify no historical warehouse language remains in `/llms-full.txt` or `/api/llm-context` output. **Action:** Grep + curl audit during R11 commit.
- **IAPMO ER-360 calendar reminder** (Claude, duplicate of high-severity item). Same finding; same action.

### Low severity (backlog)

- **Product schema `areaServed` cardinality** (Claude). Validate Google Search Console doesn't flag the 10-region array as malformed. Consider wrapping in `{'@type': 'AdministrativeArea', 'name': '...'}` for parser robustness.
- **MadeToOrder semantic looseness for partner-stock products** (GLM). Per-product availability granularity in `productSchema()` would be cleaner. Backlog candidate.
- **Schema availability ↔ UI consistency** (Gemini). If MadeToOrder lands in JSON-LD, ensure the product detail page UI doesn't display contradicting language (e.g., "In stock"). Audit during R11-G commit.
- **Related-products Jaccard weakness** (DeepSeek). Token-similarity or embedding-based approach would yield richer cross-sell neighbors. Phase 6 candidate.
- **Visual consistency on cert-gap badges** (Claude). D2 and E2 should use identical amber pattern + icon + copy structure for brand consistency. Implementation detail for R11-D/E.

---

## Cost breakdown

| Voter | Tokens (in + out) | Cost (USD) |
|---|---|---|
| Claude Opus 4.7 | 12,817 + 2,532 = 15,349 | $0.126 |
| DeepSeek V4 Pro | 7,930 + 1,196 = 9,126 | $0.018 |
| GLM-5.1 | 7,891 + 1,380 = 9,271 | $0.017 |
| Codex (GPT-5.1) | 7,794 + 447 = 8,241 | $0.014 |
| Gemini 3.1 Flash Lite | 8,415 + 628 = 9,043 | $0.003 |
| **Total** | **51,030** | **$0.178** |

Within the $0.10–$0.30 runbook estimate. Claude dominates cost (~70%) due to Opus pricing — future rounds could optionally drop Claude in favor of a 4-voter quorum to save ~70% if budget matters, at the cost of losing one voter's perspective.

---

## Recommended next steps

1. **Apply R11 decisions in a single follow-up commit.** ~30 lines across 7 files. Should typecheck cleanly. Title: `feat(round11): apply synthesis decisions — remove Spanish names, add cert-gap warnings, add MadeToOrder schema`.
2. **Create tracked issue for IAPMO ER-360 verification** (high-severity finding). Plycem contact required before 2026-07-31.
3. **Round 12 candidates** documented for next planning round:
   - F1 minority position (CTA hierarchy on `/long-beach-stock`) revisit when paid-ads plan firms up
   - B1 minority position (parenthetical naming) revisit if architect feedback indicates Plycem cross-reference is missed
   - OpenNext 1-year cache deep-dive
   - Related-products algorithm upgrade
   - Per-product `availability` granularity in `productSchema()`

---

**Synthesis closed. Decisions locked. Ready for R11 application commit.**
