# Round 13 — GEO / AI-Overview Citation Readiness Audit

**Type:** Independent scoped audit. Each voter audits alone and reports findings. Consensus = ≥3/4 voters surface a finding independently.
**Voters (4):** Codex (GPT-5.1), DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1.
**Claude is NOT a voter** (per CLAUDE.md governance — cost + conflict-of-interest).
**Quorum:** ≥3/4 simple majority per finding. Synthesis will report vote margin per item.
**Round date:** 2026-05-18.

---

## 0. WHY THIS ROUND EXISTS

Round 12 audited the site across six broad dimensions (technical SEO, on-page SEO, schema, AI friendliness, performance, Cloudflare infra). Findings shipped 2026-05-17 as commit `e5f6e9fb`.

Round 13 narrows to a single question:

> **When an AI search engine (Google AI Overviews, Perplexity, ChatGPT Search, Claude Search, Gemini Answer) receives a B2B query relevant to non-combustible fiber-cement subfloor in the United States, how citation-ready is `jarainternational.com` today — and what specific, cheap-to-ship changes would measurably raise its citation probability?**

This is NOT a re-audit of Round 12 dimensions. Do not re-flag the same `<title>`/canonical/schema items already resolved in R11/R12 unless your evidence shows the fix regressed.

A secondary task is bundled (§5): adjudicate an external SEO review that an off-platform Gemini instance produced on 2026-05-18. Several of its claims look like hallucination (it framed JARA as a "global trade and sourcing broker"); confirm or refute them on the evidence.

---

## 1. CONTEXT — what JARA International is

JARA International Inc. is a US-incorporated B2B distributor of PLYCEM non-combustible fiber-cement structural panels. The website is **https://jarainternational.com**, deployed via Cloudflare Workers + OpenNext from a Next.js 15 App Router codebase.

**Strategic positioning (locked, do not vote on):**
- Lead product = **High Performance Subfloor** (PLYCEM Entrepiso Alto Desempeño) — the only product in the catalog with the complete US compliance dossier (UL R15140 + ASTM E-136 non-combustible + IAPMO ER-360 + IBC 2021 Type I/II + CBC Chapter 7A).
- The other 8 products frame as "complete the envelope" supporting cast.
- JARA does NOT operate a US warehouse. Material ships direct from PLYCEM manufacturing plants in Costa Rica / El Salvador / Honduras → ocean freight → US port → customs → truck to jobsite. Typical door-to-door: 3–4 weeks.
- B2B audience: contractors, architects, engineers, developers, procurement managers, building officials.
- Primary market: continental United States. Spanish (`/es`) is a single landing page for US Hispanic construction labor, not LatAm export.

---

## 2. LOCKED CONSTRAINTS — DO NOT vote against these

(Identical to R12; repeated verbatim because OpenRouter voter calls are stateless.)

### 2.1 Plycem ship blockers SB-1..SB-9 (CONTRACTUAL)

| ID | Rule |
|----|------|
| SB-1 | No "PLYCEM" in primary domain — `jarainternational.com` only |
| SB-2 | JARA brand identity, not Plycem's |
| SB-3 | No Plycem-vs-USG / Plycem-vs-Hardie comparisons |
| SB-4 | No Plycem list prices anywhere. Quote-only. No `price`/`priceCurrency` in JSON-LD `offers` |
| SB-5 | No "PLYCEM" in `<title>` tags |
| SB-6 | No "Authorized Distributor" wording. Use "US-based distributor of PLYCEM products" |
| SB-7 | No Plycem logo without written approval. Text wordmarks only |
| SB-8 | Footer copyright = "© 2026 JARA International Inc." |
| SB-9 | Email domain = `@jarainternational.com` |

Plycem datasheets/install manuals/commercial catalogs CANNOT be redistributed without written permission. The downloads library is blocked on that permission.

### 2.2 ADR-049 — warehouse positioning lock

