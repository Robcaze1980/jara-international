# Round 4 — Cloudflare Pages Adapter for Next.js 16

**Type:** Tiebreaker mini-round triggered by Phase 4 Sprint 1 smoke test blocker.
**Voters:** DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1, Claude Opus 4.7. Quorum ≥3/4.
**Single voting item.**

---

## 1. CONTEXT — what triggered this round

Phase 4 Sprint 1 began with `npm install` on the freshly scaffolded project. It failed:

```
npm error ERESOLVE unable to resolve dependency tree
npm error Found: next@16.1.6
npm error peer next@">=14.3.0 && <=15.5.2" from @cloudflare/next-on-pages@1.13.16
```

`@cloudflare/next-on-pages` (the historically standard Cloudflare → Next.js adapter) does NOT support Next.js 16. Its peer-dependency cap is `<=15.5.2`.

This was anticipated by Round 1.5 convergent finding **F1.5**: "Next.js 16 + Cloudflare Pages RSC compatibility must be validated in Phase 1 ... fallback path: SSR-only rendering (no RSC) if RSC support is incomplete on Cloudflare Pages."

The smoke test surfaced the real issue: it's not just RSC support — the entire adapter doesn't yet support Next.js 16.

## 2. Already locked (do not re-debate)

- ADR-001: **Next.js 16** + React 19 + Tailwind + Radix on **Cloudflare Pages**
- ADR-019 SH2: LCP <1.5s, INP <100ms, CLS <0.05
- All Phase 1+2+3 SEO/AI requirements (JSON-LD, llms.txt, hreflang, sitemap, /api/llm-context edge runtime, etc.)
- User strategic priority: launch in **days**, not weeks

## 3. VOTING ITEM

### Item J — Cloudflare Pages adapter strategy

- **J1**: **Downgrade Next.js to 15.5.2.** Use the official, battle-tested `@cloudflare/next-on-pages@1.13.x` adapter. Zero adapter risk. Modifies ADR-001 ("Next.js 16" → "Next.js 15.5.2"). Loses minor Next 16 features (some compiler improvements, some dev-server tweaks). All locked architecture (App Router, RSC, Tailwind 3.4, Radix, lucide-react, edge API routes) remains identical and works on Next.js 15.5.2.

- **J2**: **Switch to OpenNext for Cloudflare** (`@opennextjs/cloudflare@^1.x`). Keeps Next.js 16 intact (preserves ADR-001 verbatim). OpenNext is the next-generation adapter, actively maintained, supports App Router + RSC + edge runtime. Risk: less production-tested than `@cloudflare/next-on-pages` in the Next.js 16 + Cloudflare Pages combination. Possible undiscovered edge cases. Build configuration is slightly different (uses `wrangler.toml` more directly).

- **J3**: **Switch deploy target to Cloudflare Workers (not Pages) using OpenNext.** Workers + OpenNext is the most-recommended path forward per Cloudflare's own 2025+ docs. Materially changes ADR-001's "Cloudflare Pages" lock. Workers gives more flexibility (KV, D1, R2, Queues) for future features but adds slightly more ops complexity.

## 4. STRATEGIC CONTEXT

- User mandate: launch in DAYS. Adapter swap or downgrade adds minutes; new platform target adds hours.
- User mandate: SEO+AI maximization. All three options preserve the entire SEO/AI playbook (JSON-LD, llms.txt, hreflang, sitemap, /api/llm-context). No SEO/AI capability is compromised by any option.
- ADR-001 was locked unanimously 4/4 in Round 1.5 — modifying it should be reluctant.
- The Phase 1 convergent finding F1.5 explicitly authorized "fallback" if Cloudflare Pages RSC support proved incomplete — so we're in pre-anticipated territory.

## 5. OUTPUT FORMAT (STRICT JSON ONLY)

```json
{
  "model": "your-model-id",
  "agent": "your-name",
  "votes": {
    "J": "J1|J2|J3"
  },
  "reasoning": {
    "J": "1-2 sentences"
  },
  "additional_findings": [
    {
      "title": "...",
      "description": "...",
      "severity": "blocker|high|medium|low",
      "applies_to_phase": "4|5|6"
    }
  ],
  "verdict": "ship|revise|hold",
  "verdict_reason": "1 sentence"
}
```

## 6. Notes to voters

- This is a single-item mini-round. Be decisive.
- Time-to-launch dominates. Production stability second. Architectural elegance third.
- Vote independently — no cross-voter visibility.
