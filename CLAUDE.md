# CLAUDE.md — JARA International Website project rules

This file is **automatically loaded by every Claude Code session** opening this repo. Rules here apply globally and persist across machines via Google Drive sync. Do NOT rely on per-machine Claude memory for project-wide rules — the founder works this project from both a home PC and a work PC, and machine-local memory does not sync.

---

## Founder context

- **Robert Carrillo** — founder, bilingual EN / ES.
- Works the project from Google Drive synced between home PC and work PC. The repo at `jara-website/` is the syncing root. Anything that needs to apply on both machines belongs in this repo, not in `~/.claude/` memory.
- The live site is **https://jarainternational.com**, deployed via Cloudflare Workers + OpenNext from the GitHub repo (`Robcaze1980/jara-international`, branch `main`). Cloudflare auto-builds on every push; deploy completes in 3–5 minutes.

---

## Consensus process (ADR-032 + 2026-05-16 update)

Multi-LLM consensus is run via `scripts/consensus_call.py` which calls models through OpenRouter. The voter pool, quorum rules, and operational details are below.

### Voters (4 — Claude is NOT a voter from Round 12 onwards)

- **Codex** (`openai/gpt-5.1-codex`)
- **DeepSeek V4 Pro** (`deepseek/deepseek-v4-pro`)
- **Gemini 3.1 Flash Lite** (`google/gemini-3.1-flash-lite`)
- **GLM-5.1** (`z-ai/glm-5.1`)

**Why Claude is dropped from R12 onward:**
1. **Cost** — in Round 11 the Claude OpenRouter call was $0.126 of $0.178 total (70% of round cost). Dropping Claude takes round cost from ~$0.18 to ~$0.05.
2. **Conflict of interest** — Claude usually authors the work being voted on. Even when called via a fresh OpenRouter session (no prior context), the model's training-time bias toward Anthropic-authored patterns makes Claude a less-independent reviewer than the 4 external models.

This is **not** a re-vote of ADR-032's voter list — it is the founder's standing instruction. A Round 12+ prompt that includes Claude as a voter is malformed and should be regenerated.

### Quorum

- **≥3/4 simple majority per item.**
- Synthesis must report vote margin (`4-0 unanimous` vs. `3-1 strong majority` vs. `2-2 failed quorum`).
- Failed-quorum items kick to a `Round N.5` follow-up prompt with re-scoped options.

### Capture pattern

Each round produces, in `docs/history/consensus/`:
- `roundN_prompt.md` — the voter prompt
- `roundN_runbook.md` — operator instructions (this is what tells the human or the agent how to invoke the voters)
- `roundN_codex.json`, `roundN_deepseek.json`, `roundN_gemini.json`, `roundN_glm.json` — the 4 voter responses
- `roundN_synthesis.md` — the tallied result + action items

### Runbook command pattern

```bash
PROMPT="docs/history/consensus/round<N>_prompt.md"
OUT="docs/history/consensus"

python scripts/consensus_call.py --prompt "$PROMPT" --model openai/gpt-5.1-codex          --out "$OUT/round<N>_codex.json"
python scripts/consensus_call.py --prompt "$PROMPT" --model deepseek/deepseek-v4-pro     --out "$OUT/round<N>_deepseek.json"
python scripts/consensus_call.py --prompt "$PROMPT" --model google/gemini-3.1-flash-lite --out "$OUT/round<N>_gemini.json"
python scripts/consensus_call.py --prompt "$PROMPT" --model z-ai/glm-5.1                 --out "$OUT/round<N>_glm.json"
```

`OPENROUTER_API_KEY` must be set (or readable from a `.env.local` walking up from cwd; the script handles that).

---

## Plycem ship blockers (CONTRACTUAL — non-negotiable, no consensus override)

From `docs/MASTER_AUDIT.md` §5. Brief enforcement-level reminders:

- **SB-1** No "PLYCEM" in primary domain — `jarainternational.com` only.
- **SB-2** JARA brand identity, not Plycem's.
- **SB-3** No Plycem-vs-USG comparisons.
- **SB-4** No Plycem list prices on any surface. Quote-only model. No price in JSON-LD (`offers` block omits `price`, `priceCurrency`, `priceSpecification`).
- **SB-5** No "PLYCEM" in `<title>` tags.
- **SB-6** No "Authorized Distributor" wording without Plycem's written approval. Use "US-based distributor of PLYCEM products".
- **SB-7** No Plycem logo without written approval. Text wordmarks only.
- **SB-8** Footer copyright = "© 2026 JARA International Inc." Not Plycem.
- **SB-9** Email domain = `@jarainternational.com`.

Additional rule from datasheet review: every Plycem datasheet states *"queda expresamente prohibida la reproducción total o parcial sin el permiso expreso del titular"*. Do NOT redistribute Plycem PDFs (datasheets, install manuals, commercial catalogs) on `jarainternational.com` without Plycem's written permission. The per-product downloads library remains blocked on that approval.

---

## ADR-049 lock (warehouse positioning, 2026-05-16)

JARA does **not** operate a US warehouse. Direct factory shipping from Plycem manufacturing in Costa Rica / El Salvador / Honduras is the correct positioning, with typical 3–4 week door-to-door delivery (factory → ocean freight → US port → customs → trucking).