- JARA does NOT operate a US warehouse. Do not recommend reintroducing "Long Beach warehouse", "0–3 day delivery", "in stock", or "California stock" claims.
- `serviceAreas` = continental US regions, not cities.
- `LocalBusiness` JSON-LD has been removed; do not restore.
- Product schema `availability` = `https://schema.org/MadeToOrder` (locked R11-G2 5-0).
- `/long-beach-stock` is a hidden `noindex,nofollow` paid-ads landing page for a partner's ~900-sheet pass-through inventory. It exists; do not recommend deleting it.

### 2.3 Subfloor-as-hero + English-locale naming + cert-gap warnings

Founder-locked from R11. Do not relitigate.

---

## 3. AUDIT DIMENSIONS — GEO/AI-overview citation readiness

Cover all five. Each finding must cite a specific artifact section (§4.x) and propose a concrete fix (file path + change).

### 3.1 AI-overview *citation hooks* — extractable, quotable surface

AI overviews quote what is easy to lift cleanly. Evaluate whether the site provides:
- **Atomic factual claims** an AI can quote in 1–2 sentences without ambiguity (e.g., "ASTM E-136 non-combustible per IAPMO ER-360, valid through 2026-07-31").
- **Proprietary data** unavailable elsewhere (port-to-door lead times by origin country, container-load sheet counts, panel weight per assembly type, compliance matrices).
- **Comparison tables** that don't violate SB-3 (e.g., generic fiber-cement-vs-OSB or fiber-cement-vs-gypcrete — NOT brand vs. brand).
- **Numbered procedural content** (install workflow, freight booking sequence, customs clearance steps).
- **Named-entity density** — does the prose mention the specific code citations (IBC 2021 §602, CBC §704A), specific test standards (ASTM E-84 Class A), and specific assembly UL numbers, in a form a model can pattern-match?

### 3.2 LLM-readable surface — `llms.txt`, `llms-full.txt`, `/api/llm-context`

- Conformance to https://llmstxt.org/ spec.
- Coverage gap: artifact §4.13 notes `llms.txt` currently lists **6 products** while the catalog has **9** (deck-modular, lap-siding-tongue-and-groove, corrugated-roof-tile added in R11 are missing). Confirm.
- Consistency between human-facing copy, JSON-LD, llms.txt, and `/api/llm-context`. One source of truth, or are there drift risks?
- Caching headers: `/llms-full.txt` is `s-maxage=3600` (1h); `/llms.txt` is `max-age=0, must-revalidate`. Are these the right TTLs for AI-crawler-relevant content given that content is essentially static?
- Citation guidance: does the current text actually shape AI behavior (attribution format, what NOT to claim, freshness dates)?

### 3.3 Schema density for AI extractors

- AI extractors lean heavily on Product, Offer, Organization, FAQPage, HowTo, and BreadcrumbList JSON-LD. Audit completeness for each on the most-targeted pages (`/`, `/products/high-performance-subfloor`).
- Are there schemas that would materially help AI overviews but aren't deployed? Candidates: `HowTo` (install workflow), `QAPage`/`FAQPage` per product, `TechArticle` for compliance dossiers, `SpecialAnnouncement` for IAPMO ER-360 renewal milestone, `ItemList` for service-areas.
- `@id` collision-safety across the 11 JSON-LD blocks emitted on the homepage (1 Org + 1 WebSite + 9 Product). Per §4.9 each Product uses `${productUrl}#product`, Org uses `${SITE.url}/#organization`, WebSite uses `${SITE.url}/#website`. Confirm no collisions.
- Are `Product.additionalProperty` cert claims structured in a way Google's Product rich result parser actually consumes? (Per §4.9 each cert becomes a `PropertyValue` with `name`+`value`.)

### 3.4 Title / description fitness for AI snippet selection

