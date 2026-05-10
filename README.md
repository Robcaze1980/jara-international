# JARA International Inc. — Website

Production source of [jarainternational.com](https://jarainternational.com).

B2B distributor of premium fiber-cement panels for the United States construction market. Multi-product PLYCEM catalog (subfloor, roof sheathing, deck, exterior cladding, cement board, fibroxton). UL R15140 classified. Warehouse in Long Beach, CA.

> "Global Sourcing. Built on Trust."

---

## Status

**Phase 4 Sprint 1** — scaffold + smoke test. See [`docs/MASTER_AUDIT.md`](docs/MASTER_AUDIT.md) for full project state.

19 ADRs locked via 4-LLM consensus methodology (Claude Opus 4.7 + DeepSeek V4 Pro + Gemini 3.1 Flash Lite + GLM-5.1). All synthesis docs in [`docs/history/consensus/`](docs/history/consensus/).

---

## Stack (per ADR-001 Round 1.5 4/4 unanimous)

- **Next.js 16** (App Router, RSC) — `package.json`
- **React 19**
- **Tailwind CSS 3.4** + Radix UI primitives + lucide-react icons
- **TypeScript 5.7** strict
- **Cloudflare Pages** deploy via `@cloudflare/next-on-pages`

## Local development

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build & preview (matches Cloudflare Pages runtime)

```bash
npm run preview
```

## Deploy

Auto-deploy via Cloudflare Pages connected to `main` branch.

Manual deploy:
```bash
npm run cf:deploy
```

---

## Project layout

```
jara-website/
├── app/                    Next.js App Router routes
│   ├── api/
│   │   └── llm-context/    Public structured product data (per ADR-004 D2)
│   ├── globals.css         Tailwind + JARA brand tokens
│   ├── layout.tsx          Root layout (fonts, JSON-LD, hreflang, meta)
│   └── page.tsx            Homepage
├── components/             Reusable UI (Sprint 2+)
├── data/
│   └── products.ts         Single source of truth — 6 PLYCEM products from PDFs
├── lib/
│   ├── site.ts             Site-wide constants
│   └── jsonld.ts           Schema.org builders (Org, LocalBusiness, Breadcrumb, Product, FAQ)
├── public/
│   ├── images/
│   │   ├── hero/           User-supplied hero photos (drop here per _README.md)
│   │   ├── products/       User-supplied product photos
│   │   └── og/             Open Graph social cards
│   ├── llms.txt            AI citation guidance (per ADR-015 SB3)
│   ├── robots.txt          Allow ALL AI crawlers
│   └── sitemap.xml         (Sprint 2: regenerate at build time)
├── docs/
│   ├── MASTER_AUDIT.md     Project state + ADR index
│   ├── audit/              Phase 0.5 legacy site audit findings
│   ├── decisions/          Architecture Decision Records (ADRs)
│   └── history/
│       └── consensus/      All consensus rounds (prompts + votes + syntheses)
└── scripts/
    └── consensus_call.py   Calls OpenRouter to gather voter responses
```

---

## Locked decisions (19 ADRs)

| ADR | Decision |
|---|---|
| ADR-001 | Stack: Next.js 16 + React 19 + Tailwind + Radix on Cloudflare Pages |
| ADR-002 | Domain: `jarainternational.com` canonical, `jaraintl.com` 301 redirect |
| ADR-003 | Multi-product Plycem catalog (6 products), schema scaffolds for future multi-brand |
| ADR-004 | AI strategy: llms.txt + llms-full.txt + JSON-LD + `/api/llm-context` |
| ADR-005 | Lead capture: calculator (no price) + form + sticky bar (phone + WhatsApp) |
| ADR-006 | Plycem brand: text-only at launch, logo post-approval |
| ADR-007 | SEO: generic at launch + Phase 4 sprint adding Plycem brand keywords post-approval |
| ADR-008 | Bilingual: EN full + 1 ES landing |
| ADR-009 | Email: long canonical domain pattern |
| ADR-010 | Hero: full-bleed photo + dark navy overlay (gradient for AA contrast) |
| ADR-011 | Stitch: NOT used at launch — hand-craft from JARA brand tokens |
| ADR-012 | Three-panel symbol UI: logo only |
| ADR-013 | Product cards: VB1 photo-first with brand-compliant placeholder fallback |
| ADR-014 | Schema.org SA2: Org + LocalBusiness + Product + FAQ + Breadcrumb + Article + ImageObject + Review |
| ADR-015 | AI crawlers: SB3 — allow ALL + comprehensive llms.txt |
| ADR-016 | Pillar pages: SC2 — 1 pillar at launch (Subfloor Guide) |
| ADR-017 | Local SEO: SD2 — LocalBusiness schema + dedicated /service-areas page |
| ADR-018 | FAQ: SF2 — Per-product + global FAQs, all with FAQPage schema |
| ADR-019 | Performance: SH2 — LCP <1.5s, INP <100ms, CLS <0.05 |

---

## Plycem distributor compliance ship blockers (NEVER bypass)

- Domain MUST NOT contain "PLYCEM"
- Site brand = JARA International Inc., NOT "PlycemCA" / "Plycem ..."
- NO Plycem-vs-competitor comparisons published without prior written Plycem approval
- NO Plycem list prices published without authorization
- "Authorized Distributor" claim language requires prior Plycem approval
- Plycem logo only in dedicated `/suppliers` section, with prior approval
- Footer copyright = "© 2026 JARA International Inc." NEVER claim to be Plycem
- Email addresses use `@jarainternational.com` or `@jaraintl.com` ONLY

See [`docs/MASTER_AUDIT.md`](docs/MASTER_AUDIT.md) §5 for full ship blocker list.

---

## Contributing / consensus methodology

ALL technical decisions go through 4-LLM consensus. ≥3/4 quorum required to lock.
See [`docs/MASTER_AUDIT.md`](docs/MASTER_AUDIT.md) §1 for the full process.

---

© 2026 JARA International Inc. All rights reserved.
PLYCEM® is a registered trademark of The Plycem Company / Elementia Materials.
