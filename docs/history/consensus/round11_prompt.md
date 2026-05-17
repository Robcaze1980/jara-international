# Round 11 — Post-launch retrospective + positioning correction + catalog expansion

**Type:** Retrospective review of 5 commits shipped 2026-05-16 + forward decisions on Spanish/English brand language, schema availability signal, and `/long-beach-stock` paid-ads handling.
**Voters (5):** DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1, Codex (GPT-5.1), Claude Opus 4.7.
**How this prompt is executed:** see `round11_runbook.md` (operator-only, not part of the voter prompt). 4 voters via `scripts/consensus_call.py` + OpenRouter; the Claude voter must come from a fresh session (not the work-doing session) to avoid reviewing its own shipped work.
**Quorum:** ≥3/5 simple majority per item (ADR-032). Synthesis MUST report vote margin.
**Strategic priority:** Site is LIVE on jarainternational.com via Cloudflare Workers/OpenNext. All changes below are deployed. This round is reviewing whether each change should be KEPT, MODIFIED, or REVERTED — not whether to ship them.

---

## 1. CONTEXT — what happened on 2026-05-16

Five commits landed on `main` in one working day. All are live in production:

| Commit | Title | Lines | Theme |
|---|---|---|---|
| `34a2353` | fix(husky): make design.md pre-commit hook non-blocking on Windows | +16 / -1 | Hook fix |
| `abb8dfd` | fix(positioning): remove Long Beach warehouse claims (ADR-049) | +575 / -365 (24 files) | Positioning correction |
| `20b283e` | feat(positioning): lead homepage with PLYCEM Alto Desempeño subfloor | +212 / -52 (8 files) | Homepage redesign |
| `099d544` | feat(catalog): add 3 new Plycem products (Deck Modular, Lap Siding, Eureka roof tile) | +149 (1 file) | Catalog expansion |
| `666a8db` | chore(catalog): add shared application strings so related-products links new SKUs | +3 (1 file) | Polish |

**Trigger:** founder clarified on 2026-05-16 that the "Long Beach warehouse" referenced throughout the Sprint 1–10 design rounds is NOT JARA's. It is a third-party distributor's ~900-sheet pass-through position. The importer has not committed to continuing imports. ADR-049 was written to supersede the warehouse portion of ADR-017 and the homepage premise of ADR-024 HC1 / ADR-025 HD2. Founder then redirected the work to also execute the original "subfloor as hero product" strategy that had been discussed earlier in the day but deferred while the warehouse correction was being applied.

---

## 2. WHAT'S LOCKED (do not re-debate)

These were decided by the founder directly during the session:

- **ADR-049 is in effect.** JARA does not market a US warehouse. Direct factory shipping from Plycem manufacturing in Costa Rica / El Salvador / Honduras with typical 3–4 week door-to-door delivery is the new operational positioning. Cannot be re-opened by this round.
- **Subfloor is the hero product.** Founder confirmed this strategic direction explicitly. The homepage SHOULD lead with `high-performance-subfloor` (PLYCEM Entrepiso Alto Desempeño). Cannot be re-opened.
- **Plycem Entrepiso Residencial (SKU 1322729) is excluded from the catalog.** Cert verification confirmed it carries only Costa Rica RTCR 491:2017 + INTE/ISO 8336:2018 — no UL, no ASTM C1186 at SKU level, no IAPMO, no IBC, no CBC. Verified via official Plycem datasheet PDF extraction. Cannot be re-opened.
- **Husky pre-commit hook is non-blocking.** Underlying `@google/design.md@0.1.x` throws `raw.match is not a function` regardless of how it is invoked — an alpha-package bug. Hook still runs, surfaces output, but does not gate commits. Cannot be re-opened.
- **`/long-beach-stock` page exists, noindex+nofollow.** Founder chose "hidden, paid-ads only" framing for the partner stock. This round can reconsider the SHAPE of that page but not its existence.

Ship blockers SB-1..SB-9 from MASTER_AUDIT §5 remain hard floors. No vote on SB items.

---

