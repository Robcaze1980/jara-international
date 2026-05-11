# Round 7 — REVIEW: Phase 4 Sprint 2 Audit

**Type:** Post-milestone review consensus (per memory `milestone_review_pattern.md`).
**Voters:** DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1, Claude Opus 4.7. Quorum ≥3/4.
**Purpose:** Audit Sprint 2 (home page composition) deliverable against locked ADRs. Identify gaps, technical debt, compliance issues, and risks for Sprint 3.

---

## 1. WHAT THIS ROUND IS NOT
- NOT planning Sprint 3.
- NOT re-litigating any locked ADR (1-26).
- NOT debating brand/SEO/Plycem decisions already made.

## 2. WHAT THIS ROUND IS
Audit-only. Find what drifted from spec. Identify what compounds debt if Sprint 3 proceeds without addressing it.

---

## 3. SPRINT 2 SCOPE (what was supposed to be built)

Per Round 6 synthesis, Sprint 2 = "home page composition" with:
- 8 components: Hero, ValueProps, FeaturedProducts, TrustBar, MaterialCalculator, FinalCTA, StickyCTABar, SiteFooter
- 3 lib helpers: calculator, whatsapp, types
- JSON-LD: Product schema for each of 6 products + WebSite (Organization + LocalBusiness already in root layout from Sprint 1)
- Section ordering per ADR-025 HD2: Hero → ValueProps → FeaturedProducts → TrustBar → Calculator → FinalCTA
- All Round 6 convergent constraints applied (calculator validation airtight, URL prefill mechanism, trust bar text-only, sticky bar mobile keyboard handling)

## 4. WHAT WAS ACTUALLY BUILT (deliverable inventory)

**Repo:** https://github.com/Robcaze1980/jara-international (commit `c359e85` on main)
**Live deploy:** https://jarainternational.com (deployed via Cloudflare Workers + OpenNext, first build attempt successful)

**File inventory (16 new files this sprint):**
```
lib/
  calculator.ts          (188 lines) validation + estimate + buildResourcesPrefillUrl + formatEstimate
  whatsapp.ts            (24 lines)  buildWhatsAppUrl + buildTelUrl helpers
  types.ts               (15 lines)  ConstructionType + PanelThickness shared types
  jsonld.ts              (UPDATED)   added productSchema + webSiteSchema + faqSchema (with empty-guard)
  site.ts                (UPDATED)   phone strategy: phonePrimary (Anna) + phoneSecondary (Robertson) + raw versions

components/
  SiteFooter.tsx         (~150 lines) brand + contact + nav + certs blocks; mounted in root layout
  Hero.tsx               (~70 lines)  full-bleed placeholder SVG + navy gradient overlay + 2 CTAs
  ValueProps.tsx         (~70 lines)  3 props (in-stock + compliance + bilingual support) with lucide icons
  ProductCard.tsx        (~70 lines)  photo-first w/ placeholder; links to /products (Sprint 3 target)
  FeaturedProducts.tsx   (~40 lines)  responsive grid of all 6 ProductCards
  TrustBar.tsx           (~65 lines)  6 cert wordmarks (text-only, no logos), each links to /resources
  MaterialCalculator.tsx (~210 lines) CLIENT component; airtight validation; aria-live result; URL prefill on submit
  StickyCTABar.tsx       (~95 lines)  CLIENT component; IntersectionObserver scroll trigger + visualViewport keyboard detection
  FinalCTA.tsx           (~55 lines)  end-of-page conversion ask with Anna + email CTAs

app/
  layout.tsx             (UPDATED)   mounts SiteFooter
  page.tsx               (REPLACED)  composes all sections per HD2 ordering + JSON-LD scripts (WebSite + 6 Products)
```

**Production verification (live HTML at jarainternational.com):**
| Check | Result |
|---|---|
| Total HTML size | 109KB (up from 23KB scaffold) |
| All 6 section IDs present | ✅ Hero/ValueProps/FeaturedProducts/TrustBar/Calculator/FinalCTA |
| Footer present | ✅ |
| `USD` literal count | 0 (Plycem SB-4 compliant) |
| `priceCurrency` count | 0 (after JSON-LD cleanup mid-sprint) |
| `priceSpecification` count | 0 |
| hreflang chain | 3 tags (en-US + es-US + x-default) |
| JSON-LD scripts | Confirmed rendering |
| Calculator no-currency strings | 0 (only "panels", "lbs total", "truck loads") |

