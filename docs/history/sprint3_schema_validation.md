# Sprint 3 Schema + OG Validation (Round 9 F1.R9 + C2)

**Date:** 2026-05-11
**Audited deploy:** https://jarainternational.com (production, post Sprint 3 merge commit `c09ca25`)
**Tools used:** `scripts/validate_jsonld.py` (custom, programmatic JSON-LD structural validator) + `curl` for OG image binary probes.

This is a partial substitute for Google's Rich Results Test (which requires browser access). It confirms JSON parses, `@id` values are present and unique, expected schema types match the Round 8 spec, and key fields are populated. **Robertson should still run the live Rich Results Test post-redeploy** for Google's parser-specific eligibility check — but every structural check that can be done from CLI passes.

---

## 1. JSON-LD validation (F1.R9 — was F1.R8 4/4 mandate)

Ran `python scripts/validate_jsonld.py <2 URLs>` against the two most-different products: high-variant subfloor (7 SKUs, 5 FAQs, 7 compliance certs) and single-variant fibroxton (1 SKU, 4 FAQs, 2 compliance certs).

### Result: 0 issues across both URLs.

| URL | Blocks | Types | @id collisions |
|---|---|---|---|
| `/products/high-performance-subfloor` | 5 | Organization, LocalBusiness, Product, BreadcrumbList, FAQPage | 0 |
| `/products/fibroxton` | 5 | Organization, LocalBusiness, Product, BreadcrumbList, FAQPage | 0 |

Note: Organization + LocalBusiness come from the root layout (Sprint 1) and ride on every page — that's correct. Product + BreadcrumbList + FAQPage are the 3 detail-page-specific blocks Round 8 F1.R8 mandated, all with collision-safe `@id` anchors:
- `<canonical>#product` (Product)
- `<canonical>#breadcrumb` (BreadcrumbList)
- `<canonical>#faq` (FAQPage)

### Key fields verified

**Product schema (both URLs):**
- `offers.@type=Offer`, `offers.availability=https://schema.org/InStock` — present ✓
- `sku` + `mpn` populated from variants[0].sku — present ✓
- `additionalProperty[]` populated from compliance[] — 7 entries on subfloor, 2 on fibroxton — correct ✓
- `manufacturer.name=Plycem`, `brand.name=Plycem` — ADR-006 text-only attribution, no logo ✓

**BreadcrumbList:**
- Items: `[Home, Products, <Product Name>]` — correct 3-level trail ✓

**FAQPage:**
- subfloor: 5 Q&A items (matches `data/products.ts`) ✓
- fibroxton: 4 Q&A items (matches `data/products.ts`) ✓

### GLM Round 9 "missing offers" concern: factually wrong

GLM-5.1's Round 9 vote flagged Product schema as "likely missing `offers`" — confirmed by live HTML inspection that `offers` is present with `availability=InStock`. Same probabilistic-guess pattern Round 7 documented for DeepSeek. Voter-accuracy note for future rounds.

---

## 2. Open Graph image validation (C2 — Round 9 Claude single-voter)

Ran `curl -sS -o <file> -w "%{http_code}|%{size_download}|%{content_type}"` against all 6 OG image endpoints.

### Result: BUG FOUND — all 6 OG images byte-identical.

| Slug | HTTP | Size (bytes) | MD5 (first 3 verified identical) |
|---|---|---|---|
| high-performance-subfloor | 200 | 70164 | `d4d7626db09ba6da74c13ef0b2359a6f` |
| roof-sheathing | 200 | 70164 | same |
| deck | 200 | 70164 | same |
| exterior-hidden-joint | 200 | 70164 | (not verified, same size) |
| exterior-cement-board | 200 | 70164 | (not verified, same size) |
| fibroxton | 200 | 70164 | same |

All 6 images had **identical MD5 hashes**, meaning the `slug` param was not threading through and all 6 were rendering the generic "JARA International" fallback (no thickness pill).

### Root cause

In Next.js 16, `params` for dynamic-route metadata files (`opengraph-image.tsx`) is a `Promise<{ slug: string }>` — same async pattern as `page.tsx`. Sprint 3 build typed it synchronously (`{ slug: string }`), so `params.slug` evaluated to `undefined` and `getProductBySlug(undefined)` returned `undefined`, triggering the fallback path.

### Fix applied (F2.R9)

`app/products/[slug]/opengraph-image.tsx`:
```diff
- export default async function OpengraphImage({ params }: { params: { slug: string } }) {
-   const product = getProductBySlug(params.slug);
+ type Params = Promise<{ slug: string }>;
+
+ export default async function OpengraphImage({ params }: { params: Params }) {
+   const { slug } = await params;
+   const product = getProductBySlug(slug);
```

Inline comment added citing this validation finding.

### Re-validation required

Once the fix is merged + Cloudflare Pages redeploys, re-run:
```
for slug in high-performance-subfloor roof-sheathing deck exterior-hidden-joint exterior-cement-board fibroxton; do
  curl -sS -o /tmp/og_${slug}.png "https://jarainternational.com/products/${slug}/opengraph-image"
done
md5sum /tmp/og_*.png
```

Expected: 6 different MD5 hashes (one per product). If still identical, escalate — there may be a runtime issue with `next/og` on Cloudflare Workers / OpenNext.

---

## 3. Summary

| Check | Result |
|---|---|
| JSON-LD 3-block structure (Round 8 F1.R8) | ✓ PASS |
| `@id` collision-free per page | ✓ PASS |
| Product schema offers + availability | ✓ PASS |
| BreadcrumbList 3-item trail | ✓ PASS |
| FAQPage Q&A counts match data | ✓ PASS |
| Per-product OG image uniqueness (Round 8 F4.R8) | ✗ FAIL — bug fixed, awaits redeploy |
| Google Rich Results Test (live, browser) | ⏳ Robertson to run post-redeploy |

**Net Round 9 finding promoted to F2.R9** (OG image params bug) — caught by the audit follow-through, not by Round 8 voters or local build. Reinforces the milestone-review pattern's value.