## 3. WHAT THIS ROUND IS NOT

- NOT a re-vote on the 32 prior ADRs (1–044 + the warehouse-superseded portions of 017/024/025).
- NOT planning Phase 6 (downloads library, real photography, Spanish detail pages, video integration). Those need either Plycem permission, asset delivery, or a separate planning round.
- NOT a re-debate of the v0 dossier KILL list (already disposed in Round 10).
- NOT a vote on the Plycem Residencial product (already excluded by cert verification, not by ADR).

---

## 4. WHAT THIS ROUND IS

**8 retrospective + forward-looking decisions** on the changes shipped 2026-05-16. Voters review what was done, whether to KEEP / MODIFY / REVERT, and flag any blocker `additional_findings` discovered during review.

Items:

- **R11-A** — Homepage redesign (Hero + ValueProps + FeaturedProducts as one decision)
- **R11-B** — Spanish proprietary product names in English-locale copy
- **R11-C** — Catalog addition: Deck Modular (low-risk niche product)
- **R11-D** — Catalog addition: Lap Siding T&G (HardiePlank-competitor without ESR)
- **R11-E** — Catalog addition: Corrugated Roof Tile (no UL Class A, explicit disclosure approach)
- **R11-F** — `/long-beach-stock` paid-ads landing page handling
- **R11-G** — JSON-LD changes (LocalBusiness removal + Product `availability: InStock` drop)
- **R11-H** — `serviceAreas` regional expansion (CA/AZ/NV city list → continental US region list)

---

## Item R11-A — Homepage redesign (Hero + ValueProps + FeaturedProducts)

**Status:** Shipped in commit `20b283e`. Live on jarainternational.com.

**What we did:**

1. **`components/Hero.tsx`** — Replaced the generic "Non-Combustible Fiber-Cement Panels for Type I & II Construction" headline with a subfloor-specific framing: *"Non-Combustible Fiber-Cement Subfloor for Multifamily and Commercial Construction."* Body copy specifies UL R15140, Type V over podium, hotels, steel-joist commercial floors, modular. Added a thickness-pill spec strip (20mm · 22mm · 25mm · 30mm · Straight or T&G). CTAs changed from generic "Estimate My Project / View Products" to "Calculate My Project / View Subfloor Specs" with the second now deep-linking to `/products/high-performance-subfloor`.
2. **`components/ValueProps.tsx`** — Replaced the three Round 6 ADR-024 HC1 props (which led with "In Stock, Long Beach CA") with: Direct factory pricing · 3–4 week door-to-door · Spec & code ready. Bilingual support no longer surfaced as a homepage value prop (moved to `/contact` page detail).
3. **`components/FeaturedProducts.tsx`** — Restructured into two tiers. A featured large two-column card for High Performance Subfloor with rich spec highlights (UL fire-rated assemblies list, full US compliance package summary, 7-variant range) and dual CTAs (View full subfloor specs / Calculate my project). Below it, a "Complete the envelope" subhead with the remaining products in a 3-col grid.

**Why:**
- Subfloor is the only product in the catalog with a complete US compliance dossier (UL R15140 + ASTM E-136 + IAPMO ER-360 + IBC 2021 Type I/II + CBC Chapter 7A). Every other product competes in commodity-feel categories where buyers shop on price.
- Subfloor pull-through: a 5-over-1 multifamily spec drags 30–80k sq ft of subfloor per building, opens the container relationship, and lets the rest of the envelope (cladding / roof / cement board) cross-sell on the same PO.
- Mirrors Plycem.com's own brand structure where "Entrepiso Alto Desempeño" is the spec-driven anchor under "Soluciones > Entrepisos".

**Tradeoffs accepted:**
- Narrows top-of-funnel toward architects / spec writers / commercial GCs. Loses some appeal to contractor walk-ups who would have entered through Deck or Hidden Joint.
- A subfloor-led brand is harder to pivot if Jara later expands into other product categories not in the current catalog.
- Hero placeholder SVG is unchanged — visual upgrade still pending real photography.

**Options:**

