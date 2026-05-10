# Round 3 — JARA International Inc. Website: SEO + AI Tactical Maximization

**Type:** Tactical decisions for SEO and AI-friendliness across the entire site.
**Voters:** DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1, Claude Opus 4.7 (manual). Quorum ≥3/4.

---

## 1. CRITICAL CONTEXT — user mandate

**User explicit mandate 2026-05-10:** SEO and AI maximization must be prioritized in EVERY phase, never absorbed silently as implementation detail.

This round is dedicated to the tactical HOW of the strategic locks D2 (AI strategy) and G3 (SEO keyword strategy) from Phase 1.

Strategic context:
- **Primary market:** US (mainly), national expansion from Long Beach CA warehouse
- **Audience:** US-based contractors, architects, engineers, GCs, distributors, procurement managers
- **Launch in DAYS** — every option still weighted toward time-to-launch BUT not at SEO/AI expense
- **6-page launch surface:** /, /products, /products/high-performance-subfloor, /resources, /contact, /es

---

## 2. WHAT'S ALREADY LOCKED (do not re-debate)

### Phase 1 (rounds 1 + 1.5)
- Stack: Next.js 16 + React 19 + Tailwind + Radix on Cloudflare Pages
- Architecture: Multi-product Plycem catalog (6 products)
- Domain: jarainternational.com canonical, jaraintl.com 301 redirect
- AI strategy (D2): llms.txt + llms-full.txt + JSON-LD (Organization, Product, FAQPage, BreadcrumbList) + public `/api/llm-context` endpoint
- Lead capture (E3): calculator (no price) + form + sticky bar phone+WhatsApp
- Plycem brand (F3): text-only at launch, logo + meta keywords post-approval via consolidated request
- SEO keyword strategy (G3): generic keywords at launch + Phase 4 sprint adding Plycem brand keywords post-approval
- Bilingual (H3): EN full + 1 ES landing
- Email (I1): canonical long-domain pattern

### Phase 2 (round 2)
- Hero (VA1): full-bleed photo + dark navy overlay
- Product cards (VB1): photo-first with generic placeholder fallback
- Stitch (VC3): NOT used at launch
- Three-panel symbol UI (VD1): logo only (favicon = first post-launch patch)

### Convergent constraints applied (cross-cutting)
- next/font/google for Montserrat + Inter (no CLS)
- WCAG AA contrast on hero overlay (gradient or text-shadow)
- CSS variables for palette in globals.css
- Cloudflare Web Analytics on day 1
- Remove darkMode config from tailwind
- LocalBusiness JSON-LD for Long Beach warehouse (DeepSeek finding, applied)
- Product codes (960140, 972254, etc.) as JSON-LD `sku`/`mpn` (GLM finding, applied)

---

## 3. VOTING ITEMS (6 items)

### Item SA — Schema.org structured data depth at launch

D2 lock specifies "Organization, Product, FAQPage, BreadcrumbList." This item determines whether to expand schema scope.

- **SA1**: **D2 baseline only.** Organization + Product (per product detail page) + FAQPage + BreadcrumbList. Minimum to satisfy D2.
- **SA2**: **D2 + LocalBusiness (warehouse) + Article (resources hub) + ImageObject (hero/product photos) + Review (when collected post-launch).** Moderate expansion with high-impact additions.
- **SA3**: **SA2 + ManufacturerStatement (per-product compliance claims) + CertificationStatement (UL R15140, IAPMO ER-360, ASTM standards) + TechArticle (resources content) + ServiceArea (geo coverage) + custom Product extensions for fiber-cement domain.** Aggressive — maximum machine-readability for AHJs and AI agents.

### Item SB — AI crawler permissions (robots.txt + meta robots strategy)

The site can welcome AI training crawlers (GPTBot, ClaudeBot, Google-Extended, etc.) for maximum citation visibility, OR restrict to citation-only crawlers (Perplexity, You, Bing Chat) that link back. There's a tradeoff between LLM citation visibility and IP control.

- **SB1**: **Allow ALL major AI crawlers** — GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot (Common Crawl), YouBot, anthropic-ai, ChatGPT-User, etc. Maximum LLM training corpus inclusion → maximum future citation likelihood. Risk: content used in model training without direct attribution.
- **SB2**: **Allow ONLY citation-attributing crawlers** — Allow Perplexity, You, Bing, Google. Disallow GPTBot, ClaudeBot, Google-Extended, CCBot, anthropic-ai (training-only). Trade citation-via-search-grounding for blocked training corpus.
- **SB3**: **SB1 + comprehensive llms.txt declaration** — Allow all crawlers (max visibility) AND publish detailed `/llms.txt` + `/llms-full.txt` with explicit attribution preferences, contact info, and usage guidance for AI systems. Most modern; signals serious B2B intent.

### Item SC — Pillar content pages at launch