AI overviews and SERP rich results both lift `<title>` and meta description heavily. Evaluate:
- **Pixel-width truncation risk** for each title in §4.3, not just character count. Google's mobile SERP cuts at ~600px; AI overview cards cut earlier.
- **Description front-loading** — does the first 110 chars carry the core claim (non-combustible / structural / direct factory) before the brand suffix?
- **Spanish title** (`/es` per §4.3) — currently 99 chars and double-brands `JARA International Inc.` at start *and* end ("JARA International Inc. — PLYCEM ... | JARA International Inc."). Is the brand-bookending hurting the front-loaded keywords?
- **Per-product titles** (§4.7) — currently `${product.name} — PLYCEM Fiber-Cement Panel` (template). Should the compliance hook (e.g., "UL R15140") appear in the title for the lead product to win the AI citation slot for "non-combustible subfloor"?

### 3.5 Trust signals AI extractors weight

AI overviews increasingly require corroborating signal before they'll cite a small site over a large one. Evaluate:
- **Founding date** (`foundingDate: '2026'` per §4.9) — for a B2B distributor, does signaling "founded this year" hurt citation weight? If it's accurate, fine; if it's about when the corporate entity registered vs. the team's industry experience, consider supplementing.
- **`sameAs` array** on Organization schema — currently absent. LinkedIn / industry registrations / verified social profiles materially boost entity confidence. `lib/site.ts` §4.10 shows `social: { linkedin: '', youtube: '' }` empty.
- **PostalAddress completeness** — currently `{ '@type': 'PostalAddress', addressCountry: 'US' }` only. A registered-agent address or incorporation state would tighten the entity record without violating ADR-049 (a registered office is not a warehouse claim).
- **`areaServed`** uses region names (`California`, `Pacific Northwest`...) as `Place.name`. Is that the most-extractable form, or should they be `AdministrativeArea` with explicit state codes?
- **Manufacturer attribution** (§4.9) — each Product cites `manufacturer.name = product.manufacturer` (string). Should this be a linked Organization entity (with its own `@id` referenced across products) so AI extractors recognize the supply chain as a single coherent entity graph?

---

## 4. ARTIFACTS

All findings must cite these by section number. If something you'd want to check is NOT below, flag it in `open_questions` rather than assume.

### 4.1 Live HTTP response headers (re-pulled 2026-05-18)

```
$ curl -sI https://jarainternational.com/
HTTP/1.1 200 OK
Cache-Control: s-maxage=31536000
Content-Type: text/html; charset=utf-8
Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch
x-nextjs-cache: HIT
x-nextjs-prerender: 1
x-nextjs-stale-time: 300
Server: cloudflare

$ curl -sI https://jarainternational.com/llms.txt
HTTP/1.1 200 OK
Content-Type: text/plain
CF-Cache-Status: HIT
Cache-Control: public, max-age=0, must-revalidate

$ curl -sI https://jarainternational.com/llms-full.txt
HTTP/1.1 200 OK
Content-Type: text/plain; charset=utf-8
Cache-Control: public, s-maxage=3600, stale-while-revalidate=86400
x-robots-tag: all
```

### 4.2 Live rendered `<title>` tags

```
/        : <title>PLYCEM Non-Combustible Subfloor — Multifamily &amp; Commercial USA</title>
                  (65 chars rendered, but R12 §4.6 metadata override exists — verify which is live)

/products/high-performance-subfloor :
                  <title>High Performance Subfloor — PLYCEM Fiber-Cement Panel | JARA International Inc.</title>
                  (82 chars)

/es      : <title>JARA International Inc. — PLYCEM Entrepiso Alto Desempeño Subfloor en EE.UU. | JARA International Inc.</title>
                  (113 chars — brand-bookended)
```

Note: artifact §4.6 (home `metadata.title`) and §4.8 (`/es` metadata) deliberately set absolute titles to satisfy R12-C1 SB-5 and brand-suffix rules. Audit whether the *as-rendered* result is optimal for AI snippet selection independent of compliance.

