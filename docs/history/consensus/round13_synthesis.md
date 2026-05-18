# Round 13 — Synthesis

**Round date:** 2026-05-18
**Scope:** GEO / AI-overview citation readiness (narrow follow-up to R12).
**Voters (4):** Codex (GPT-5.1), DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1.
**Quorum:** ≥3/4.
**Total cost:** ~$0.04 (5.9k–6.4k prompt tokens × 4 voters; 1.4k–14.6k completion tokens).

---

## 0. CRITICAL META-FINDING — stale artifacts in the prompt

The R13 prompt §4.2 (live titles), §4.8 (llms.txt body), and §4.10 (sitemap.xml status) were carried over verbatim from R12 (2026-05-17) rather than re-pulled at R13 draft time. **All three were stale by the time voters audited.** Live `curl` verification on 2026-05-18 shows:

| Artifact | What R13 §4.x said | What live `curl` returns |
|---|---|---|
| §4.2 home `<title>` | `PLYCEM Non-Combustible Subfloor — Multifamily & Commercial USA` (contains PLYCEM, violates SB-5) | `Non-Combustible Fiber-Cement Subfloor — Multifamily & Commercial USA \| JARA International Inc.` (no PLYCEM, compliant) |
| §4.2 `/products/high-performance-subfloor` `<title>` | `High Performance Subfloor — PLYCEM Fiber-Cement Panel \| JARA International Inc.` | `High Performance Subfloor — Fiber-Cement Panel \| JARA International Inc.` (no PLYCEM) |
| §4.2 `/es` `<title>` | `JARA International Inc. — PLYCEM Entrepiso Alto Desempeño Subfloor en EE.UU. \| JARA International Inc.` (113 chars, brand-bookended, contains PLYCEM) | `Entrepiso Alto Desempeño — Subfloor en EE.UU. \| JARA International Inc.` (71 chars, no PLYCEM, no bookend) |
| §4.8 llms.txt | Lists 6 products; missing deck-modular / lap-siding-tongue-and-groove / corrugated-roof-tile | Lists all 9 products plus 4 resource entries |
| §4.10 sitemap.xml | Single-URL stub (homepage only); all deep pages missing | 20 URLs including all 9 product pages, all /es subroutes, /resources, /service-areas, /contact, /pricing |

**Consequence:** 4 of the 5 highest-severity findings across the voter pool are based on snapshots that no longer reflect production. I'm refuting them in §3 below and reweighting the remaining findings.

**Process fix:** the runbook for R14+ must include a `curl` re-pull step *immediately before* writing the prompt so §4 always reflects current production. Adding this as an action item.

---

## 1. Voter participation

| Voter | Findings | Adjudications | Completion tokens | Notes |
|---|---|---|---|---|
| Codex (GPT-5.1) | 5 | 10 | 5,165 | Conservative; concentrated on high-leverage items |
| DeepSeek V4 Pro | 8 | 10 | 7,987 | Flagged SB-5 title violation (now refuted by live state); strong on trust signals |
| Gemini 3.1 Flash Lite | 4 | 10 | 1,383 | Sparsest output; high precision but narrow recall |
| GLM-5.1 | 13 | 10 | 14,623 | Most thorough; some redundancy across F-IDs |

Note: voter self-identification in `voter` field was unreliable (multiple voters echoed schema example). Filename = model is authoritative.

---

## 2. Consensus findings (post-live-verification)

### 2.1 SHIP IMMEDIATELY — ≥3/4 voters AND verified against live state

#### **F1. Organization schema missing `sameAs` array** — 4/4 unanimous

- **Voters:** Codex F5, DeepSeek F5, Gemini F3, GLM F3
- **Evidence:** `lib/jsonld.ts` `organizationSchema()` omits `sameAs`. `lib/site.ts` `social: { linkedin: '', youtube: '' }` is empty.
- **Severity (consensus):** HIGH (DeepSeek + GLM said HIGH; Codex + Gemini said MEDIUM — vote median = HIGH)
- **Issue:** AI entity-resolution systems (Google Knowledge Graph, Perplexity, Claude) corroborate small-business identity by walking `sameAs` URLs. Empty `sameAs` is a measurable confidence penalty for AI citation.
- **Fix:** Populate `SITE.social` with verified URLs (LinkedIn company page is the highest-leverage single entry — founder action: create/verify if absent). Extend `organizationSchema()` to emit `sameAs: [...verified URLs]`. Add LinkedIn first, then any state Secretary-of-State entity listing if URL-stable.
- **Open:** Does a JARA International Inc. LinkedIn company page currently exist? If no, this finding is blocked on founder creating one. (DeepSeek + Codex both flagged this dependency.)

