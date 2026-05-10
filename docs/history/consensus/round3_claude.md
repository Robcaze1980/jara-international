# Round 3 Vote — Claude Opus 4.7

**Captured:** 2026-05-10 (before reading other voter outputs)
**Strategic context:** Launch in DAYS + user mandate that SEO/AI maximization cannot be deprioritized for speed. Find the option per item that maximizes SEO+AI value at reasonable launch effort.

```json
{
  "model": "claude-opus-4-7",
  "agent": "Claude Opus 4.7 (1M context)",
  "votes": {
    "SA": "SA2",
    "SB": "SB3",
    "SC": "SC2",
    "SD": "SD2",
    "SF": "SF2",
    "SH": "SH2"
  },
  "reasoning": {
    "SA": "SA2 captures high-impact additions (LocalBusiness for warehouse advantage, Article for resources, ImageObject for hero) without the SA3 overhead of custom Manufacturer/Certification schemas which require sustained schema discipline JARA team would maintain. SA3 is Phase 6 territory; SA2 is the right launch ceiling.",
    "SB": "SB3 maximizes citation visibility AND signals serious B2B intent via comprehensive llms.txt — modern B2B sites doing this stand out in LLM training corpora. The IP control argument in SB2 is weak for technical product specs (which Plycem already publishes publicly); we want the corpus inclusion. Add per-page meta robots with `max-snippet:-1, max-image-preview:large, max-video-preview:-1` for Google rich results.",
    "SC": "SC2 ships ONE pillar at launch covering the day-1 product (subfloor) — high-volume search intent capture without the SC3 content production burden of 3 pillars in days. The other 2 pillars (cladding, fire-code-compliance) ship with the Phase 4.5 product page batch in week 1.",
    "SD": "SD2 dedicated /service-areas page is the right ROI: one extra page captures 'fiber cement supplier near me'-style searches across CA without the SD3 5-state-page production burden. SD3 is phase 6 work after first regional traction.",
    "SF": "SF2 per-product FAQs are LLM citation gold — each Q/A pair is a citable atomic unit. The 8 reusable FAQs + 3-5 per-product specific FAQs = ~38 FAQ items across the site. SF3 dynamic pipeline is Phase 6+ once the team has bandwidth for the manual review workflow.",
    "SH": "SH2 excellent thresholds are achievable with Next.js 16 + Cloudflare Pages + AVIF images + next/font + careful component design. SH3 Lighthouse 100 across 4 categories is a 3-5x effort multiplier (every accessibility nuance, every microoptimization) that doesn't proportionally improve B2B ranking — diminishing returns past SH2."
  },
  "additional_findings": [
    {
      "title": "hreflang tags for /es bilingual setup",
      "description": "The single Spanish landing page /es needs proper hreflang declaration in <head> on both EN and ES pages: <link rel=\"alternate\" hreflang=\"en-US\" href=\"https://jarainternational.com/\"> and <link rel=\"alternate\" hreflang=\"es-US\" href=\"https://jarainternational.com/es\"> + <link rel=\"alternate\" hreflang=\"x-default\" href=\"https://jarainternational.com/\">. Without hreflang, Google may show ES page to EN searchers or vice versa.",
      "severity": "high",
      "applies_to_phase": "4"
    },
    {
      "title": "llms.txt content conventions for SB3",
      "description": "If SB3 wins, /llms.txt structure should follow llmstxt.org convention: project name + 1-2 sentence description + sectioned list of canonical URLs grouped by topic (Products, Resources, Compliance, Contact) + each URL with a 1-sentence description. /llms-full.txt should include the actual content (markdown form) of all pages — generate at build time from the same source as the HTML pages.",
      "severity": "high",
      "applies_to_phase": "4"
    },
    {
      "title": "Sitemap.xml + sitemap-index strategy",
      "description": "For a 6-page launch growing to 11 pages within week 1, single sitemap.xml is sufficient. Generate at build time from Next.js routes. Submit to Google Search Console + Bing Webmaster Tools day 1. For Phase 6+ when product/resource counts grow, split into sitemap-products.xml and sitemap-resources.xml under sitemap-index.xml.",
      "severity": "medium",
      "applies_to_phase": "4"
    },
    {
      "title": "E-E-A-T signals — author/organization credentials",
      "description": "Google's E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) signals matter for B2B construction content. Each pillar/resources page should include: published date, last updated date, author name + role (Robertson Carrillo as VP Distribution or similar title), Organization JSON-LD with company founded date / business credentials / industry associations. Without these, Google deprioritizes 'YMYL-adjacent' content (and construction safety qualifies).",
      "severity": "high",
      "applies_to_phase": "4"
    },
    {
      "title": "Product code searches are the #1 high-intent specifier signal",
      "description": "Architects/specifiers search 'PLYCEM 960140' or 'subfloor panel 972254' when reviewing project specs. Each product page must include all SKU codes prominently in body copy AND as JSON-LD Product.sku/mpn/gtin13 (when GTIN known). Title tag pattern: 'Product Name (Code 960140) | Specs & Datasheet | JARA International'. This is per-product-page level SEO that compounds with SA2 lock.",
      "severity": "high",
      "applies_to_phase": "4"
    },
    {
      "title": "Internal linking cadence per pillar+product strategy",
      "description": "If SC2 wins (1 pillar at launch), the subfloor pillar must internal-link to: /products/high-performance-subfloor (anchor: 'Plycem High Performance Subfloor specifications'), /resources (anchor: 'UL R15140 documentation'), /contact (anchor: 'Request a quote for your project'), and reverse links from those pages back to the pillar. This creates the topic cluster Google rewards. Manual but ~30 min of work for the launch.",
      "severity": "medium",
      "applies_to_phase": "4"
    },
    {
      "title": "Schema validation as CI gate",
      "description": "Add a CI step that validates JSON-LD on every PR using Google's Rich Results Test API or schema.org's validator. A schema typo silently failing in production undermines all SA work. ~10 lines of CI config; high-leverage prevention.",
      "severity": "medium",
      "applies_to_phase": "4"
    }
  ],
  "verdict": "ship",
  "verdict_reason": "All votes select the maximum-SEO+AI option that fits launch-in-days. SA2+SB3+SC2+SD2+SF2+SH2 forms a coherent maximum-leverage stack — covers structured data, LLM training corpus, topical authority, local advantage, FAQ citation surface, and CWV ranking — without overshooting into Phase 6 territory."
}
```

## Vote summary

| Item | Vote | Why this maximizes SEO+AI within launch-in-days |
|---|---|---|
| SA — Schema depth | SA2 | High-impact additions, no maintenance burden of SA3 |
| SB — AI crawlers | SB3 | Max corpus inclusion + signal serious B2B via llms.txt |
| SC — Pillar pages | SC2 | One pillar for day-1 product captures high-volume search |
| SD — Local SEO | SD2 | Service-areas page = right ROI for warehouse advantage |
| SF — FAQs | SF2 | Per-product FAQs = citable atomic units for LLMs |
| SH — Performance | SH2 | Excellent CWV achievable with stack; SH3 diminishing returns |
