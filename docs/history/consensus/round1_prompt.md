# Round 1 — JARA International Inc. Website: Architecture & Stack

**Project:** Redesign of `plycemca.com` (deprecated) into a new B2B website for **JARA International Inc.** — a US-based construction materials distribution company sourcing fiber-cement panels from Plycem (Costa Rica / El Salvador / Honduras).

**Your role:** You are one of 4 voters in a multi-LLM consensus (R-CONS-7 quorum rule, ≥3/4 to lock). The other 3 voters are: Claude Opus 4.7, DeepSeek V3.1, GLM-4.6, Gemini 3 Pro (you are one of these — answer for yourself, not as another model).

**Output format:** Strict JSON. See §6 below. Do not output anything outside the JSON object.

---

## 1. Context: who is JARA International Inc.

- **Company type:** B2B construction materials sourcing & distribution. New entity (just incorporated).
- **Brand identity:** Deep navy + steel-blue palette, Montserrat/Inter typography, three-panel symbol logo. Tone: established, technical, organized, corporate, premium-but-not-luxury. Tagline: "Global Sourcing. Built on Trust."
- **Primary market:** **United States, mainly.** Warehouse in Long Beach, CA; expansion target is national US (West Coast first, then continental US). Spanish-language content is a *secondary* consideration for the US Hispanic construction labor market (install crews, jobsite PMs) — NOT for LatAm export. SEO, terminology, codes (IBC/IRC/ASTM/UL), measurement units (imperial primary, metric secondary), and currency (USD) all default to US norms.
- **Audience:** US-based contractors, architects, engineers, developers, general contractors, distributors, procurement managers.
- **Domains owned (Cloudflare):** `jarainternational.com` (canonical), `jaraintl.com` (short alt — redirect or email-only).
- **Critical:** JARA is a **distributor of Plycem products**, NOT a sub-brand of Plycem. The Plycem Distributor Brand Usage Guide imposes strict limits on how Plycem can be referenced (see §3 ship blockers).

## 2. Context: legacy site audit findings (the v0 site we are replacing)

The previous site at `plycemca.com` (built with v0.com) has **35 Plycem compliance violations** across 9 categories. It was effectively positioning itself AS Plycem (footer claimed "© 2025 The Plycem Company. All rights reserved."), used `plycemca.com` domain, published unauthorized prices and competitor comparisons. **Cannot be salvaged as-is.** What IS salvageable:

- **Multi-step submittal form** (3 steps, 25+ fields, n8n webhook integration, honeypot, panel calculator) — port intact, re-skin
- **Document request button** (one-click email request via webhook) — port intact
- **Section nav** (sticky desktop sidebar + mobile horizontal pills) — port intact
- **Tech specs data** for subfloor (4 thicknesses, codes, mechanical properties) — port to data layer
- **Fire/code compliance content** (UL designs H502/H504/H511/U449/U487, ASTM E84/E136, IBC 2021, CBC, CSI specs, ISO certs)
- **8 of 9 FAQs** (1 requires Plycem approval — Plycem-vs-USG comparison)
- **5 official PLYCEM YouTube videos** (subfloor, roof sheathing, deck, exterior hidden joint, interior exposed joint) — embeddable with attribution per Plycem guide

## 3. Ship blockers (NOT VOTABLE — contractual)

These override any vote. They must be true on day 1:

1. Domain MUST NOT contain "PLYCEM"
2. Site brand = JARA International Inc., NOT "PlycemCA" / "Plycem Subfloor"
3. NO Plycem-vs-competitor comparisons without prior written Plycem approval
4. NO Plycem list prices published without authorization
5. NO "PLYCEM" in SEO meta tags / titles for positioning without approval
6. "Authorized Distributor" language requires prior approval
7. Plycem logo only in dedicated `/suppliers` section, with prior approval
8. Footer copyright = "© 2026 JARA International Inc." (NEVER claim to be Plycem)
9. Email = `@jarainternational.com` or `@jaraintl.com` (NEVER `@plycem*`)

## 4. Context: product catalog (derived from 10 Plycem PDFs)