#### **F2. PostalAddress incomplete on Organization schema** — 4/4 unanimous (folded into the same trust-signal cluster as F1)

- **Voters:** Codex F5, DeepSeek F5, GLM F3 (Gemini implicit via F3)
- **Evidence:** `lib/jsonld.ts` emits `address: { '@type': 'PostalAddress', addressCountry: 'US' }` only — no state, no postal code, no street.
- **Severity (consensus):** MEDIUM
- **Issue:** Bare country-only PostalAddress is a weak entity signal. Adding registered-agent address (state + city + postal code; street optional if privacy-sensitive) does NOT violate ADR-049 because a registered office is not a warehouse claim.
- **Fix:** Extend `SITE` with `registeredAddress: { addressLocality, addressRegion, postalCode, addressCountry }` and emit those fields in `organizationSchema().address`. Founder action: confirm which address is appropriate to publish (registered agent vs. mailing address).

#### **F3. No HowTo / procedural-content schema for install or freight workflow** — 3/4 strong majority

- **Voters:** Codex F3, DeepSeek F7, GLM F5 + F9 (Gemini did not flag)
- **Severity (consensus):** MEDIUM
- **Issue:** AI overviews citing procedural queries ("how to install fiber cement subfloor", "how to import fiber cement from Costa Rica", "container freight lead time") need extractable HowTo structures. Currently absent.
- **Fix (two-phase):**
  1. **Freight/customs flow** (cheap, no Plycem permission needed) — author a numbered "How a JARA order moves from PO to jobsite" page at `/service-areas` or `/resources` (content already partially exists per llms.txt) and emit `HowTo` JSON-LD. Steps: confirmed PO → factory production → ocean freight to US port → customs clearance → final-mile trucking → site delivery. Numbered, dated, with typical durations.
  2. **Install instructions** (blocked) — requires Plycem permission per the documentation redistribution rule. Park until permission obtained.
- **Expected impact:** Captures procedural query class JARA currently cannot win.

### 2.2 ESCALATE TO FOUNDER — 2/4 split or single-voter with strategic weight

#### **F4. Lead product title lacks compliance hook for AI snippet selection** — 2/4 split (Codex F4, GLM F4)

- **Live title (verified):** `High Performance Subfloor — Fiber-Cement Panel | JARA International Inc.` (74 chars).
- **Issue:** The compliance dossier is the entire moat. AI overviews answering "non-combustible subfloor for podium deck" or "UL R15140 fiber cement" will pattern-match on title text first. Current title leaves the moat off the title.
- **Proposed fix:** `High Performance Subfloor — UL R15140 Non-Combustible Fiber-Cement | JARA International Inc.` (89 chars; will SERP-truncate on mobile but the truncated portion is the brand suffix, which is acceptable).
- **Why escalate:** 2/4 quorum below the auto-apply threshold; founder should decide whether the compliance hook in the title is worth the brand-suffix loss on narrow viewports.

#### **F5. Generic-category material comparison (fiber-cement vs OSB / gypcrete)** — 2/4 split (DeepSeek F8, GLM F6)

- **Issue:** SB-3 forbids Plycem-vs-Hardie / Plycem-vs-USG comparisons. It does NOT forbid generic-category comparisons. AI overviews for "fiber cement vs OSB subfloor" or "non-combustible vs gypcrete underlayment" have no JARA presence.
- **Proposed fix:** Add a generic comparison table to `/resources` covering fire performance, structural rating, weight, moisture tolerance, install method. Cite ASTM / UL standards, not brand names.
- **Why escalate:** New content scope; founder should sequence against the IAPMO ER-360 renewal and other open items.

#### **F6. `foundingDate: '2026'` may signal newness penalty** — 2/4 split (DeepSeek F6, GLM F10)

- **Issue:** AI extractors weight entity age. A B2B distributor founded "this year" is a weaker citation than one with multi-year operating history. If the team has prior industry experience under a different entity, the schema currently does not surface it.
- **Proposed fix (options for founder):**
  - (a) Remove `foundingDate` entirely — neutral signal.
  - (b) Keep `foundingDate: '2026'` and add prose context on `/contact` or `/resources` describing prior industry tenure of the principals.
  - (c) If the corporate entity was actually registered earlier, correct to actual incorporation year.
- **Why escalate:** This is a factual/narrative decision, not a technical fix.

### 2.3 SINGLE-VOTER — track but do not auto-apply

