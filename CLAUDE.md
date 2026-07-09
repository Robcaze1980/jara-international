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
- **SB-3** No published Plycem-vs-competitor comparison **tables**, and no **naming** a competitor in comparative claims, without prior **written** Plycem approval. Clarification (2026-07-09 founder call): a **generic, non-tabular** positioning mention of "the leading US brand" that does NOT name it and does NOT structure a Plycem-vs table is **outside SB-3 — allowed** (keep claims truthful/substantiated per ad law).
- **SB-4** ✅ **UNBLOCKED 2026-07-06** — Plycem verbally authorized JARA to publish list prices (phone call to founder, 2026-07-06). SB-4's bar is "without authorization" (not "written"), so this clears it. JARA list prices (rounded DDP) MAY be published; JSON-LD `Offer`/`priceSpecification` allowed. NOTE: **SB-3** = no competitor comparison _tables_ or _naming_ without written approval; a generic leading-brand mention IS allowed (see SB-3). See `BITACORA.md`.
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

## Cert-gap discipline (Round 11 R11-D2 + R11-E2; placement updated 2026-05-21)

Products without complete US compliance must surface the gap via `components/CertGapWarning.tsx`. **Placement: below the Compliance & Certifications section** (rebalanced 2026-05-21 per founder direction). The original R11-D placement was above the hero; the new placement preserves the R11-D intent that specifiers cannot skim past the disclosure (it sits above the FAQ, well above the fold on most viewports) while letting the product story land before the regulatory honesty.

**Background: white** (`bg-white`) — switched from amber-50 on 2026-05-21. Border and text colors remain amber-toned so the callout still reads as a deliberate disclosure rather than a generic info box. WCAG contrast: amber-900 (#78350F) on white = ~12.6:1, exceeds AAA-normal (7:1).

Currently active for:

- **siding** — missing ICC-ES ESR (HardiePlank has ESR-2290). Slug was renamed from `lap-siding-tongue-and-groove` on 2026-05-19 when the catalog expanded to the full 4-profile family (Traslapado, Machihembrado, Victoriano, Tablilla); the old slug 301-redirects via `LEGACY_SLUG_REDIRECTS` in `app/products/[slug]/page.tsx`.
- **corrugated-roof-tile** — missing UL 263/790 Class A fire-rated roof classification.
- **exterior-hidden-joint** — missing ICC-ES ESR, ASTM E-136, NFPA 285. Suitable for residential and light commercial facade <40 ft.
- **exterior-cement-board** — manufacturer-positioned for residential use only; lacks ICC-ES ESR, IAPMO ER, NFPA 285, ICC IBC alt-material recognition.
- **deck** — no ICC-ES ESR; requires AHJ alternative-materials approval per project (IBC 104.11). Documentation package available on request.

Do NOT remove these warnings without consensus.

---

## Form / webhook architecture (v0 pattern)

Both submittal and document-request flows mirror the proven
plycemca.com v0 implementation:

- **Webhook URLs are hardcoded** in `app/api/submittal/route.ts` and
  `app/api/document-request/route.ts`. The n8n production webhook URL
  is not a secret — committing it is fine.
- **Honeypot only** for bot protection (`_honey` field, visually
  hidden, server returns silent success if filled).
- **Fail-soft webhook delivery** — user always sees the success card
  after Turnstile-free validation passes. Webhook delivery status is
  surfaced in the API response (`webhook: {delivered, status, error,
  bodyPreview}`) for operator debugging via DevTools Network tab and
  in Cloudflare Workers logs (verbose `[SUBMITTAL]` / `[DOC-REQ]`
  console output).
- **No Turnstile, no Cloudflare env vars, no `lib/cf-env.ts`.** Earlier
  Turnstile-based architecture (Rounds 10/14, commits `9f5a6ec` →
  `e6d2068` → `b3d5683` → `d19550f`) was abandoned in favor of v0
  simplicity after repeated env-var-visibility issues with the
  Cloudflare dashboard "Variables and Secrets" panel + plaintext
  entries not propagating to the OpenNext worker.

If spam becomes a problem, the next escalation is a server-side IP
rate-limiter (e.g., `@upstash/ratelimit` on Cloudflare KV), not
Turnstile.

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

**Last updated:** 2026-05-20 (post-Round 14 revert — adopted v0 form/webhook architecture, removed Turnstile + env-var indirection).