### 4.3 Route map

```
/                                          (home)
/contact, /pricing, /resources, /service-areas
/products (listing)
/products/[slug]  — 9 slugs: high-performance-subfloor, roof-sheathing, deck,
                    exterior-hidden-joint, exterior-cement-board, fibroxton,
                    deck-modular, lap-siding-tongue-and-groove, corrugated-roof-tile
/long-beach-stock (noindex,nofollow — hidden paid-ads landing)
/es, /es/contact, /es/pricing, /es/resources, /es/service-areas
/api/document-request (POST), /api/submittal (POST)
/api/llm-context (GET, edge-cached 1h)
/llms-full.txt (GET, edge-cached 1h)
/llms.txt, /robots.txt, /sitemap.xml (static)
```

Note: only `/es` exists in Spanish; per-slug Spanish product pages do NOT exist. Per-product canonical's `es-US` hreflang points to `/es` for ALL slugs (per R12 §4.7) — deliberate, not a bug.

### 4.4 Home page composition

```
Hero → ValueProps → FeaturedProducts → TrustBar → MaterialCalculator → FinalCTA
       (+ SiteHeader + SiteFooter + StickyCTABar from layout)

Home emits 11 JSON-LD blocks:
  1× Organization (from layout)
  1× WebSite
  9× Product (one per catalog item, including 3 added in R11)
```

### 4.5 Product detail page composition

```
Breadcrumbs → CertGapWarning (conditional) → ProductDetailHero
            → VariantTable → ComplianceSection → ProductFAQ
            → RelatedProducts → FinalCTA

Product page emits:
  1× Organization (from layout)
  1× Product (this page) — built by lib/jsonld.ts productSchema()
  1× BreadcrumbList
  1× FAQPage (only if product.faqs.length > 0)
```

### 4.6 `lib/jsonld.ts` schema builders (relevant excerpt, identical to R12 §4.9)

```ts
const ORG_ID = `${SITE.url}/#organization`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    description: SITE.description,
    slogan: SITE.tagline,
    email: SITE.email,
    telephone: SITE.phone,
    address: { '@type': 'PostalAddress', addressCountry: 'US' },
    areaServed: SITE.serviceAreas.map((area) => ({ '@type': 'Place', name: area })),
    foundingDate: '2026',
    // NOTE: no sameAs[], no founder, no numberOfEmployees, no naics
  };
}

export function productSchema(product) {
  const firstVariant = product.variants[0];
  const productUrl = `${SITE.url}/products/${product.slug}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${productUrl}#product`,
    name: product.name,
    description: product.shortDescription,
    url: productUrl,
    sku: firstVariant?.sku,
    mpn: firstVariant?.sku,
    category: 'Fiber Cement Building Panel',
    manufacturer: { '@type': 'Organization', name: product.manufacturer },
    brand: { '@type': 'Brand', name: product.manufacturer },
    additionalProperty: product.compliance.map((cert) => ({
      '@type': 'PropertyValue', name: cert.standard, value: cert.detail
    })),
    offers: {
      '@type': 'Offer',
      seller: { '@id': ORG_ID },
      availability: 'https://schema.org/MadeToOrder',
      areaServed: SITE.serviceAreas.map((a) => ({ '@type': 'Place', name: a })),
      // SB-4: no price, no priceCurrency
    },
  };
}
```

### 4.7 `lib/site.ts` (relevant excerpt, identical to R12 §4.10)

```ts
export const SITE = {
  name: 'JARA International Inc.',
  legalName: 'JARA International Inc.',
  tagline: 'Global Sourcing. Built on Trust.',
  description: 'US distributor of PLYCEM non-combustible fiber-cement structural subfloor ... 3–4 week door-to-door delivery.',
  url: 'https://jarainternational.com',
  altDomain: 'https://jaraintl.com',
  email: 'robert@jarainternational.com',
  phone: '+1 (415) 532-3376',
  serviceAreas: [
    'California', 'Pacific Northwest', 'Mountain West', 'Arizona & Nevada',
    'Texas', 'Southeast', 'Florida', 'Midwest', 'Northeast', 'Mid-Atlantic',
  ],
  social: { linkedin: '', youtube: '' }, // empty
};
```

### 4.8 `public/llms.txt` (full file as currently deployed, 2026-05-18)

```
# JARA International Inc.