| ID | Voter | Title | Notes |
|---|---|---|---|
| F7 | DeepSeek F2 | Cert expirations not in machine-readable text | Worth elevating — IAPMO ER-360 expires **2026-07-31** per CLAUDE.md open items. Add `validThrough` to compliance PropertyValue entries before founder takes action on renewal. |
| F8 | GLM F8 | `manufacturer` is string, not linked Organization entity | Refactor `productSchema()` to emit `manufacturer: { '@id': PLYCEM_ORG_ID, ... }` so AI extractors see a consistent supply graph across all 9 products. Cheap; do it during the next schema touch. |
| F9 | GLM F11 | No FAQPage schema on homepage | FAQ exists on product details. Homepage-level FAQ targeting the lead query class ("what is non-combustible subfloor", "does this meet CBC 7A") would capture answer-engine traffic at the entity root. |
| F10 | GLM F12 | `areaServed` uses `Place.name`, not `AdministrativeArea` with state codes | Marginal — state-code structured form is slightly more extractable. Low priority. |
| F11 | GLM F13 | llms.txt `Cache-Control: max-age=0, must-revalidate` forces revalidation on every AI hit | Low priority — file is small; revalidation cost is negligible. Bring TTL up to match llms-full.txt (`s-maxage=3600`) when convenient. |

### 2.4 REFUTED by live state — do NOT apply

| Voter ID | Claim | Reason refuted |
|---|---|---|
| DeepSeek F1 (CRITICAL) | PLYCEM in titles violating SB-5 | Live `curl` 2026-05-18: no PLYCEM in any rendered title. Artifact §4.2 was stale. |
| Codex F1, DeepSeek F3, Gemini F1 (CRITICAL), GLM F1 (CRITICAL) | llms.txt missing 3 catalog products | Live `curl` 2026-05-18: llms.txt lists all 9 products. Artifact §4.8 was stale. |
| Codex F2 (HIGH), Gemini F2 (HIGH), GLM F2 (HIGH) | Sitemap stub missing deep pages | Live `curl` 2026-05-18: sitemap.xml lists 20 URLs including all product pages and /es subroutes. Artifact §4.10 was stale. |
| DeepSeek F4 (HIGH), Gemini F4, GLM F7 | Spanish /es title brand-bookended at 113 chars | Live `curl` 2026-05-18: /es title is `Entrepiso Alto Desempeño — Subfloor en EE.UU. \| JARA International Inc.` (71 chars, no bookend). Artifact §4.2 was stale. |

---

## 3. External claim adjudication (Gemini off-platform review, G1–G10)

| ID | Claim | Verdict tally | Consensus verdict | Action |
|---|---|---|---|---|
| G1 | "JARA is a global trade / sourcing broker" | 2 REFUTE / 1 CONFIRM / 1 PARTIAL | **REFUTE** | Ignore. JARA is a single-vertical fiber-cement distributor. |
| G2 | "Site is a generic corporate brochure" | 2 REFUTE / 2 PARTIAL | **PARTIAL → leaning REFUTE** | Mostly wrong — site has specific compliance content. Some marketing copy on Hero/ValueProps could tighten. |
| G3 | "Implement deep Organization + Service schema" | 3 PARTIAL / 1 CONFIRM | **PARTIAL** | Organization already deep; `Service` schema for the distribution+freight service is a fair add. |
| G4 | "Titles strictly under 60 characters" | 2 REFUTE / 2 PARTIAL | **REFUTE** | 60 is folklore — Google truncates by pixel width. Front-loaded keywords matter more. |
| G5 | "Convert marketing text to bullets for AI" | 2 CONFIRM / 1 PARTIAL / 1 REFUTE | **PARTIAL → leaning CONFIRM** | Useful where Hero/ValueProps prose runs long. Don't over-bullet. |
| G6 | "Link to customs databases, trade-intelligence registries, shipping manifests" | 4 REFUTE | **UNANIMOUS REFUTE** | Counter-productive — dilutes brand and conflicts with the ADR-049 direct-factory positioning. |
| G7 | "CWV under 2s, WebP/AVIF compressed assets" | 1 REFUTE / 2 PARTIAL / 1 CONFIRM | **PARTIAL** | Already addressed in R12 (next/font display:swap, trimmed weights, AVIF/WebP in `next.config.mjs`). |
| G8 | "Interactive tools / step-by-step verification as AI hooks" | 3 PARTIAL / 1 CONFIRM | **PARTIAL → leaning CONFIRM** | Aligns with F3 (HowTo) above. MaterialCalculator is a good starting hook. |
| G9 | "May 2026 Core Update + Spam/Helpful Content rollouts penalize generic messaging" | 3 REFUTE / 1 PARTIAL | **REFUTE** | Fabricated specifics — no such named updates exist with the framing Gemini used. |
| G10 | "Long-tail intent clusters on operational logistics, compliance" | 3 PARTIAL / 1 CONFIRM | **PARTIAL → leaning CONFIRM** | Aligns with F3 + F5 above. Compliance content is the right direction. |

