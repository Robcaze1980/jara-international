# Round 2 — Synthesis (Visual Design System)

**Date:** 2026-05-10
**Type:** Visual design under launch-in-days strategic constraint
**Voters captured:** Claude Opus 4.7, Gemini 3.1 Flash Lite, GLM-5.1, DeepSeek V4 Pro (4/4)
**Quorum rule:** ≥3/4 per item (R-CONS-7)
**Prompt:** [`round2_prompt.md`](round2_prompt.md)
**Vote files:** [`round2_claude.md`](round2_claude.md), [`round2_gemini.json`](round2_gemini.json), [`round2_glm.json`](round2_glm.json), [`round2_deepseek.json`](round2_deepseek.json)

---

## 1. Vote tally

| Item | Claude (Opus 4.7) | Gemini (3.1 FL) | GLM-5.1 | DeepSeek (V4 Pro) | Tally | Action |
|---|---|---|---|---|---|---|
| **VA** Hero composition | VA1 | VA1 | VA1 | VA1 | **VA1=4** | **🔒 LOCK VA1** |
| **VB** Product card | VB3 | VB1 | VB1 | VB3 | VB1=2, VB3=2 | ❌ split — needs resolution |
| **VC** Stitch usage | VC3 | VC3 | VC3 | VC3 | **VC3=4** | **🔒 LOCK VC3** |
| **VD** Symbol UI treatment | VD1 | VD1 | VD1 | VD1 | **VD1=4** | **🔒 LOCK VD1** |

**Verdicts:** 4/4 ship. No revise, no hold. 3 of 4 items unanimous.

---

## 2. Locked decisions

### 🔒 ADR-010 — Hero composition: VA1 (full-bleed photo + dark navy overlay)
- **Vote:** VA1, 4/4 unanimous
- **Decision:** Single full-bleed hero image (user-supplied, AI-generated) with dark navy `#062B49` overlay at 60% opacity. Centered text block: H1 (Montserrat Bold) + subhead (Inter Regular) + 2 CTA buttons (primary navy "Request a Quote" + outline "View Products"). Single screen, no scroll-trigger, no animation.
- **Rationale (convergent):** Fastest pattern to ship, works with any hero image without layout negotiation, mobile-responsive by default, fully JARA brand-compliant.
- **Implementation constraint (from GLM finding):** Overlay must be implemented as a solid-to-transparent gradient (navy 85% left fading to 60% right) OR add text-shadow to guarantee WCAG AA contrast regardless of photo brightness — blanket 60% opacity may fail AA on bright photos.

### 🔒 ADR-011 — Stitch integration: VC3 (NO Stitch — hand-craft from brand tokens)
- **Vote:** VC3, 4/4 unanimous
- **Decision:** No Stitch in Phase 2 or Phase 4. Build directly with Tailwind + Radix using locked JARA color palette and typography. Stitch reserved for Phase 6+ post-launch marketing campaign visuals if/when launch pressure subsides AND user provides Stitch API key.
- **Rationale (convergent):** Stitch setup requires Claude CLI installation + API key + MCP configuration — 30+ minutes of friction at the worst possible moment. JARA brand guide already locks color/typography/photography style — design space is sufficiently constrained to skip Stitch iteration cycles.

### 🔒 ADR-012 — Three-panel symbol UI: VD1 (logo only)
- **Vote:** VD1, 4/4 unanimous
- **Decision:** Three-panel symbol appears ONLY in the navigation logo (header) and footer logo. No background patterns, no section accents, no decorative reuse.
- **Rationale (convergent):** Respects JARA brand guide §24 explicit warning against decorative over-use of the symbol. Zero extra component work. Favicon (32px symbol) added as first post-launch patch (~5 min work, high brand impact per GLM finding).

---

## 3. Item without quorum — VB Product card layout

### Tally: VB1=2 (GLM, Gemini), VB3=2 (Claude, DeepSeek)

**Split rationale:**
- **VB1 (photo-first) voters:** "Standard B2B catalog pattern, fastest if photos are ready, pairs naturally with user's AI-generated images"
- **VB3 (icon-first) voters:** "Ships catalog WITHOUT waiting on product photos; icons are temporary placeholder, swap when images delivered"

**Root tension:** The split depends on a question the prompt didn't include: **when will user-supplied product images be ready?**

- If product images ready **by launch day** → VB1 wins (photo-first looks more polished, expected B2B pattern)
- If product images ready **post-launch** → VB3 wins (ship the catalog without blocking on images)

This is a **strategic question for the user** (image generation timeline), not a technical question — escalating per the user's decision-making model.

### Strategic question for user

> **¿Las imágenes AI-generadas para los 6 productos van a estar listas el día del lanzamiento, o las vas a generar después?**
>
> - **Listas para launch day:** ADR locks **VB1** (photo-first cards)
> - **Llegan post-launch (días/semanas después):** ADR locks **VB3** (icon-first now, swap to photos when llegan)
> - **Mixto (algunas listas, otras no):** Pragmatic resolution → use VB1 layout for cards WITH images delivered, navy gradient placeholder + product name for cards WITHOUT images. Keep one canonical layout (VB1) with graceful image fallback.

---

## 4. Convergent additional findings (≥2 voters → APPLY)

### F1.R2 — Image swap workflow for product cards (DeepSeek + Claude)
- **Detail:** Regardless of VB1 vs VB3 outcome, Phase 4 implementation must support clean image swap-in without layout changes when user delivers AI-generated product photos. Use `next/image` with consistent aspect ratios (recommend 4:3 photos at 1600×1200 source).
- **Status:** Applied as Phase 4 implementation requirement.