- Do NOT reintroduce "Long Beach warehouse", "0–3 day delivery", "in stock", or "California stock" claims to the main site, marketing surfaces, AI/LLM context, or schema.
- `serviceAreas` lists continental US regions, not California cities.
- `LocalBusiness` JSON-LD has been removed; do not restore.
- Product schema `availability` is `https://schema.org/MadeToOrder` (per R11-G2), not `InStock`. Do not restore `InStock` without consensus.
- `/long-beach-stock` is a **hidden** `noindex,nofollow` paid-ads landing page for the partner's ~900-sheet pass-through inventory. Removal target: when that stock clears.

---

## Subfloor-as-hero strategy (2026-05-16, founder-locked)

The lead product is **High Performance Subfloor** (Plycem Entrepiso Alto Desempeño in Spanish — slug `high-performance-subfloor`). It is the only product in the catalog with the complete US compliance dossier (UL R15140 + ASTM E-136 non-combustible + IAPMO ER-360 + IBC 2021 Type I/II + CBC Chapter 7A).

The homepage hero, value props, and Featured Products surface are anchored on subfloor. The other 8 products are framed as "Complete the envelope" supporting cast. Do NOT revert to a generic multi-product hero without explicit founder direction.

---

## English-locale naming (Round 11 R11-B1)

In English copy use **"High Performance Subfloor"**, not "Entrepiso Alto Desempeño". The English data model in `data/products.ts` uses the English name; marketing copy should match. The `/es` Spanish page is the only surface that preserves the Spanish proprietary name (culturally appropriate there).

---

## Cert-gap discipline (Round 11 R11-D2 + R11-E2)

Products without complete US compliance must surface the gap via `components/CertGapWarning.tsx` rendered above the product detail page hero. Currently active for:

- **siding** — missing ICC-ES ESR (HardiePlank has ESR-2290). Slug was renamed from `lap-siding-tongue-and-groove` on 2026-05-19 when the catalog expanded to the full 4-profile family (Traslapado, Machihembrado, Victoriano, Tablilla); the old slug 301-redirects via `LEGACY_SLUG_REDIRECTS` in `app/products/[slug]/page.tsx`.
- **corrugated-roof-tile** — missing UL 263/790 Class A fire-rated roof classification.

Do NOT remove these warnings without consensus. The amber visual pattern matches `/long-beach-stock` for brand-consistency cueing. WCAG 2.1 AA verified (~10.6:1 contrast).

---

## Pre-commit hook

The `@google/design.md` alpha linter has a known upstream bug (`raw.match is not a function`) that fires on every commit. The husky pre-commit hook (`.husky/pre-commit`) is **non-blocking** — it runs the linter, surfaces output to stderr, and exits 0 regardless. Re-tighten by removing the `|| echo ...` fallback once Google Labs ships an upstream fix. Until then, do NOT bypass the hook with `--no-verify` — let it fail gracefully.

---

## OG image generation

`app/products/[slug]/opengraph-image.tsx` uses `generateStaticParams` from `data/products.ts` — adding a new product to the catalog auto-generates its OG card at build time. No manual asset work required.

---

## Live verification

Quick post-deploy spot-check pattern (use after any commit that touches positioning, schema, or product copy):

```bash
curl -s -A "Mozilla/5.0" https://jarainternational.com/ | grep -o "<title>[^<]*</title>"
curl -sI -A "Mozilla/5.0" https://jarainternational.com/ | grep -i cache-control
for slug in high-performance-subfloor deck-modular corrugated-roof-tile siding; do
  echo -n "$slug: "; curl -s -o /dev/null -w "%{http_code}\n" -A "Mozilla/5.0" "https://jarainternational.com/products/$slug"
done
```

---

## Currently-open items (carry between sessions)

- **High priority — IAPMO ER-360 expires 2026-07-31.** The `exterior-cement-board` product page claims this cert. The June 2024 Plycem Microconcreto Exterior datasheet does NOT list it. Founder must contact Plycem to verify or get renewed letter. Action before 2026-07-15 to give buffer.
- **Medium priority — WCAG live verification of amber pattern.** Calculated contrast (Tailwind amber-50 #FFFBEB / amber-900 #78350F = ~10.6:1) exceeds AA, but no human-eye verification in browser yet.
- **Medium priority — `/long-beach-stock` canonical inherits root URL.** Functionally harmless because the page is `noindex`, but technically sloppy. Worth a 5-min fix to set explicit `alternates: { canonical: null }` or per-page canonical.
- **Medium priority — Plycem PDF redistribution permission.** Founder-to-Plycem conversation required before the per-product downloads library can ship.
- **Low priority — OpenNext 1-year HTML cache.** Cache-Control: s-maxage=31536000 on prerendered pages comes from OpenNext defaults. Cloudflare auto-purges on deploy, so practical impact is low, but worth investigation if a future deploy serves stale content.

See `docs/history/consensus/round11_synthesis.md` §"Additional findings — triage" for the full list with voter attribution.

---

## Don't break the build

- Run `npx tsc --noEmit` after every non-trivial change.
- The build pipeline is `next build` → `opennextjs-cloudflare build` → Cloudflare Workers deploy. Any TS error halts the entire chain.
- Static assets are served from `.open-next/assets/` via Cloudflare's Static Assets binding. Dynamic routes (`/api/llm-context`, `/llms-full.txt/route.ts`) run in the OpenNext worker.

---

**Last updated:** 2026-05-16 (post Round 11 application commit `fcea3c6`).
