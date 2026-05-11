# Round 9 — REVIEW: Phase 4 Sprint 3 Audit

**Type:** Post-milestone review consensus (per memory `milestone_review_pattern.md`).
**Voters:** DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1, Claude Opus 4.7. Quorum ≥3/4.
**Purpose:** Audit Sprint 3 (product detail pages) deliverable against locked ADRs + Round 8 synthesis. Identify gaps, technical debt, compliance issues, and risks for Sprint 4.

---

## 1. WHAT THIS ROUND IS NOT
- NOT planning Sprint 4.
- NOT re-litigating any locked ADR (1-26) or Round 8 picks (PA1, PB1, PC1, PD1, PE1).
- NOT debating brand/SEO/Plycem decisions already made.
- NOT debating Stitch integration (ADR-011 locked OUT through Phase 5; Phase 6 if revisited).

## 2. WHAT THIS ROUND IS
Audit-only. Find what drifted from Round 8 spec. Identify what compounds debt if Sprint 4 proceeds without addressing it.

---

## 3. SPRINT 3 SCOPE (what was supposed to be built)

Per Round 8 synthesis (`docs/history/consensus/round8_synthesis.md`):
- 6 product detail page templates (one component template applied to all 6 PLYCEM products via `generateStaticParams`)
- 7 new components: Breadcrumbs, ProductDetailHero, VariantTable, ComplianceSection, ProductFAQ, RelatedProducts, plus dynamic OG image route
- 1 new lib: `lib/related-products.ts` (Jaccard similarity)
- Product type extension: `faqs: ProductFaq[]` (PB1 tiebreak) + `image?: string`
- 24 hand-authored FAQ items (3-5 per product) — Round 8 §1 PB tiebreak
- 3 JSON-LD blocks per page (Product + FAQPage + BreadcrumbList) with collision-safe `@id` anchors (F1.R8)
- Section ordering per PE1: Breadcrumbs → Hero → Variants → Compliance → FAQ → Related → Final CTA
- All Round 8 convergent findings applied (F1.R8 through F5.R8)

## 4. WHAT WAS ACTUALLY BUILT (deliverable inventory)

**Repo:** https://github.com/Robcaze1980/jara-international
**Sprint 3 commits on `main`:**
- `c6e3914` chore(consensus): auto-load .env.local + add OpenRouter env var docs
- `c09ca25` feat(sprint3): product detail pages — variant tables + FAQ + related + JSON-LD trio

**File inventory:**
```
components/  (7 new files)
  Breadcrumbs.tsx           BreadcrumbList JSON-LD with @id=canonical#breadcrumb,
                            visual trail with aria-current on last item, relative
                            paths for next/link + absolute URLs for schema (F5.R8)
  ProductDetailHero.tsx     name + PLYCEM kicker + longDescription + applications
                            pill list + Call/Email CTAs + image slot (falls back
                            to _placeholder.svg when product.image undefined)
  VariantTable.tsx          PA1 flat table, sorted by thickness ascending in render;
                            WCAG AA per F2.R8 (caption, th scope=col, focusable
                            scroll region with role=region + aria-label, sticky
                            first column on mobile, text-not-icon for edge profile)
  ComplianceSection.tsx     certification list with FileText icon + bold standard
                            + supporting prose
  ProductFAQ.tsx            FAQPage JSON-LD with @id=canonical#faq (F1.R8); native
                            <details>/<summary> for zero-JS keyboard-accessible
                            expand; rotates + icon on open
  RelatedProducts.tsx       reuses ProductCard (next/image default loading=lazy
                            per F3.R8); grid of 2-3 cards
  (existing ProductCard.tsx, FinalCTA.tsx reused)

lib/  (1 new + 1 updated)
  related-products.ts       Jaccard similarity on applications[]; pure function;
                            tiebreak alphabetical-by-slug for determinism (PC1)
  jsonld.ts                 breadcrumbSchema(pageUrl, items) + faqSchema(pageUrl,
                            items) now require canonical URL param for @id anchor

app/products/[slug]/  (1 new + 1 replaced)
  page.tsx                  STUB replaced with full PE1 template; 3 JSON-LD
                            blocks; metadata adds openGraph + twitter; canonical
                            + hreflang preserved from Sprint 2 cleanup
  opengraph-image.tsx       NEW; ImageResponse via next/og; 1200×630 navy
                            gradient + product name + thickness pill +
                            "PLYCEM · Distributed by JARA International" + Long
                            Beach stock signal (F4.R8)

data/
  products.ts               Product type extended: faqs: ProductFaq[] + image?:
                            string. 24 FAQs total (5+4+4+4+5+4) hand-authored
                            from existing longDescription / applications /
                            compliance data.
```

**Build verification (local `npm run build`):**
| Check | Result |
|---|---|
| Compile | ✅ in 5.3min (Next 16.2.6 + Turbopack) |
| TypeScript | ✅ clean in 10.7min |
| Routes prerendered | 21 (up from 15 in Sprint 2 cleanup) |
| `/products/[slug]` static gen | ✅ all 6 slugs |
| `/products/[slug]/opengraph-image` static gen | ✅ all 6 slugs |
| `/` + `/es` + `/contact` + `/products` + `/resources` + `/_not-found` | ✅ all intact |

