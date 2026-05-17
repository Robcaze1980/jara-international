# Strategic Plan — Adopting Google Stitch for JARA International website

**Type:** Single-model strategic consultation (NOT a consensus round — this is one expert opinion, not a vote).
**Asking:** Gemini 3 Pro, because Stitch is a Google product and Gemini should have the most current knowledge of its capabilities, limitations, and best-practice workflows as of 2026.

---

## What I'm asking you for

Robert, the founder of JARA International, wants to start using **Google Stitch** (https://stitch.withgoogle.com) to (1) polish the design of his B2B construction-materials site and (2) add real images — specifically product photography for 9 product detail pages and Open Graph cards. He doesn't have visual-design expertise; he needs a *concrete, sequenced plan* he can execute over the next 1–4 weeks.

Give me:
1. **What Stitch IS and is NOT good at** in 2026 — be honest. Where it shines, where it falls short, what to NOT try to use it for.
2. **A prioritized 4-week plan**: which components to redesign first, which images to generate first, in what order, with rationale.
3. **Concrete prompt examples** Robert can paste into Stitch for THIS project — for the hero, for product cards, for a product photo of fiber-cement subfloor panels in a construction setting, etc.
4. **The integration handoff workflow**: how to get Stitch output (HTML/CSS or Figma) into a Next.js 15 + Tailwind 3 codebase without breaking the existing component contracts.
5. **Limits and alternatives**: Stitch's free tier limits in 2026, when Robert should pay, and which TASKS he should NOT use Stitch for (and which tool he should use instead — e.g., Imagen, Nano Banana, Midjourney, real photography).
6. **Risk warnings** specific to this project — anything that could go wrong, costs that could spiral, brand consistency traps.

Robert is a founder, not a designer. He works from Google Drive across two PCs. He values *decisive, opinionated* recommendations over hedged "it depends" answers — give him the recommendation, then briefly explain the trade-off.

---

## Project context — read carefully

### Business

- **JARA International Inc.** — US-incorporated B2B distributor of PLYCEM fiber-cement panels (manufactured in Costa Rica / El Salvador / Honduras). Lead product = High Performance Subfloor (non-combustible structural subfloor for multifamily / hotel / Type I-II commercial construction, fully US-code-compliant). Plus 8 other products in the envelope (roof sheathing, exterior cladding, cement board, deck, deck modular, lap siding, corrugated roof tile, Fibroxton).
- **Audience:** US contractors, architects, engineers, developers, procurement managers, building officials. NOT retail consumers. NOT LatAm export.
- **Site:** https://jarainternational.com (live).
- **Strategic positioning:** Subfloor-as-hero. Direct factory shipping (no US warehouse). Quote-only commercial model (NO list prices anywhere). "Global Sourcing. Built on Trust."

### Tech stack

- Next.js 15 App Router (no Pages Router).
- TypeScript strict.
- Tailwind CSS 3 — token system already locked.
- Deployed via Cloudflare Workers + OpenNext from a GitHub repo.
- All copy/data is in `data/products.ts` (single source of truth — feeds product pages, JSON-LD, llms.txt, sitemap, OG cards).

### Brand tokens (Tailwind config — LOCKED, do not propose changes)

```ts
colors: {
  navy:    { DEFAULT: '#062B49', dark: '#04233D' }, // Primary
  steel:   { DEFAULT: '#5F7894' },                  // Medium Steel Blue
  bluegray:{ DEFAULT: '#B8C7D6' },                  // Light Blue-Gray
  bg:      { DEFAULT: '#FFFFFF', soft: '#F4F6F8' },
  ink:     { DEFAULT: '#1F2933' },                  // Body text (NOT pure black)
}
// FORBIDDEN by brand guide §12: bright royal blue, orange, red, green,
// yellow, pure black. Light mode only — no dark mode.
fontFamily: {
  sans:    ['Inter', ...],
  display: ['Montserrat', ...],  // weights 600 + 700 only
}
```

### Existing components (Tailwind, all in `components/`)

```
Breadcrumbs            FeaturedProducts      ProductFAQ
CertGapWarning         FinalCTA              RelatedProducts
ComplianceSection      Hero                  SectionNav
DocumentLibrary        MaterialCalculator    SiteFooter
ProductCard            ProductDetailHero     StickyCTABar
                       SubmittalForm         TrustBar
VariantTable                                 ValueProps
```

Each is a React server component with Tailwind classes. Visual design is clean B2B / "trust + compliance" feel, navy-dominant, no flashy animations.

### Image asset state — THIS IS WHERE STITCH (or something like it) MATTERS MOST

| Asset | State |
|---|---|
| Open Graph default | Just converted SVG placeholder → PNG (basic, needs polish) |
| 9 product hero images | **ALL placeholders** (`_placeholder.svg` — navy gradient + product name overlay) |
| Hero section background | Placeholder SVG (`_placeholder-hero.svg`) |
| Per-slug OG cards | Generated automatically by Next.js but show generic text on navy |
| JARA logo PNG | **Does not exist** — only a PDF brand guideline |

The per-product `_README.md` already has AI-prompt direction per product, e.g. for High Performance Subfloor: *"Stacked gray fiber-cement panels in warehouse OR installed subfloor on steel/wood joists, mid-construction"*.

### What's been validated already (do NOT re-debate)

- 12 prior consensus rounds locked the information architecture, component composition, copy, JSON-LD, and brand identity. Round 12 just shipped: SB-5 title fixes, dynamic sitemap, R2 incremental cache, llms.txt sync.
- Robert is NOT looking to redesign the site from scratch. He wants to *polish* the existing design and *fill in the image gaps*.

### Constraints Stitch output must respect

- **Brand palette:** navy / steel / bluegray / white only. No bright accents.
- **Typography:** Inter (body) + Montserrat 600/700 (display). Already loaded via next/font.
- **No PLYCEM trademarks in titles, no Plycem logos** (ship blockers SB-5, SB-7 — contractual).
- **Light mode only.**
- **B2B tone:** professional, calm, "trust and compliance" — not consumer-y, not flashy, not playful.
- **No prices anywhere** (SB-4 contractual).
- **No US warehouse imagery** — JARA does not operate one (ADR-049 lock).
- **Cert-gap honesty:** for two products (lap-siding, corrugated-roof-tile) the design surfaces amber compliance warnings — these are LOCKED and must not be visually softened.

### What Robert already knows / has decided

- He's using Claude Code from VS Code, working in Google Drive synced across two PCs.
- He's already paying for Cloudflare (R2 bucket created today for cache).
- Comfortable with paying for tools that save time, NOT comfortable with subscriptions he won't use.
- Bilingual EN/ES. Spanish landing page exists (`/es`) — same components, translated copy.

---

## Hard requirements for your response

- **Actionable.** No "consider exploring..." — say "do X first because Y."
- **Specific.** Name components, name files, give prompts Robert can copy/paste.
- **Honest about Stitch's limits.** If Stitch can't generate fiber-cement product photography (it's a UI-design tool, not a photo generator), say so loudly and recommend the right alternative tool with reasoning.
- **Sequenced.** Week 1 → Week 2 → Week 3 → Week 4. Stop ordering at Week 4.
- **Budget-aware.** If Robert needs to pay for Stitch / Imagen / Midjourney / stock photos, tell him the price.
- **No fluff.** Skip the "Stitch is a powerful AI tool" preamble. Get to the plan.

Begin.