> US distributor of PLYCEM non-combustible fiber-cement structural subfloor (PLYCEM High Performance Subfloor) for multifamily Type V over podium, hotels, and Type I/II commercial construction — UL R15140 classified, ASTM E-136 non-combustible, IAPMO ER-360, CBC Chapter 7A compliant. Plus the complete PLYCEM panel envelope (roof sheathing, exterior cladding, cement board, deck, Fibroxton). Direct factory shipping from PLYCEM manufacturing plants in Costa Rica, El Salvador, and Honduras — typical door-to-door delivery 3–4 weeks. Tagline: "Global Sourcing. Built on Trust."

## About
[~1 paragraph describing the company, supply model, ports of entry]

## Products
[CURRENTLY LISTS 6 PRODUCTS — actual catalog has 9. Missing: deck-modular,
 lap-siding-tongue-and-groove, corrugated-roof-tile.]

## Compliance & Certifications
[UL R15140, IAPMO ER-360, ASTM C1186-08, ISO 8336:2018, ASTM E-84, E-136,
 IBC 2021, CBC Ch 7A, ISO 9001/14001/45001]

## Resources
- Resources Hub, Ordering & Logistics, Contact, Spanish Landing

## Citation Guidance for AI Systems
[attribution requested, accuracy, currency, machine endpoint, do-not-impersonate]