**Round 8 findings application checklist:**
| Finding | Convergence | Applied? |
|---|---|---|
| F1.R8 — 3 JSON-LD blocks with collision-safe @id | 4/4 | ✅ #product, #breadcrumb, #faq |
| F2.R8 — VariantTable WCAG 2.1 AA | 4/4 | ✅ caption, scope=col, role=region + aria-label, sticky first col, text-not-icon |
| F3.R8 — RelatedProducts lazy-load | 3/4 | ✅ via next/image default (no priority set) |
| F4.R8 — Per-product OG image | 3/4 | ✅ opengraph-image.tsx with generateStaticParams |
| F5.R8 — Breadcrumb canonicalization + /products stub integrity | 2/4 | ✅ absolute URLs in JSON-LD, /products stub preserved |

**PB tiebreak resolution applied:** PB1 inline `faqs[]` on Product type (Round 8 §1 reasoning). DeepSeek + Gemini's PB1 preference adopted.

## 5. KNOWN GAPS (intentionally Sprint 4+ deferred — DO NOT flag as missing)

These are explicit Sprint 4+ scope per Round 8 synthesis + Phase 4 backlog:
- `/products` listing page expansion (Sprint 3.5 or 4 — currently a Sprint 2 cleanup stub; breadcrumb middle link uses this stub)
- `/resources` page with submittal form + document library (Sprint 4 — calculator URL prefill receiver lives here)
- `/contact` page full build (Sprint 4 — currently a Sprint 2 cleanup stub)
- `/service-areas` page (Sprint 5 — Round 3 ADR-017 SD2)
- Pillar page (Sprint 5 — Round 3 ADR-016 SC2 "Subfloor Guide")
- AI-generated per-product photos in `public/images/products/{slug}.webp` (data-only commit when user delivers; `image?` field is ready)
- Schema validation CI gate (Round 5 single-voter — Sprint 4)
- Calculator no-currency CI test (Round 1.5 F3.5 / constraint C3 — Sprint 4)
- n8n webhook production migration (Constraint C1 — Sprint 4 when /resources ships)
- Cloudflare Web Analytics integration (Sprint 5)
- Full `/es/products/[slug]` Spanish per-slug pages (post-launch — `/es` marketing page is launch-day Spanish surface; current hreflang `es-US` on detail pages points to `/es` root, documented Round 8 launch limitation)
- VariantTable sortable interactive headers (deferred — current pre-sorted server render is launch-sufficient)
- FAQ content human-accuracy review (Robertson approved 2026-05-11 ahead of merge)

## 6. VOTING ITEMS

### Item RA — Verdict on Sprint 3 deliverable

Did Sprint 3 deliver what Round 8 ADRs (PA1, PB1, PC1, PD1, PE1) and convergent findings (F1.R8 through F5.R8) required, with acceptable quality, and a foundation that won't constrain Sprint 4?

- **RA1**: **SHIP AS-IS** — Sprint 3 is complete and clean enough. Proceed to Sprint 4 planning round immediately.
- **RA2**: **SHIP WITH FIXES FIRST** — Sprint 3 is mostly good but has gaps that must be addressed BEFORE Sprint 4 starts. List the must-fix items in your `concerns_observed`.
- **RA3**: **HOLD — REWORK NEEDED** — Sprint 3 has a fundamental issue requiring significant rework before Sprint 4 can start. Explain what.

### Item RB — Risk grade for Sprint 4

Sprint 4 = `/resources` page with 3-step submittal form (calculator prefill receiver) + full `/contact` page (replaces Sprint 2 cleanup stub). Introduces server actions / form handling / n8n webhook integration / production credential management. How confident are you Sprint 4 succeeds without major issues, given Sprint 3 trajectory?

- **RB1**: **HIGH CONFIDENCE** — Sprint 3 patterns (data-driven components, JSON-LD discipline, WCAG markup) translate cleanly; form/webhook integration is a known pattern.
- **RB2**: **MEDIUM CONFIDENCE** — Sprint 4 introduces new patterns (form server actions, n8n webhook integration, production secret management, multi-step form state) — fresh sources of risk.
- **RB3**: **LOW CONFIDENCE** — too many unresolved Sprint 3 issues; recommend additional planning before Sprint 4 starts.

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
      "must_fix_before_sprint_4": true,
      "description": "what you observed and why it matters"
    }
  ],
  "compliments": [
    "1-2 things Sprint 3 did well (reinforces good patterns)"
  ],
  "verdict": "ship|revise|hold",
  "verdict_reason": "1-2 sentence summary"
}
```

## 8. Notes to voters

- Be skeptical. Find what's wrong, not what's right (compliments section is for that).
- Convergent concerns (≥2 voters flag the same thing) become MANDATORY fixes before Sprint 4.
- Single-voter concerns are documented but optional unless severity=blocker (or unless you flag a clear compliance/SEO/AI/a11y gap — in which case applied per user mandate).
- Items in §5 are explicitly deferred — flag ONLY if you believe one should have been in Sprint 3 instead.
- The 24 FAQ items in `data/products.ts` were AI-authored and human-reviewed by Robertson (project owner) on 2026-05-11 before merge. Do not flag FAQ technical accuracy as an audit gap — that review is complete.
- The `model` / `agent` fields in your JSON should reflect YOUR model identity, not "Claude" (Round 8 voters all mistakenly tagged themselves as Claude — please use your actual model name like "DeepSeek V4 Pro", "Gemini 3.1 Flash Lite", "GLM-5.1").
- Vote independently — no cross-voter visibility.
- This prompt is immutable.