- **A1 (KEEP):** Subfloor-hero stays as shipped. Founder explicitly approved the strategy and the implementation has shipped clean.
- **A2 (TUNE-VALUEPROPS):** Keep Hero + FeaturedProducts as-is, but revisit ValueProps. The bilingual-support pillar from Round 6 ADR-024 HC1 was a deliberate JARA differentiator vs. US-domestic competitors (HardiePlank-only sales teams typically don't speak Spanish to Hispanic site crews). Restoring bilingual as a third pillar would mean dropping one of the new three. Voters specify which to drop.
- **A3 (TUNE-FEATUREDPRODUCTS):** Keep Hero + ValueProps, but reconsider the two-tier FeaturedProducts. Critique: the featured subfloor card is visually heavy (Round 5 GLM-style WCAG/density concerns may surface). Alternative is to keep all 9 products in an equal-prominence 3-col grid with subfloor visually marked (badge / border accent) rather than physically larger.
- **A4 (REVERT):** Roll back to the pre-`20b283e` generic-multi-product hero. Reason a voter might choose this: if the subfloor-hero narrows too aggressively without enough proof in the rest of the page that JARA carries the full envelope.

---

## Item R11-B — Spanish proprietary product names in English-locale copy

**Status:** Shipped in commit `20b283e` and follow-on `099d544`. Founder caught this during the session and flagged it before this round was written.

**What we did:**

The English-locale copy currently mixes Plycem's Spanish proprietary product names directly into English sentences:

- Hero eyebrow: *"PLYCEM ENTREPISO ALTO DESEMPEÑO · MULTIFAMILY · HOTEL · TYPE I/II COMMERCIAL"*
- Hero body: *"PLYCEM Entrepiso Alto Desempeño — the UL R15140 classified structural subfloor..."*
- Homepage metadata title: *"PLYCEM Non-Combustible Subfloor — Multifamily & Commercial USA"* (no Spanish here, but)
- Homepage metadata description: *"US distributor of PLYCEM Entrepiso Alto Desempeño..."*
- FeaturedProducts H2: *"PLYCEM Entrepiso Alto Desempeño — the subfloor that goes on US spec drawings"*
- `/products` page H1: *"PLYCEM Entrepiso Alto Desempeño subfloor — plus the complete panel envelope"*
- `lib/site.ts` description: leads with *"US distributor of PLYCEM non-combustible fiber-cement structural subfloor..."* (no Spanish — clean)
- `/llms-full.txt` and `public/llms.txt` "About" sections: lead with bold *"PLYCEM Entrepiso Alto Desempeño"* before the English explanation.
- `/es/page.tsx` Spanish landing: uses Spanish names (culturally appropriate, no issue).

Our `data/products.ts` names the product **"High Performance Subfloor"** in English, but the marketing surfaces lean on the Spanish proprietary name.

**Why this happened (Claude's self-report):**

I imported Plycem's Spanish branding into English copy under the assumption that "preserving Plycem's authentic product name" was a credibility signal. The founder pointed out it reads as foreign-language clutter to US architects and specifiers and may confuse buyers into thinking the company is LatAm-focused or not US-incorporated. This was a Claude unforced error, not a founder direction.

**Tradeoff lens:**
- Preserving the Spanish name keeps a thread of brand authenticity with Plycem ("we're not relabeling the product, we're distributing the manufacturer's named SKU"). Some specifiers cross-referencing Plycem datasheets will appreciate seeing the same product name.
- Removing the Spanish name aligns with US-locale UX norms and matches the `data/products.ts` English product name. Reduces friction.
- Hybrid (English primary, Spanish parenthetical) preserves both at the cost of verbosity.

**Options:**

- **B1 (REMOVE):** Replace all Spanish proprietary names with English equivalents in English-locale surfaces. Hero / metadata / FeaturedProducts / `/products` H1 / llms.txt all use "High Performance Subfloor" or "PLYCEM High Performance Subfloor." `/es` page unchanged. Cleanest read for US buyers.
- **B2 (PARENTHETICAL):** Keep English primary, add Spanish parenthetical on the first mention per page: *"PLYCEM High Performance Subfloor (Entrepiso Alto Desempeño)"*. Preserves cross-reference to Plycem datasheets. More verbose but bi-cultural.
- **B3 (KEEP-AS-SHIPPED):** Leave the Spanish names in. Rationale: distributor authenticity. Risk: reads as ESL / foreign / unprofessional to US specifiers.
- **B4 (HERO-ONLY-REMOVE):** Apply B1 to the Hero only (highest-visibility surface) but leave Spanish names in the FeaturedProducts H2, /products H1, llms.txt About sections. Compromise that addresses the most-visible offender while preserving brand-authenticity threading deeper in the site.

---

## Item R11-C — Catalog addition: Deck Modular

**Status:** Shipped in `099d544`. Live at `/products/deck-modular`.

**What we did:**

Added the new product `deck-modular` with two variants (SKUs 1330393 graphite, 1330392 wood-look), 300×300×14mm interlocking fiber-cement tiles. Datasheet verified directly from Plycem PDF.

**Compliance listed:**
- ASTM C1186-08 Type A Grade I ✓
- ISO 8336:2018 ✓
- ASTM E-84 (surface burning, tested) ✓
- ISO 9001/14001/45001 manufacturing certified (CR + SV + HN — broader origin than other Plycem products) ✓

**Why:**
- US outdoor modular flooring is an established category (Trex, IKEA Runnen, polypropylene grids). Buyers do not require UL or fire ratings for outdoor patios / balconies / rooftop decks where this product would sell.
- ASTM C1186 is the foundational US fiber-cement standard. With it, the product can stand on its own credentials against polymer competitors.
- Aesthetic and durability differentiator vs. plastic. Wood-look or graphite finish with fiber-cement long-term weathering.
- Pull-through opportunity: same buyer interested in subfloor for multifamily Type V over podium projects may also need rooftop terrace surfaces for the same building.

**Tradeoffs accepted:**
- Niche market segment. Smaller TAM than mainstream products.
- Placeholder image only (SVG). Real product photo is a Plycem-permission question.

**Options:**

- **C1 (KEEP):** Product stays in catalog as shipped.
- **C2 (REVERT):** Remove from catalog. Reason: niche / non-strategic.
- **C3 (TUNE-COPY):** Keep but rewrite `longDescription` to emphasize the rooftop-deck-above-occupied-space pull-through angle (clean tie-back to subfloor projects). Voters specify the new framing.

---

## Item R11-D — Catalog addition: Lap Siding (Tongue-and-Groove)

**Status:** Shipped in `099d544`. Live at `/products/lap-siding-tongue-and-groove`.

**What we did:**

Added new product `lap-siding-tongue-and-groove` with three variants (SKUs 960199 Clásico 306.5mm wide, 960190 Clásico 246.5mm, 960192 Cedro 246.5mm). 14mm fiber-cement T&G horizontal plank siding × 2444.5mm long.

**Compliance listed:**
- ASTM C1186-08 Type A Grade I ✓
- ISO 8336:2018 ✓
- ASTM E-84 (tested) ✓
- ISO 9001/14001/45001 manufacturing ✓

**NOT listed:** UL R15140, IAPMO ER-360, IBC compliance, CBC Chapter 7A. **No ICC-ES ESR equivalent to HardiePlank's ESR-2290.**

The first FAQ on the product page explicitly addresses the HardiePlank comparison and the missing ESR so specifiers can make an informed call before referencing the product in a wall assembly.

**Why:**
- ASTM C1186 is the floor standard for US fiber-cement siding. Without it the product cannot enter the US conversation; with it, it can be discussed as a HardiePlank alternative.
- Architectural T&G profile + Cedro wood-grain finish is a meaningful aesthetic differentiator vs. HardiePlank's primarily smooth or wood-grain options.
- Hidden-fastener install (T&G interlock) produces a cleaner wall plane than HardiePlank's exposed-nail lap.

**Tradeoffs accepted:**
- HardiePlank dominates the US lap-siding market. Without an ICC-ES ESR, this is a hard sell to architects who default to ESR-referenced assemblies for insurance and AHJ comfort.
- The "addressable market" is residential and light commercial. Larger commercial wall assemblies will continue to specify HardiePlank.
- Real risk: a specifier may use this product on a project that later fails AHJ review for lack of ESR documentation. The FAQ addresses this defensively but does not eliminate the risk.

**Options:**

- **D1 (KEEP):** Product stays in catalog with the HardiePlank-comparison FAQ as the primary risk-mitigation surface.
- **D2 (KEEP-PLUS-LABEL):** Keep the product, but add a visually distinct "ESR-not-available — confirm AHJ acceptance" badge to the product detail page (similar to the amber warning callout on `/long-beach-stock`). Defensive design to make the cert gap unavoidable for any specifier landing on the page.
- **D3 (REVERT):** Remove from catalog until/unless Plycem secures an ICC-ES evaluation report. Cleanest cert posture; loses the addressable lap-siding revenue stream.
- **D4 (PAUSE):** Keep in catalog but hide from main `/products` listing and homepage `FeaturedProducts`. Reachable only via direct URL. Lets Jara show it to specific customers asking about lap siding without committing to it as a brand-level product.

---

## Item R11-E — Catalog addition: Corrugated Roof Tile (Eureka Sevillana)

**Status:** Shipped in `099d544`. Live at `/products/corrugated-roof-tile`.

**What we did:**

Added new product `corrugated-roof-tile` with four variants (SKUs 1316260, 1316168, 1315994, 1316230). Sinusoidal corrugated fiber-cement Spanish-tile-profile roofing, 5.7mm thick × 920mm wide × 1040mm or 1340mm long. Six architectural colors (Cerámico, Ladrillo, Naranja, Ocre Otoño, Rojo Teja, Verde Aceituna).

**Compliance listed:**
- ISO 9001/14001/45001 manufacturing certified
- INTE/ISO 8336:2018
- Costa Rica RTCR 491:2017

**NOT listed and explicitly disclosed in the product copy:**
- UL 263 / UL 790 Class A fire-rated roof classification — NOT available.
- ICC-ES ESR — NOT available.

The cert-gap disclosure is repeated FOUR places: shortDescription, longDescription, applications list (one application bullet literally reads *"US installations only where AHJ does not require UL Class A fire-rated roof"*), and the lead FAQ explains why the cert is missing and which US jurisdictions reject the product (California Chapter 7A WUI, Miami-Dade HVHZ, insurance-driven specs).

**Why:**
- Caribbean / Central American / international export markets where local codes do not require US fire-rated roof ratings can specify this product without issue. Including it in the catalog opens the international-export revenue stream.
- Some US installations in jurisdictions WITHOUT Class A roof requirements (rural, certain Southern states, non-WUI counties) can use it legally. The product fits a real if small US use case.
- Aesthetic differentiator: Spanish-tile profile at ~1/3 the weight of clay tile. Plycem invested in the colors and the architectural detail; the product is a credible Plycem brand asset.

**Tradeoffs accepted:**
- Highest-risk product in the catalog. A US specifier landing on this page in a Class A jurisdiction MUST notice the disclosure before specifying.
- Quadruple-disclosure (description × 2 + applications + FAQ) is defensive but verbose. Trades reader experience for risk mitigation.
- Without UL Class A, the natural US sales motion (Spanish-tile architectural aesthetic in California) is exactly where the cert gap matters most.

**Options:**

- **E1 (KEEP):** Product stays in catalog with the four-place cert-gap disclosure as risk mitigation.
- **E2 (KEEP-PLUS-WARNING-BANNER):** Keep, but add a top-of-page amber warning banner (matching `/long-beach-stock` pattern) that ALWAYS displays when a user lands on the product detail page. Makes the cert gap visually impossible to miss.
- **E3 (REVERT):** Remove from catalog. JARA accepts losing the international/export use case to maintain a cleaner US-cert-only brand. Reason a voter might choose this: liability exposure if a US specifier ignores the disclosures.
- **E4 (HIDE):** Keep in catalog but mark as "export-only" — exclude from main `/products` listing and homepage. Reachable via direct URL for Jara to share with specific Caribbean / international inquiries. US-domestic surface area zeros out.

---

## Item R11-F — `/long-beach-stock` paid-ads landing page handling

**Status:** Shipped in `abb8dfd`. Live at `/long-beach-stock` (noindex, nofollow).

**What we did:**

Created a hidden landing page at `/long-beach-stock` with `robots: { index: false, follow: false }`. NOT linked from main navigation, footer, sitemap, or llms.txt. Reachable only via direct URL or paid-ads click-through.

Page framing is honest: *"A limited quantity of PLYCEM fiber-cement panels is currently available through our distribution partner in Long Beach, California."* Amber warning callout states: *"This Long Beach inventory is a one-time pass-through position held by a third-party distributor; quantities and SKU mix change. JARA does not operate a Long Beach warehouse."* Calls to action: Anna phone line + WhatsApp + email with subject "Long Beach stock availability".

**Why:**
- Founder chose "hidden, paid-ads only" framing during the session. This page is the landing destination for future Google Ads / Meta Ads targeting California fiber-cement keywords while the partner's ~900 sheets sell through.
- Allows short-term lead capture without making temporary inventory a brand pillar.
- Honest framing protects against misrepresentation if the inventory clears or the importer disappears.

**Tradeoffs accepted:**
- The page exists today but has no traffic yet — paid-ads campaign is a separate Jara go-to-market task.
- When the partner inventory clears, the page should be removed or 301-redirected to `/`. ADR-049 open items flagged this.
- A determined competitor could find the page by URL pattern guessing and use it as evidence that JARA's positioning is inconsistent (claims "no US warehouse" on the main site, but maintains this page). The amber callout's honesty mitigates this.

**Options:**

- **F1 (KEEP):** Page stays as shipped. Wait for Jara to wire up paid-ads campaign separately.
- **F2 (TUNE-CTAS):** Keep page structure but redesign the CTAs. Currently three equal-weight contact channels (phone / WhatsApp / email). For paid-ads conversion, a single dominant CTA (likely the phone line) with secondary channels is typically higher-converting.
- **F3 (TUNE-CONTENT):** Keep page but rewrite copy to be less defensive and more sales-forward. Currently the amber callout occupies prime real estate. Voters might argue the disclosure can be smaller / lower without sacrificing honesty.
- **F4 (REVERT):** Delete the page. Reason a voter might choose this: the paid-ads campaign may not happen, the inventory may already be clearing organically, and maintaining a "hidden" page is hygiene debt with no demonstrated revenue.

---

## Item R11-G — JSON-LD changes (LocalBusiness removal + Product `availability: InStock` drop)

**Status:** Shipped in `abb8dfd` as part of the warehouse-correction commit.

**What we did:**

1. **Deleted `localBusinessSchema()` from `lib/jsonld.ts`.** Stopped emitting LocalBusiness JSON-LD on every page via root layout. Reason: JARA has no US physical address; LocalBusiness with geo-coordinates (33.7701, -118.1937 — the Long Beach approximate) was a misrepresentation.
2. **Dropped `availability: 'https://schema.org/InStock'` from `productSchema()`.** Every Product JSON-LD on `/products/{slug}` pages previously claimed in-stock availability. Without a US warehouse, this is false; without any availability signal, Google may not surface the rich product snippet at all.
3. **Minimized Organization JSON-LD address to `addressCountry: 'US'` only.** Sufficient to indicate US incorporation without claiming a specific physical location.

**Why:**
- Schema.org accuracy. False signals erode trust with Google and AI crawlers over time.
- LocalBusiness with a fake geo-coordinate was a Round 1 DeepSeek finding that became ADR-017 — but the underlying premise was incorrect, so the schema was incorrect.

**Tradeoffs accepted:**
- **Lost Google Maps eligibility.** Without LocalBusiness schema + a real address, JARA cannot appear in Google Maps results. Since JARA is not a local business, this is appropriate but a documented loss.
- **Lost Product rich-snippet eligibility for `InStock` signal.** Google's product card on search results may not surface for our products. Schema.org alternatives: `MadeToOrder`, `PreOrder`. Omitting availability was chosen as the most-defensible "no false signal" option.

**Options:**

- **G1 (KEEP-AS-SHIPPED):** No availability signal on Product schema. No LocalBusiness. Accept the rich-snippet loss for accuracy.
- **G2 (ADD-MADETOORDER):** Add `availability: 'https://schema.org/MadeToOrder'` back to Product schema. Restores rich-snippet eligibility under a different and honest signal — MadeToOrder accurately reflects container-direct supply with 3–4 week lead time. Schema.org permits this and Google indexes it.
- **G3 (ADD-PREORDER):** Add `availability: 'https://schema.org/PreOrder'` back. Similar restoration; PreOrder typically means "not yet available but can be ordered now" — less semantically accurate than MadeToOrder for direct-import distribution. Listed for completeness.
- **G4 (RESTORE-INSTOCK-LIMITED):** Restore `InStock` on the Product schema ONLY for the `high-performance-subfloor` product slug if the Long Beach partner stock includes subfloor variants. This is the only product with arguably-true in-stock availability via the partner. Risky — couples our Product schema to a third-party inventory we don't control.

---

## Item R11-H — `serviceAreas` regional expansion

**Status:** Shipped in `abb8dfd`. Live in `lib/site.ts` and cascades to Organization JSON-LD, Product schema `areaServed`, `/api/llm-context`, `/llms-full.txt`, `public/llms.txt`, `/service-areas`, and `/es/service-areas`.

**What we did:**

Replaced the previous Round 3 ADR-017 SD2 list (10 California / Arizona / Nevada cities anchored on Long Beach warehouse radius) with 10 continental US regions:

| Before (10 CA/AZ/NV cities) | After (10 US regions) |
|---|---|
| Long Beach, CA | California |
| Los Angeles, CA | Pacific Northwest |
| Orange County, CA | Mountain West |
| San Diego, CA | Arizona & Nevada |
| Inland Empire, CA | Texas |
| San Francisco Bay Area, CA | Southeast |
| Sacramento, CA | Florida |
| Central Valley, CA | Midwest |
| Phoenix, AZ | Northeast |
| Las Vegas, NV | Mid-Atlantic |

**Why:**
- Without a US warehouse anchoring a delivery radius, city-level granularity is misleading. The new positioning serves containers anywhere in continental US via port routing (Long Beach, Houston, Miami, NY/NJ depending on jobsite proximity).
- Regional list reflects the reality of container-direct supply and broadens the addressable market signal.

**Tradeoffs accepted:**
- Loses local SEO surface area for the previous 10 cities. *"Fiber cement supplier near me"* searches in those specific markets no longer resolve to JARA via city-name matching.
- Founder cannot easily walk back to a "we're a California specialist" narrative if the broader continental US strategy underperforms.

**Options:**

- **H1 (KEEP-REGIONS):** 10 US regions as shipped. Honest about continental US footprint.
- **H2 (EXPAND-MIXED):** Mixed list — keep CA / AZ / NV cities (still legitimate even without warehouse, since this is where the partner stock plus paid-ads campaign will focus) and supplement with continental US regions. List grows from 10 to ~15. Higher SEO surface, more verbose.
- **H3 (REVERT-CITIES):** Restore the 10 city list. Reason a voter might choose this: local SEO matters more than positioning accuracy for an early-stage distributor. Risk: contradicts ADR-049.

---

## 5. KNOWN ISSUES / OPEN QUESTIONS (not voted on this round)

These items are flagged for awareness but should NOT be folded into voter selections. They surface naturally in synthesis or in a future round.

- **IAPMO ER-360 verification.** Current `exterior-cement-board` catalog entry claims IAPMO ER-360 valid through 2026-07-31. June 2024 Microconcreto Exterior datasheet from Plycem does NOT list it. Cert may still be valid (within window), may have been retired. Founder chose "leave as-is for now" during session; verification with Plycem before 2026-07-31 is a follow-up.
- **Plycem PDF redistribution rights.** All Plycem datasheets state *"Está información es propiedad intelectual de Plycem, queda expresamente prohibida la reproducción total o parcial sin el permiso expreso del titular."* Per-product downloads library (Plycem-style) requires written permission from Plycem before any PDF can be hosted on jarainternational.com.
- **Real product photography.** All 9 products currently use placeholder SVG. Visual upgrade requires either Jara-produced photos or licensed Plycem photos with permission. Plycem ship blocker SB-7 applies.
- **`@google/design.md` upstream bug.** Pre-commit hook is non-blocking because the alpha package throws `raw.match is not a function`. Tighten the hook (remove the `|| echo ...` fallback) once Google Labs ships a fix.
- **`/long-beach-stock` lifecycle.** Page should be removed or 301-redirected to `/` when partner inventory clears. ADR-049 open items.
- **OpenNext default 1-year HTML cache.** `Cache-Control: s-maxage=31536000` on prerendered pages comes from OpenNext defaults, not our code. Practical impact low (Cloudflare auto-purges on deploy + no browser `max-age` set), but worth deeper investigation if a future deploy serves stale content.
- **Related-products algorithm.** Jaccard over exact-string applications matches has only minimal overlap. Commit `666a8db` added shared application strings to each new product so related-products links to one existing product each — adequate for now, but a token-similarity or LLM-classified categorization would produce better neighbors.

---

## 6. ASSUMPTIONS / NON-NEGOTIABLES FOR VOTING

- Founder approval of ADR-049 (warehouse correction) and subfloor-hero strategy is binding. Voters cannot REVERT those at the strategic level — only refine within the implementation choices listed.
- Plycem ship blockers SB-1..SB-9 are contractual. No voter can override them.
- Site is live and shipped. Reverts are real — they will be applied as another commit on `main` and re-deploy via Cloudflare. Voters should consider whether the cost of revert exceeds the benefit.
- A unanimous KEEP (5-0) on any item locks that item as an ADR; a bare-quorum KEEP (3-2) gets locked with a synthesis note flagging the dissent.

---

## 7. VOTER RESPONSE FORMAT

Return JSON with the following shape (matching Round 10):

```json
{
  "model": "<your model id>",
  "agent": "<your agent name>",
  "votes": {
    "A": "A1" | "A2" | "A3" | "A4",
    "B": "B1" | "B2" | "B3" | "B4",
    "C": "C1" | "C2" | "C3",
    "D": "D1" | "D2" | "D3" | "D4",
    "E": "E1" | "E2" | "E3" | "E4",
    "F": "F1" | "F2" | "F3" | "F4",
    "G": "G1" | "G2" | "G3" | "G4",
    "H": "H1" | "H2" | "H3"
  },
  "reasoning": {
    "A": "1-2 sentences on rationale",
    "B": "1-2 sentences",
    "C": "1-2 sentences",
    "D": "1-2 sentences",
    "E": "1-2 sentences",
    "F": "1-2 sentences",
    "G": "1-2 sentences",
    "H": "1-2 sentences"
  },
  "additional_findings": [
    {
      "title": "...",
      "description": "...",
      "severity": "low" | "medium" | "high" | "blocker",
      "applies_to_phase": "5" | "6" | "post-launch"
    }
  ],
  "verdict": "ship" | "tune" | "rollback",
  "verdict_reason": "1-2 sentences overall"
}
```

### Voting independence
- Vote independently. No cross-voter visibility.
- Reasoning fields terse (1-2 sentences) but specific enough that synthesis can group convergent rationales.
- This prompt is immutable once sent. Adjustments only via a Round 11.5 follow-up prompt if a blocker `additional_findings` requires it.
- `additional_findings` should focus on things the prompt missed — emergent issues, schema bugs, broken assumptions, etc. Be specific (file paths, line numbers, exact error messages).

---

**Prompt closed. Cast your vote.**