Pillar pages establish topical authority and capture broad search intent. Each pillar needs ~2000-3500 words of substantive content.

- **SC1**: **NO pillar pages at launch.** Just product detail pages and resources hub. Add pillars in Phase 6+. Fastest to launch.
- **SC2**: **1 pillar page at launch** — "Non-Combustible Fiber Cement Subfloor: Complete Guide for Type I and II Construction (US, 2026)". Internal-links to product pages, fire-code compliance, and resources. Captures the highest-volume search intent for the day-1 product (subfloor).
- **SC3**: **3 pillar pages at launch** — (1) Subfloor guide; (2) Fiber Cement Cladding for Commercial US Projects; (3) Fire & Code Compliance for Multifamily Construction. Triples topical breadth but triples content production cost.

### Item SD — Local SEO depth for Long Beach warehouse

The Long Beach CA warehouse is a major B2B competitive advantage (in-stock, 0-3 day delivery to West Coast). Local SEO optimization controls how this surfaces in geographic searches.

- **SD1**: **LocalBusiness schema only.** JSON-LD with warehouse address, phone, hours, geo coordinates. No dedicated geographic pages.
- **SD2**: **SD1 + dedicated `/service-areas` page.** One page listing California cities + radius served (Long Beach, Los Angeles, San Diego, San Francisco, Sacramento, Anaheim, Riverside, San Bernardino…). Internal-linked from home and product pages.
- **SD3**: **SD1 + state-level landing pages** — separate `/california`, `/oregon`, `/washington`, `/arizona`, `/nevada` pages, each with local context, regional building codes (CBC for CA, ORSC for OR, etc.), and shipping logistics. High effort, highest local SEO ROI.

### Item SF — FAQ strategy and FAQPage schema deployment

Round 1 audit identified 9 reusable FAQs in the legacy v0 site. FAQ schema is high-leverage for AI citation (LLMs love direct Q&A pairs).

- **SF1**: **One FAQ section in /resources only.** All 8 reusable FAQs + FAQPage schema on /resources. Standard and simple.
- **SF2**: **Per-product FAQ + global FAQ.** Each product detail page has a 3-5 FAQ section (product-specific) with FAQPage schema. /resources retains a global FAQ with FAQPage schema. Higher production cost but much higher AI citation surface area.
- **SF3**: **SF2 + dynamic FAQ pipeline.** Implement a workflow where common questions from quote-request submissions get added to product FAQs over time (manual review by JARA team). Phase 4 ships SF2; SF3 dynamic pipeline Phase 6+.

### Item SH — Performance / Core Web Vitals targets

Performance impacts both SEO ranking (Google CWV signals) and AI crawl efficiency (faster pages get crawled more).

- **SH1**: **Pass thresholds.** LCP <2.5s, INP <200ms, CLS <0.1 on mobile + desktop. Google's "Good" thresholds. Standard B2B target.
- **SH2**: **Excellent thresholds.** LCP <1.5s, INP <100ms, CLS <0.05 on mobile + desktop. Top-decile B2B. Requires aggressive image optimization, font subsetting, JS minimization.
- **SH3**: **Lighthouse 100.** Score 100/100 on Lighthouse Performance, Accessibility, Best Practices, SEO on mobile + desktop. Highest engineering rigor; some categories (e.g., Accessibility 100) require disciplined ARIA + semantic markup throughout.

---

## 4. OUTPUT FORMAT (STRICT JSON ONLY)

```json
{
  "model": "your-model-id",
  "agent": "your-name",
  "votes": {
    "SA": "SA1|SA2|SA3",
    "SB": "SB1|SB2|SB3",
    "SC": "SC1|SC2|SC3",
    "SD": "SD1|SD2|SD3",
    "SF": "SF1|SF2|SF3",
    "SH": "SH1|SH2|SH3"
  },
  "reasoning": {
    "SA": "1-2 sentences",
    "SB": "1-2 sentences",
    "SC": "1-2 sentences",
    "SD": "1-2 sentences",
    "SF": "1-2 sentences",
    "SH": "1-2 sentences"
  },
  "additional_findings": [
    {
      "title": "...",
      "description": "...",
      "severity": "blocker|high|medium|low",
      "applies_to_phase": "3|4|5|6"
    }
  ],
  "verdict": "ship|revise|hold",
  "verdict_reason": "1-2 sentence summary"
}
```

## 5. Notes to voters

- Launch-in-days priority remains active BUT the user has explicitly mandated SEO+AI cannot be deprioritized for speed. Find the option per item that maximizes SEO+AI value within reasonable launch effort.
- `additional_findings` welcome especially for SEO+AI tactics not on the ballot (e.g., specific JSON-LD field choices, sitemap structure, hreflang for /es, llms.txt content conventions).
- Votes are independent — no cross-voter visibility.
- This prompt is immutable.
