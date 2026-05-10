# Round 1.5 — JARA International Inc. Website: Stack + SEO Keyword Strategy

**Type:** Tiebreaker round for 2 unresolved technical items from Round 1.
**Voters:** Same pool — DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1, plus Claude Opus 4.7 (manual). Quorum ≥3/4.

---

## 1. Context — what's already locked from Round 1

You voted in Round 1. The synthesis locked **7 of 9 items**. Two items remain split:

### Locked from Round 1 (do not re-debate)
- **C** Domain → `jarainternational.com` canonical, `jaraintl.com` 301 redirect
- **D** AI strategy → llms-full.txt + JSON-LD + `/api/llm-context` endpoint
- **E** Lead capture → home calculator (NO PRICE) + form + sticky bar with phone/WhatsApp
- **F** Plycem brand → text mentions only at launch, no logo until post-launch approval
- **H** Bilingual → English full + 1 Spanish landing page, full ES deferred to Phase 6
- **B** Architecture (user strategic) → multi-product Plycem catalog (6 products), data schema scaffolds for future multi-brand
- **I** Email (user strategic) → long canonical domain for all email, personal first-name + role-based pattern

### Convergent constraints applied
- n8n webhook must be migrated from test path to production path AND domain whitelist updated to `jarainternational.com`
- IAPMO ER-360 expiration date (2026-07-31) must surface visibly on document pages
- Calculator must pass automated test asserting NO currency strings in output
- Plycem approval requests must be consolidated into ONE submission (logo + "Authorized Distributor" claim + SEO meta keywords)

### New constraint from user
- All hero/product/visual images will be supplied by user (AI-generated). Phase 4 needs only well-named placeholder folders with brand-aligned README guidance.

---

## 2. UNRESOLVED ITEMS — vote on these

### Item A — Tech stack (refined, A4 dropped — was 0 votes in Round 1)

Given B2 lock (multi-product catalog with ~6 product pages + ~20 SKUs, moderate content volume), D2 lock (need SSR for `/api/llm-context` and submittal form), and the constraint that 4 React components from the legacy v0 site are salvageable (submittal form, document request button, section nav, calculator):

- **A1**: **Next.js 16 + React 19 + Tailwind + Radix** (existing v0 stack, deploy on Cloudflare Pages). React components port directly with zero rewrite. SSR/RSC native. Trade-off: heavier client JS than Astro.
- **A2**: **Astro 5 + React islands** (rebuild, deploy on Cloudflare Pages). React components port as Astro islands. Better default Core Web Vitals + smaller JS payload. Trade-off: requires verifying `@astrojs/cloudflare` adapter SSR support for `/api/llm-context` + submittal POST endpoint (GLM raised this concern in Round 1).
- **A3**: **Next.js 16 + Payload CMS** (deploy on Cloudflare Workers + R2 storage). React + non-developer content editing for the 6 product pages and FAQ. Trade-off: significantly more infrastructure complexity (database, admin UI, auth) for moderate content volume; user has no current need to edit content (Claude/agents do edits).

**Reframing:** The decision is between (a) speed-to-launch with familiar React (A1), (b) best long-term Core Web Vitals and SEO (A2), or (c) future content-management capability at high day-1 cost (A3).

### Item G — SEO keyword strategy

Given F3 lock (Plycem text mentions only at launch, logo+brand assets post-approval) and the user's strategic horizon of "Plycem-only for next 6-12 months":

- **G1**: **Generic-only forever.** Title/meta/H1/SEO never include "PLYCEM" brand keywords. Target: "fiber cement subfloor distributor California", "non-combustible UL R15140 panel supplier USA", "ASTM C1186 cement board West Coast". Plycem brand discoverability comes purely from body copy text mentions and JSON-LD `Product.brand` field. Avoids ever needing Plycem SEO meta approval.
- **G3**: **Hybrid with Phase 4 sprint for Plycem brand SEO.** Generic keywords at launch (same as G1). Phase 4 includes a dedicated sprint to: (a) submit Plycem meta-tag approval request as part of consolidated approval; (b) once approved, add Plycem brand keywords to title/meta on relevant pages; (c) build Plycem-branded landing pages (e.g., `/products/plycem-subfloor-california`).

**Reframing:** Given the user's 6-12 month Plycem-exclusive horizon, the brand keywords ARE valuable B2B traffic. G3 captures that value with controlled approval cycle. G1 leaves it on the table permanently. The trade-off is whether the post-approval SEO sprint is worth the engineering effort vs. simpler maintenance.

---

## 3. OUTPUT FORMAT (STRICT JSON ONLY)

```json
{
  "model": "your-model-id",
  "agent": "your-self-described-name",
  "votes": {
    "A": "A1|A2|A3",
    "G": "G1|G3"
  },
  "reasoning": {
    "A": "1-2 sentences",
    "G": "1-2 sentences"
  },
  "additional_findings": [
    {
      "title": "...",
      "description": "...",
      "severity": "blocker|high|medium|low",
      "applies_to_phase": "1|2|3|4|5|6"
    }
  ],
  "verdict": "ship|revise|hold",
  "verdict_reason": "1-2 sentence summary"
}
```

## 4. Notes to voters

- Items already locked are NOT to be re-litigated in this round.
- `additional_findings` should focus on items A and G specifically; convergent findings from Round 1 are already applied.
- Votes are independent — voters do NOT see each other's responses.
- This prompt is immutable.