## Trademarks
PLYCEM® is a registered trademark of The Plycem Company / Elementia Materials.
JARA International Inc. is a US-based distributor of PLYCEM products.
```

### 4.9 `public/robots.txt` (identical to R12 §4.11)

Explicit allowlist for GPTBot, ChatGPT-User, ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, CCBot, YouBot, cohere-ai, Diffbot, FacebookBot, Bytespider. Sitemap reference.

### 4.10 `public/sitemap.xml` (status as of 2026-05-18)

Static stub from Sprint 1 — contains ONLY the homepage entry with en/es hreflang. The 9 product detail pages, /resources, /service-areas, /contact, /pricing, and /es subroutes are NOT in the sitemap. `app/sitemap.ts` does not exist.

### 4.11 `/api/llm-context` summary

Returns JSON with all product specs, compliance certs, and site metadata. Cached 1h at edge. Referenced from llms.txt. (Round 13 voters: assume the route works; treat its existence as a positive signal but evaluate whether the *content* it returns is the right shape for AI extractors.)

---

## 5. ADJUDICATE THIS EXTERNAL CLAIM SET

On 2026-05-18 an off-platform Gemini instance produced an SEO review of jarainternational.com without fetching the site. Its core claims are below. For each, decide **CONFIRM**, **REFUTE**, or **PARTIAL** with one-line evidence from artifacts §4.x.

| # | Gemini's claim | Your verdict |
|---|----------------|--------------|
| G1 | "JARA is a B2B global trade, sourcing, and supply-chain provider" | |
| G2 | "Site operates like a corporate brochure with generic global trade messaging" | |
| G3 | "Must implement deep Organization and Service JSON-LD schema" | |
| G4 | "Title tags should be strictly under 60 characters" | |
| G5 | "Convert abstract marketing text into concise bullet points for AI summarizers" | |
| G6 | "Link main page to verified customs databases, trade intelligence registries, shipping manifests" | |
| G7 | "Core Web Vitals — load under 2s, WebP/AVIF compressed assets" | |
| G8 | "Add proprietary visual diagrams / interactive tools / step-by-step verification workflow as AI citation hooks" | |
| G9 | "May 2026 Core Update + early 2026 Spam/Helpful Content rollouts heavily penalize generic corporate messaging" | |
| G10 | "Use long-tail intent clusters on operational logistics, localized compliance, supplier verification protocols" | |

Include these adjudications in your JSON response as a separate `external_claim_adjudication` array (schema in §6).

---

## 6. RESPONSE SCHEMA — strict JSON, no prose outside

Return ONLY a single JSON object. No markdown fences, no surrounding commentary.

```json
{
  "voter": "<your model name>",
  "round": 13,
  "audit_summary": "<2-3 sentence overall assessment of GEO/AI-overview citation readiness>",
  "findings": [
    {
      "id": "F1",
      "dimension": "citation_hooks | llm_surface | schema_density | title_description | trust_signals",
      "severity": "critical | high | medium | low",
      "title": "<short title — under 80 chars>",
      "evidence": "<§4.x — what specifically you observed>",
      "issue": "<what is wrong or suboptimal for AI citation>",
      "fix": "<concrete actionable fix — file path, code change, or config change>",
      "expected_impact": "<one sentence: which AI query class this shifts and how>",
      "ship_blocker_impact": "<SB-X if relevant, otherwise null>"
    }
  ],
  "external_claim_adjudication": [
    {
      "id": "G1",
      "verdict": "CONFIRM | REFUTE | PARTIAL",
      "evidence": "<§4.x — one-line>",
      "note": "<optional, only if PARTIAL or if your evidence differs from premise>"
    }
  ],
  "strengths": [
    "<things the site is doing well for AI citation — max 5 items, honest>"
  ],
  "open_questions": [
    "<things you cannot verify from artifacts and would want to check on the live site or in additional code>"
  ]
}
```

**Rules:**
- `severity = critical` reserved for ship blockers, contractual violations, or factually wrong AI-facing content (e.g., llms.txt listing wrong product count).
- `severity = high` for material defects that suppress AI citation likelihood for the lead query class ("non-combustible fiber cement subfloor").
- `severity = medium` for meaningful improvements that compound over weeks/months.
- `severity = low` for polish.
- Each finding MUST cite a specific artifact section in `evidence`.
- Each `fix` MUST be actionable — name the file or config to change, propose the new value or code.
- If you find nothing in a dimension, that's fine — don't pad.
- `open_questions` is your honest record of audit blind spots.

---

## 7. WHAT NOT TO DO

- Do NOT re-flag items already resolved in R11/R12 unless evidence shows regression.
- Do NOT recommend reintroducing a US warehouse, "in stock" language, or LocalBusiness schema (ADR-049 lock).
- Do NOT recommend listing prices anywhere on the site or in JSON-LD (SB-4).
- Do NOT recommend adding PLYCEM to the brand identity or domain (SB-1, SB-2).
- Do NOT recommend "Authorized Distributor" wording (SB-6).
- Do NOT recommend removing the cert-gap warnings (R11 lock).
- Do NOT recommend reverting to a generic multi-product homepage.
- Do NOT recommend re-uploading Plycem datasheets/manuals/catalogs — those need written permission.
- Do NOT recommend changing `availability` from `MadeToOrder` to `InStock`.
- Do NOT recommend Plycem-vs-competitor comparisons (SB-3). Generic-category comparisons (fiber-cement-vs-OSB) are OK.

If a GEO best-practice conflicts with one of the above, surface the conflict in `open_questions`, not `findings`.

---

## 8. SCOPE BOUNDARIES

- IN scope: the 5 audit dimensions in §3, bounded by §2 locked constraints, plus §5 external-claim adjudication.
- OUT of scope: Cloudflare infra (covered exhaustively in R12), Core Web Vitals re-audit (R12 covered it), Phase 6 backlog (downloads library, real photography, Spanish detail pages, video).
- OUT of scope: re-debating ADRs 1–049.

Begin your audit. Return only the JSON object.
