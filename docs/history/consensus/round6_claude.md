# Round 6 Vote — Claude Opus 4.7

**Captured:** 2026-05-10 (before reading other voter outputs)
**Strategic context:** Launch in DAYS + SEO/AI maximization mandate. Optimizing for fastest-to-ship among brand-compliant options.

```json
{
  "model": "claude-opus-4-7",
  "agent": "Claude Opus 4.7 (1M context, file-level access)",
  "votes": {
    "HA": "HA1",
    "HB": "HB2",
    "HC": "HC1",
    "HD": "HD3",
    "HE": "HE2"
  },
  "reasoning": {
    "HA": "Single-screen calculator is fastest to ship — one component, one form state, no step-transition animation, no progressive-disclosure JS bugs to debug. Mobile-friendly via vertical stacking. Conversion data on B2B calculators is mixed: HA2's 'feel earned' lift is ~5-10% in studies but costs 2x dev time. HA3 is Sprint 3+ territory.",
    "HB": "Top-3 with 'view all' avoids the 6-card crowding on home (HB1) and the by-application taxonomy work (HB3 needs 3 group descriptions written, 3 grouping decisions defended). Top-3 picks are obvious: subfloor (flagship/highest-volume product), exterior cement board (only product with IAPMO ER-360 — highest-value SEO), deck (visually distinct planks). The 6-product story still wins via the catalog page link.",
    "HC": "3 props is enough at launch. HC2's 'manufacturing origins' is a secondary story belonging on /about — at home it dilutes the primary differentiators (in-stock, compliance, support). HC3's 'multi-product catalog' duplicates the products section right next to it. Keep home tight.",
    "HD": "HD3 (trust bar early) matches the audience: architects and specifiers scan for compliance signals first, products second. UL/ASTM/IAPMO logos right under hero answers their first question ('is this code-compliant?') before they evaluate anything else. Calculator near the bottom catches engaged visitors who've already seen the credentials.",
    "HE": "HE2 appears-after-scroll is the right balance — first impression isn't dominated by a CTA bar, but engaged visitors get the persistent reminder. HE1 always-visible feels pushy on first load (especially on mobile where it eats real estate). HE3 different-per-device adds component complexity for marginal benefit at launch."
  },
  "additional_findings": [
    {
      "title": "Calculator validation rules need explicit specification",
      "description": "Sprint 2 calculator must validate: SF area > 0, construction type required (dropdown with sane defaults — Type V over podium most common for our subfloor product), thickness preference optional (default 20mm = best-seller). On invalid input, NO calculation runs; error message in red navy text. Output reveals only when all required fields valid. Add a `data-testid` to each field for the no-currency CI test (Round 1.5 F3.5 constraint C3) to attach to.",
      "severity": "high",
      "applies_to_phase": "4"
    },
    {
      "title": "Featured products link target — pre-build /products/[slug] routes for the 3 featured?",
      "description": "If HB2 wins (top-3 featured), each card needs a 'View specs →' link. Where does it go? Three options: (a) link to /products (catalog list) for all 3 cards initially, (b) build the 3 product detail pages this sprint (subfloor, exterior cement board, deck) so links resolve, (c) build a subfloor-only detail page + featured cards for the other 2 also link to /products. (a) ships fastest; (b) gives a real B2B experience for the 3 most important products on day 1; (c) is a hybrid. Recommend (a) for Sprint 2, then Sprint 3 builds all 6 product pages. Document the links as expected-to-be-overwritten.",
      "severity": "medium",
      "applies_to_phase": "4"
    },
    {
      "title": "Trust bar logos — text-only at launch (Plycem ship blocker compliance)",
      "description": "If HD3 wins (trust bar early), the trust bar should be TEXT-ONLY at launch — 'UL R15140 Classified · ASTM C1186 Type A Grade I · IAPMO ER-360 · ASTM E-84 Class A · CBC Ch 7A' with each cert linkable to the cert PDF in /resources. Do NOT use Plycem logo or 'Manufactured by Plycem' branding (per ADR-006 F3 lock — text mentions only). Logo of UL itself is licensed-use (need to check UL's mark policy); safer to use the wordmark.",
      "severity": "high",
      "applies_to_phase": "4"
    },
    {
      "title": "Sticky bar visibility on /es page",
      "description": "If HE2 wins (appears after scroll), the sticky bar must also work on /es with Spanish copy ('Cotizar' instead of 'Quote', etc.) and SAME phone + WhatsApp numbers. Verify the component reads i18n strings, not hardcoded English. Otherwise /es looks half-implemented even though it's a single landing page.",
      "severity": "medium",
      "applies_to_phase": "4"
    },
    {
      "title": "Featured products section needs Product JSON-LD per ADR-014",
      "description": "When the 3 featured product cards render on home, each card SHOULD emit a Product JSON-LD with name, manufacturer, sku (from variants[0].sku), category, description. ADR-014 SA2 lock includes Product schema — easy to add via a builder in lib/jsonld.ts that takes a Product type and returns the schema. Without this, home loses 3 indexable Product entities — direct miss against SEO+AI mandate.",
      "severity": "high",
      "applies_to_phase": "4"
    }
  ],
  "verdict": "ship",
  "verdict_reason": "HA1 + HB2 + HC1 + HD3 + HE2 forms a coherent, fast-to-ship home page that prioritizes the architect/specifier audience (trust-first sequence) without overloading components or copy. The 5 additional findings tighten implementation but don't block voting."
}
```

## Vote summary

| Item | Vote | Why fastest-and-correct |
|---|---|---|
| HA — Calculator UX | HA1 single-screen | One component, no step animation |
| HB — Featured products | HB2 top-3 | Avoids 6-card crowding, surfaces flagships |
| HC — Value props | HC1 3 props | Tight; supply story belongs on /about |
| HD — Section order | HD3 trust-first | Specifier audience scans for compliance signals first |
| HE — Sticky bar | HE2 after-scroll | Balanced — non-pushy first impression, persistent for engaged visitors |