JARA distributes (or can distribute) at minimum 6 Plycem products. UL R15140 covers 20+ named Plycem products, so catalog is extensible:

| Product | Codes | Thicknesses | Use case |
|---|---|---|---|
| High Performance Subfloor | 960140, 972254 (T&G), 960151, 971677 (T&G), 960159, 971829 (T&G), 960162 | 20/22/25/30mm | Structural subfloor on metal/wood, fire-rated assemblies |
| Roof Sheathing | 960102, 960145 | 14/17mm | Structural roof decking, exterior facade |
| Deck | 982315, 1323611 | 30mm planks | Outdoor decks, wood-look workability |
| Exterior Hidden Joint | 960018/19, 972234, 960093/96, 974213, 979441, 979422/911, 980261, 979423 | 8/10/11/12/14mm | Monolithic-finish facade cladding |
| Exterior Cement Board | 1323827 | 12mm + fiberglass mesh | Interior/exterior walls with basecoat |
| Fibroxton | 1332667 | 10mm | Cladding (cement+wood blend), tapered edge |

Common properties: ASTM C1186 Type A Grade I, ISO 8336:2018, ASTM E-84 flame spread 0 / smoke 0, ISO 9001/14001/45001 manufacturing.

Key documents available for download (gated email capture):
- **IAPMO ER-360** (Evaluation Report, valid through 2026-07-31, IBC 2015/2012 + IRC compliance)
- **UL R15140 Certificate of Compliance** (2016-MAR-23)
- **UL R12102 Costa Rica listing**
- 6 Technical Data Sheets (one per product line)
- ASTM E-84 certificates (Costa Rica + Plycem Products)

## 5. VOTING ITEMS

For each item, vote on ONE option. If you have a strong reason an item should have a different option not listed, you may write `"X4_writein": "..."` instead — but the synthesis will treat write-ins as no-quorum unless ≥2 voters propose the same write-in.

### Item A — Tech stack base
- **A1**: Keep Next.js 16 + React 19 + Tailwind 3.4 + Radix (existing v0 stack, deploy on Cloudflare Pages)
- **A2**: Migrate to Astro 5 (better SSG/SEO/Core Web Vitals, less client JS, deploy on Cloudflare Pages)
- **A3**: Next.js 16 + Payload CMS headless (so Jara non-developers can edit content)
- **A4**: SvelteKit 2 (smallest JS payload, fastest TTI, deploy on Cloudflare Pages)

### Item B — Site architecture
- **B1**: Single-product site (only Plycem subfloor — focused SEO authority)
- **B2**: Multi-product Plycem catalog (all 6 product lines from PDFs, structured `/products/{slug}`)
- **B3**: Multi-brand catalog (Plycem now + scaffolded for future suppliers, framing JARA as supplier-agnostic distributor)

### Item C — Canonical domain
- **C1**: `jarainternational.com` canonical, `jaraintl.com` 301 redirect
- **C2**: `jaraintl.com` canonical (shorter, easier email), `jarainternational.com` 301 redirect
- **C3**: Both apex with rel=canonical pointing to `jarainternational.com` (no redirect, parallel)

### Item D — AI-friendly strategy depth (for LLM citation visibility — ChatGPT, Claude, Perplexity, Gemini)
- **D1**: Minimal — `llms.txt` + JSON-LD (Organization, Product, FAQPage, BreadcrumbList) + semantic HTML tables
- **D2**: D1 + `llms-full.txt` with full product specs + `/api/llm-context` public endpoint with structured product data
- **D3**: D2 + embedded chatbot (Claude API or Cloudflare AI Gateway routed) for technical Q&A with email capture
- **D4**: D2 + MCP server (`mcp.jarainternational.com`) exposing product catalog as MCP tools for agentic AI buyers

### Item E — Lead capture pattern on home page
- **E1**: Primary CTA "Request a Quote" + secondary "Download Spec Sheet" (gated email)
- **E2**: E1 + sticky bottom bar with phone + WhatsApp Business (Long Beach office)
- **E3**: E2 + interactive material calculator (input SF + construction type → estimated panels + email capture for full quote — NO PRICE shown to comply with Plycem ship blocker SB-4)
- **E4**: Multi-step inline wizard on home (no separate /request-a-quote page)

