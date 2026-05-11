# Round 9 Vote — Claude Opus 4.7

**Captured:** 2026-05-11 (post-merge, before reading other voter outputs)
**Strategic context:** Launch in DAYS. Sprint 3 PR was reviewed (FAQ content human-approved by Robertson) and merged to main. Auditing the as-shipped deliverable on commit `c09ca25`.

```json
{
  "model": "claude-opus-4-7",
  "agent": "Claude Opus 4.7 (1M context, file-level access)",
  "votes": {
    "RA": "RA2",
    "RB": "RB2"
  },
  "reasoning": {
    "RA": "Sprint 3 shipped the full PE1 template across all 6 products with TypeScript clean, 21 prerendered routes, and all 5 Round 8 picks plus all 5 convergent F1-F5.R8 findings applied. However, the Round 8 F1.R8 mandate (4/4 unanimous) explicitly required Google Rich Results Test validation on at least 2 URLs before push — that validation step was not executed, only the local build PASS. The other concerns are administrative (MASTER_AUDIT.md drift, OG image visual smoke not done). Cluster of ~30 min of cleanup before Sprint 4 starts, not architectural rework.",
    "RB": "Sprint 4 introduces server actions for the /resources 3-step submittal form, n8n webhook integration with production credentials, multi-step form state management, and the calculator URL prefill receiver — all new patterns unbuilt anywhere else in the codebase. Same reasoning Round 7 applied to Sprint 3 (which proved correct: Sprint 3 had 5 convergent findings worth applying). Medium is the right planning posture."
  },
  "concerns_observed": [
    {
      "title": "F1.R8 validation step not executed — Rich Results Test on 2 URLs required by 4/4 voters",
      "category": "seo_ai",
      "severity": "high",
      "must_fix_before_sprint_4": true,
      "description": "Round 8 F1.R8 (4/4 voters) explicitly mandated running Google Rich Results Test on at least 2 product URLs (one high-variant like subfloor, one single-variant like fibroxton) to validate that the 3 JSON-LD blocks (Product + FAQPage + BreadcrumbList) parse without @id collision warnings. The local build verified TypeScript and route generation but did NOT run schema validation. This is a 10-minute cleanup task (visit https://search.google.com/test/rich-results, paste live URL, check for warnings) but it's the difference between 'we believe the schema is valid' and 'we verified it'. Must run before Sprint 4 — easier to fix collisions now than after more JSON-LD code lands."
    },
    {
      "title": "MASTER_AUDIT.md is stale by 2 sprints — still references Sprint 1 as latest",
      "category": "operations",
      "severity": "medium",
      "must_fix_before_sprint_4": true,
      "description": "docs/MASTER_AUDIT.md line 127 still reads 'Sprint 1 ✅ COMPLETE + reviewed (Round 5) | Sprint 2 next'. Sprint 2 (Round 6/7) and Sprint 3 (Round 8/9) are not reflected. The Phase 4 progress table, ADR list (ADR-026 max), and 'next' arrow are all out of date. This is the single source of truth document for project state — its drift undermines the consensus pattern's traceability. ~15 min to bring current; should be updated as part of every sprint cleanup commit going forward (process improvement, not just one-time fix)."
    },
    {
      "title": "OG image visual smoke not done — Cloudflare Workers runtime compatibility unverified",
      "category": "operations",
      "severity": "medium",
      "must_fix_before_sprint_4": false,
      "description": "app/products/[slug]/opengraph-image.tsx uses ImageResponse from next/og (powered by @vercel/og + satori). It registered as ●  SSG (statically generated) in the build output, which is encouraging, but no human eye has confirmed the generated PNG actually renders correctly (gradient direction, text overflow on long product names like 'High Performance Subfloor', thickness pill alignment, font fallback). Visit /products/high-performance-subfloor/opengraph-image and /products/fibroxton/opengraph-image directly on the production deploy and inspect the PNGs. If broken, this is a launch-day social-share quality issue, not a functional blocker."
    },
    {
      "title": "VariantTable sortable headers deferred — partial PA1 implementation",
      "category": "ux",
      "severity": "low",
      "must_fix_before_sprint_4": false,
      "description": "Round 8 PA1 description includes 'sortable by thickness on desktop'. Sprint 3 implementation pre-sorts variants ascending by thickness in render (server component, zero JS) but does not expose interactive sort controls. For 4 of 6 products (≤2 thicknesses), this delivers the same user-facing state. For high-variant products (subfloor with 4 thicknesses × edge profiles = 7 SKUs), users cannot re-sort by edge profile or SKU. Defensible as 'KISS for launch' but document explicitly in the PA1 implementation notes so a future contributor doesn't mistake the deferral for an oversight."
    },
    {
      "title": "Hreflang launch limitation not commented in page.tsx metadata",
      "category": "seo_ai",
      "severity": "low",
      "must_fix_before_sprint_4": false,
      "description": "generateMetadata() on /products/[slug]/page.tsx sets alternates.languages with es-US pointing to ${SITE.url}/es (the marketing root, not per-slug Spanish detail). This is the documented Round 8 launch limitation but the file has no comment explaining it. A future maintainer reading this code might 'fix' it to ${SITE.url}/es/products/${slug} without realizing those routes don't exist yet, breaking Google's hreflang validation. Add a 3-line comment citing the Round 8 §4 disposition."
    },
    {
      "title": "Round 8 prompt template still asking voters to identify themselves correctly — track if Round 9 fixes the misidentification",
      "category": "operations",
      "severity": "low",
      "must_fix_before_sprint_4": false,
      "description": "Round 9 prompt §8 includes an explicit ask for voters to use their actual model name (not 'Claude') in the agent/model fields. If Round 9 voters STILL self-identify as Claude despite the explicit instruction, this points to a deeper prompt-template adherence problem worth investigating before relying on the agent field for any decision (e.g., voter-weighting policies). Document the outcome in Round 9 synthesis voter-accuracy notes."
    }
  ],
  "compliments": [
    "WCAG 2.1 AA discipline carried forward cleanly from Sprint 2 — VariantTable's caption + th scope=col + focusable scroll region + sticky first column + text-not-icon pattern is reusable for Sprint 4 form tables, and the Round 7 calculator a11y pattern (fieldset/legend/aria-required) provides a parallel reference for Sprint 4 form fields.",
    "JSON-LD discipline: 3 schemas per page (Product + FAQPage + BreadcrumbList) with collision-safe @id anchors (#product, #faq, #breadcrumb) executed cleanly per F1.R8. Schema builders in lib/jsonld.ts now take pageUrl as first param — small API change but it makes per-page @id derivation impossible to forget."
  ],
  "verdict": "revise",
  "verdict_reason": "Sprint 3 architecturally shipped clean — full PE1 template, all Round 8 picks applied, build PASS, 21 prerendered routes. Single high-severity gap is the F1.R8 validation step (Rich Results Test) which was mandated by 4/4 voters but not executed. ~30 minutes of cleanup (validation + MASTER_AUDIT update + 2 in-code comments) before Sprint 4 starts is the right disposition."
}
```

## Vote summary

| Item | Vote | One-line reason |
|---|---|---|
| RA — Sprint 3 verdict | RA2 ship-with-fixes | Build clean but F1.R8 validation mandate not executed |
| RB — Sprint 4 risk | RB2 medium confidence | Server actions + n8n webhook + multi-step form state = new pattern surface |
| Verdict | revise | ~30 min cleanup before Sprint 4 |

## Concerns by category

| Severity | Count | Categories |
|---|---|---|
| high | 1 | seo_ai (F1.R8 validation) |
| medium | 2 | operations (MASTER_AUDIT staleness + OG image smoke) |
| low | 3 | ux + seo_ai + operations |