**Net read:** Gemini's external review was right on 2 items (G5 bullets, G8 interactive hooks — both already partly true on JARA), partly right on 2 (G3 schema, G10 compliance content), and wrong/fabricated on 4 (G1 vertical, G6 customs links, G9 algorithm names, G4 rigid 60-char rule). G2 split. **Approximate signal-to-noise: 4 useful items out of 10 claims.** Recommendation: continue not relying on the off-platform Gemini review as a primary source; the in-process consensus framework is producing higher-precision findings.

---

## 4. Action list (in commit order)

| # | Finding | Files touched | Estimated effort |
|---|---|---|---|
| 1 | F1 — Add `sameAs` to Organization schema | `lib/site.ts` (populate `social.linkedin`), `lib/jsonld.ts` (emit `sameAs`) | 15 min once LinkedIn URL exists; **blocked on founder confirming LinkedIn page** |
| 2 | F2 — Extend PostalAddress with city/state/postal | `lib/site.ts`, `lib/jsonld.ts` | 15 min once founder confirms which address to publish |
| 3 | F7 — Add `validThrough` to compliance PropertyValue | `lib/jsonld.ts` `productSchema()`, `data/products.ts` (cert objects need `validThrough` field) | 30 min |
| 4 | F8 — Promote `manufacturer` to linked Organization entity | `lib/jsonld.ts` (define PLYCEM Organization with `@id`, reference from each Product) | 30 min |
| 5 | F3 — Author `HowTo` for freight workflow + emit schema | `app/service-areas/page.tsx` content + JSON-LD | 1–2 hr |
| 6 | F4 — *(escalation)* Add compliance hook to lead-product title | `app/products/[slug]/page.tsx` `generateMetadata()` | 5 min after founder approves |
| 7 | F5 — *(escalation)* Generic comparison table on `/resources` | `app/resources/page.tsx` | 2–3 hr |
| 8 | F6 — *(escalation)* `foundingDate` decision | `lib/jsonld.ts` | 5 min after founder decides option a/b/c |
| 9 | F9 — Homepage FAQPage schema | `app/page.tsx`, new FAQ data file | 1 hr |

Items 1–5 are auto-apply (≥3/4 quorum or critical single-voter with founder-action-pending dependency). Items 6–8 require founder decision. Item 9 is single-voter but cheap and high-leverage.

---

## 5. Open questions carried forward

Compiled from voter `open_questions` arrays:

1. **`/api/llm-context` content shape** — does the JSON include all 9 products and the freshly-added compliance fields? (Codex, Gemini, GLM all flagged.) **Action:** spot-check before next round.
2. **`llms-full.txt` parity with llms.txt** — does it have the same product completeness? (DeepSeek, GLM.) **Action:** `curl` verify in R14 prompt drafting.
3. **MaterialCalculator extractability** — is its output server-rendered or client-only? AI crawlers can't execute JS. (GLM.) **Action:** read `components/MaterialCalculator.tsx`; if client-only, add SSR fallback or static reference table.
4. **Outbound links to PLYCEM official / IAPMO / UL pages** — would strengthen entity corroboration. Currently absent. (GLM.) **Action:** founder strategic decision — these links exist but adding them is a tradeoff against keeping users on-site.
5. **Compliance certs parsed correctly by Google Product rich-result validator** — `additionalProperty` array of `PropertyValue` is the right shape but Google sometimes ignores it for non-standard cert names. (Gemini.) **Action:** run `validate_jsonld.py` against live home page output, log results in R14 artifacts.

---

## 6. Process improvements for R14+

1. **Re-pull live `curl` artifacts at prompt-draft time.** Do NOT copy-paste §4.x curl snippets from prior rounds. Stale artifacts caused 4 of 5 highest-severity findings in R13 to be invalid against live state.
2. **Embed the curl command + timestamp in each §4 artifact block** so voters know the snapshot age and can flag suspiciously-old data.
3. **Voter self-identification in `voter` field is unreliable** — models echo the schema example. Synthesis should always rely on filename = model mapping, not the field.
4. **Bound voter findings by live-state pre-check.** Future synthesis runs should `curl`-verify each ≥3/4 finding before tabling it. This is what saved R13 from shipping refuted fixes.

---

## 7. Cost

| Voter | Prompt tok | Completion tok | Approx cost |
|---|---|---|---|
| Codex (GPT-5.1) | 5,864 | 5,165 | ~$0.011 |
| DeepSeek V4 Pro | 6,020 | 7,987 | ~$0.008 |
| Gemini 3.1 Flash Lite | 6,447 | 1,383 | ~$0.002 |
| GLM-5.1 | 5,901 | 14,623 | ~$0.019 |
| **Total** | | | **~$0.04** |

Within the $0.03–0.04 estimate from the runbook.