### Item F — Plycem brand presence depth (subject to written Plycem approval per ship blockers)
- **F1**: Logo Plycem only in `/suppliers` section, "Brand we distribute" framing (requires Plycem approval before launch)
- **F2**: F1 + footer "Authorized Distributor PLYCEM CONSTRUSISTEMAS" badge (requires Plycem approval for "Authorized" claim)
- **F3**: NO Plycem logo on day 1 — text mentions only ("We distribute PLYCEM Cement Board for…"). Add logo in post-launch update once approval received. Avoids blocking launch on 5-day Plycem approval cycle.
- **F4**: F1 + dedicated co-marketing landing page `/plycem-products` with deep product integration (highest approval bar)

### Item G — SEO keyword strategy on day 1
- **G1**: Generic-first keywords ("fiber cement subfloor distributor California", "non-combustible UL R15140 panel supplier", "ASTM C1186 cement board USA") — no Plycem brand keywords, ships without Plycem approval
- **G2**: Plycem-first keywords ("PLYCEM distributor USA", "PLYCEM subfloor West Coast") — requires prior Plycem approval per ship blocker SB-5
- **G3**: Hybrid — generic in H1/title, Plycem brand mentions only in body copy after Plycem approval received post-launch

### Item H — Bilingual support (EN/ES) at launch
- **H1**: EN-only at launch, add ES in Phase 6+ post-launch
- **H2**: EN + ES from day 1 (subdirectory `/es/`), full content parity required
- **H3**: EN primary + ES landing page only at launch (`/es` single-page summary), full ES rollout in Phase 6+

### Item I — Email convention
- **I1**: `info@jarainternational.com` (canonical-matching, professional, longer)
- **I2**: `info@jaraintl.com` (shorter, easier dictation, matches business-card aesthetic)
- **I3**: Both work, role-based: `sales@jarainternational.com` for formal, `rob@jaraintl.com` for personal/short

## 6. OUTPUT FORMAT (STRICT JSON ONLY)

Output exactly this structure. No prose before or after. No markdown code fences. Pure JSON.

```json
{
  "model": "your-model-id-here",
  "agent": "your-self-described-name",
  "votes": {
    "A": "A1|A2|A3|A4",
    "B": "B1|B2|B3",
    "C": "C1|C2|C3",
    "D": "D1|D2|D3|D4",
    "E": "E1|E2|E3|E4",
    "F": "F1|F2|F3|F4",
    "G": "G1|G2|G3",
    "H": "H1|H2|H3",
    "I": "I1|I2|I3"
  },
  "reasoning": {
    "A": "1-2 sentence rationale",
    "B": "1-2 sentence rationale",
    "C": "1-2 sentence rationale",
    "D": "1-2 sentence rationale",
    "E": "1-2 sentence rationale",
    "F": "1-2 sentence rationale",
    "G": "1-2 sentence rationale",
    "H": "1-2 sentence rationale",
    "I": "1-2 sentence rationale"
  },
  "additional_findings": [
    {
      "title": "Short title of finding",
      "description": "What you noticed that ISN'T on the ballot but should be considered",
      "severity": "blocker|high|medium|low",
      "applies_to_phase": "1|2|3|4|5|6"
    }
  ],
  "verdict": "ship|revise|hold",
  "verdict_reason": "1-3 sentence summary of your overall recommendation"
}
```

## 7. NOTES TO VOTERS

- Be terse in `reasoning` — 1-2 sentences each. The synthesis doc summarizes, not your full essay.
- `additional_findings` is the most valuable channel for raising concerns the prompt missed. If ≥2 voters flag the same finding, it gets applied (convergent finding rule).
- `verdict`: `ship` = my votes are final, no further round needed; `revise` = I want at least one item revisited; `hold` = significant concern, do not proceed without addressing my findings first.
- The 4 voters do NOT see each other's responses. Vote independently.
- This prompt is immutable once sent. Refer to it by filename `round1_prompt.md`.