### F2.R2 — Stitch deferred to post-launch consideration only (DeepSeek + Claude)
- **Detail:** Both voters explicitly note Stitch could be revisited post-launch when launch pressure subsides AND user has set up Claude CLI + Stitch API key. Not a blocker; just a documented option for Phase 6 visual refinement.
- **Status:** Documented in Phase 6 backlog. No action this round.

---

## 5. Single-voter findings — applied or deferred

| Finding | Voter | Severity | Disposition |
|---|---|---|---|
| Use `next/font/google` for Montserrat + Inter (avoid CLS, render-block) | GLM | High | **Apply** — Phase 4 implementation requirement |
| Hero overlay contrast must be WCAG AA-validated (gradient or text-shadow) | GLM | Medium | **Apply** — already incorporated into ADR-010 implementation constraint |
| Favicon from three-panel symbol (32px) | GLM | Low | **Apply** — first post-launch patch (5 min work) |
| Define palette as CSS variables in globals.css immediately | Gemini | Medium | **Apply** — Phase 4 first sprint task |
| Minimize launch page count to 6 (home + /products + /products/subfloor + /resources + /contact + /es) | Claude | High | **Strategic question to user** — see §6 |
| Hero placeholder gradient if user image not ready | Claude | Medium | **Apply** — fallback per F1.R2 |
| Remove `darkMode: ['class']` from tailwind.config | Claude | Low | **Apply** — Phase 4 cleanup |
| Cloudflare Web Analytics on day 1 (free, no consent banner) | Claude | Medium | **Apply** — Phase 4 implementation |

---

## 6. Strategic questions for user (to close Phase 2 + define Phase 3+4 scope)

### Q1 — Product image timeline
*(resolves VB split — see §3)*

¿Cuándo van a estar listas las 6 imágenes de producto AI-generadas?
- (a) Day-1 launch
- (b) Post-launch
- (c) Mixto

### Q2 — Launch surface scope
*(applies Claude finding "Minimize launch page count to 6")*

Given launch-in-days, recommend shipping a minimum-viable surface and adding remaining product pages 3-7 days post-launch. Recommended launch set:
1. `/` (home)
2. `/products` (catalog list — all 6 products listed with cards)
3. `/products/high-performance-subfloor` (one canonical product detail page — validates template for the other 5)
4. `/resources` (form + document library)
5. `/contact`
6. `/es` (single Spanish landing page)

The other 5 product detail pages (roof sheathing, deck, hidden joint, cement board, fibroxton) ship as a follow-up batch within 1 week using the validated subfloor template.

**¿OK con esa lista de 6 páginas para day-1 launch, o necesitas algo diferente?**

---

## 7. Token + cost summary

| Voter | Prompt tokens | Completion tokens | Cost (USD) |
|---|---|---|---|
| Gemini 3.1 Flash Lite | 2,170 | 333 | $0.0010 |
| DeepSeek V4 Pro | 2,109 | 1,728 | $0.0024 |
| GLM-5.1 | 2,073 | 1,639 | $0.0100 |
| Claude Opus 4.7 (manual) | (in-session) | (in-session) | ~$0.05 est. |
| **Total Round 2** | — | — | **~$0.06** |
| **Phase 1+2 cumulative** | — | — | **~$0.24** |

---

## 8. Verdict

✅ **Round 2 status: PARTIAL — 3 of 4 items locked, 1 item awaits user strategic input.**

---

## 9. User strategic resolutions (post-synthesis, 2026-05-10)

### 🔒 ADR-013 — Product card: VB1 with generic placeholder logic
- **User input (Q1):** "No estoy seguro,,,,podemos poner una foto generica mientras"
- **Decision:** Lock **VB1** layout (photo-first card pattern). Use a single brand-compliant generic placeholder image for any product card without a delivered AI-generated image. Layout never changes; only the `<img src>` swaps when user delivers per-product photos.
- **Implementation:** Generic placeholder = navy gradient (`#062B49` → `#04233D` diagonal) + small white three-panel symbol watermark + product name overlay (Montserrat SemiBold). Stored at `public/images/products/_placeholder.webp`. Per-product photos drop into `public/images/products/{slug}.webp` and override automatically.
- **Resolves consensus split:** VB1=2 vs VB3=2. User strategic call wins per decision-making model.

### 🔒 Launch page surface (Q2)
- **User input (Q2):** "6 paginas para launch"
- **Decision:** Day-1 launch ships with exactly these 6 pages:
  1. `/` — Home (hero + calculator + featured products + CTAs)
  2. `/products` — Catalog list (6 product cards)
  3. `/products/high-performance-subfloor` — Canonical product detail page (validates template)
  4. `/resources` — Submittal form + document library
  5. `/contact` — Contact page
  6. `/es` — Single Spanish landing page
- **Phase 4.5 follow-up batch (week 1 post-launch):** Remaining 5 product detail pages (roof-sheathing, deck, exterior-hidden-joint, exterior-cement-board, fibroxton) using the validated subfloor template.

---

## 10. Reversal: Phase 3 reinstated as dedicated SEO+AI consensus round

**Original synthesis recommendation (§ deprecated):** "Phase 3 content/SEO naturally absorbed into Phase 4 sprints given launch-in-days."

**User pushback (2026-05-10):** "Ya se defininio la estaregia de maximizacion de SEO y AI por el modelo concensus? en toda fase esto debe priorizarse"

**Correction:** Phase 3 is reinstated as a dedicated SEO+AI tactical consensus round (Round 3) before Phase 4 begins. The high-level locks D2 (AI strategy) and G3 (SEO keywords) define WHAT — Round 3 defines HOW for every page and every sprint. SEO+AI is now a permanent project memory priority equal to Plycem ship blockers.

**Phase 1+2 final tally: 13 of 13 items locked.** Phase 2 closed.

**Next: Round 3 — SEO + AI Tactical Maximization.**