**Phone strategy applied (per 2026-05-10 lock):**
- Hero CTAs link to `#material-calculator` and `#featured-products` (in-page anchors)
- Calculator submit link goes to `/resources?sf=...&type=...&thickness=...&panels=...` (URL prefill per F2.R6)
- StickyCTABar phone CTA = Anna `+1 (415) 532-3376` (primary)
- StickyCTABar WhatsApp = Robertson `wa.me/14159335738` (secondary, per user)
- FinalCTA phone CTA = Anna primary; secondary line = Robertson + email
- SiteFooter has both numbers labeled distinctly + WhatsApp + email

## 5. KNOWN GAPS (intentionally Sprint 3+ deferred — DO NOT flag as missing)

These are explicit Sprint 3+ scope per Round 6 synthesis + Phase 4 backlog:
- `/products` listing page (Sprint 3 — currently a 404, ProductCard links go there)
- `/products/{slug}` individual detail pages (Sprint 3 — 6 pages, validated against subfloor template first)
- `/resources` page with submittal form + document library (Sprint 4 — calculator URL prefill receiver lives here)
- `/contact` page (Sprint 4 — currently a 404, footer nav links to it)
- `/service-areas` page (Sprint 5 — Round 3 ADR-017 SD2)
- Pillar page (Sprint 5 — Round 3 ADR-016 SC2 "Subfloor Guide")
- Per-product FAQs (Sprint 3+ — Round 3 ADR-018 SF2)
- Schema validation CI gate (Round 5 single-voter — Sprint 4)
- Calculator no-currency CI test (Round 1.5 F3.5 / constraint C3 — Sprint 4)
- n8n webhook production migration (Constraint C1 — Sprint 4 when /resources ships)
- Cloudflare Web Analytics integration (Sprint 5)
- `/es` page sticky bar localization (Sprint 5+ per Claude Round 6 finding)

## 6. VOTING ITEMS

### Item RA — Verdict on Sprint 2 deliverable

Did Sprint 2 deliver what Round 6 ADRs (022-026) and convergent constraints (F1-F5.R6) required, with acceptable quality, and a foundation that won't constrain Sprint 3?

- **RA1**: **SHIP AS-IS** — Sprint 2 is complete and clean enough. Proceed to Sprint 3 planning round immediately.
- **RA2**: **SHIP WITH FIXES FIRST** — Sprint 2 is mostly good but has gaps that must be addressed BEFORE Sprint 3 starts. List the must-fix items in your `concerns_observed`.
- **RA3**: **HOLD — REWORK NEEDED** — Sprint 2 has a fundamental issue requiring significant rework before Sprint 3 can start. Explain what.

### Item RB — Risk grade for Sprint 3

Sprint 3 = `/products` listing page + 6 individual `/products/{slug}` detail pages. How confident are you Sprint 3 succeeds without major issues, given Sprint 2 trajectory?

- **RB1**: **HIGH CONFIDENCE** — Sprint 2 components (ProductCard, JSON-LD builders) are reusable; product detail pages largely wrap data already structured.
- **RB2**: **MEDIUM CONFIDENCE** — Sprint 3 introduces new route patterns (dynamic [slug]), per-product JSON-LD complexity, FAQ rendering — fresh sources of risk.
- **RB3**: **LOW CONFIDENCE** — too many unresolved Sprint 2 issues; recommend additional planning round before Sprint 3 starts.

## 7. OUTPUT FORMAT (STRICT JSON ONLY)

```json
{
  "model": "your-model-id",
  "agent": "your-name",
  "votes": {
    "RA": "RA1|RA2|RA3",
    "RB": "RB1|RB2|RB3"
  },
  "reasoning": {
    "RA": "1-2 sentences",
    "RB": "1-2 sentences"
  },
  "concerns_observed": [
    {
      "title": "...",
      "category": "compliance|seo_ai|technical_debt|brand|operations|security|performance|a11y|ux",
      "severity": "blocker|high|medium|low",
      "must_fix_before_sprint_3": true,
      "description": "what you observed and why it matters"
    }
  ],
  "compliments": [
    "1-2 things Sprint 2 did well (reinforces good patterns)"
  ],
  "verdict": "ship|revise|hold",
  "verdict_reason": "1-2 sentence summary"
}
```

## 8. Notes to voters

- Be skeptical. Find what's wrong, not what's right (compliments section is for that).
- Convergent concerns (≥2 voters flag the same thing) become MANDATORY fixes before Sprint 3.
- Single-voter concerns are documented but optional unless severity=blocker (or unless you flag a clear compliance/SEO/AI gap — in which case applied per user mandate).
- Items in §5 are explicitly deferred — flag ONLY if you believe one should have been in Sprint 2 instead.
- Vote independently — no cross-voter visibility.
- This prompt is immutable.
