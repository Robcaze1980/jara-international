# Round 10 — Claude Opus 4.7 vote

**Model:** `claude-opus-4-7` (1M context)
**Agent:** Claude Opus 4.7 (architecture / brand / synthesis author)
**Date:** 2026-05-14
**Voted independently before reading any other voter's response.** Drafted this prompt per the §1 Proposal step; vote is cast separately per the voting-independence rule.

---

## Votes

| Item | Vote | Reasoning |
|---|---|---|
| **A** SectionNav | **A1** | Port v0's IntersectionObserver+RAF pattern verbatim with JARA restyle. It's a 144-LOC production-grade pattern already battle-tested on 4 v0 long-content pages. A2 (Radix Tabs) loses the scroll-spy auto-update which is the entire point — Tabs are click-driven, not scroll-driven. A3 (anchors only) is a regression vs both v0 and the pillar page's AI-citation needs. |
| **B** SubmittalForm | **B1** | The v0 3-step form was airtight (honeypot, per-step validation, panel estimate, n8n webhook, success card) — dossier flagged it as KEEP-AND-PORT K-2 for a reason. The 2-hour cost delta vs B2 (single-screen) buys higher B2B conversion and a validated UX. B3 (calculator-first with expansion) introduces two-stage commitment risk that I don't want to absorb under launch pressure. |
| **C** Pillar scope | **C2** | C1 (cards only) ships the reference-authority core in 8h. C2's +2h for a no-currency schedule-risk narrative is uniquely JARA-positioning content (vs brand-neutral UL/IBC/CSI cards). C3 (videos) is SB-7-approval-gated and slows launch. C4 (full) buys little over C2 without the approval chain. C2 closes the v0 reference gap AND lands the lead-time-not-price brand story. |
| **E** Doc library | **E2** | E2's slim 4-doc list (UL R15140, ASTM E-84, IAPMO ER-360, generic tech sheet) saves 1h vs E1 AND drops the redundant UL CERZ/BQXR variants + Plycem-branded brochure — that brochure is an SB-2/SB-7 risk surface I don't want to litigate this round. E2 is exactly the high-leverage architect-relevant set; E3 (skip) gives up a 4-touchpoint lead-magnet for no real time saving. |
| **F** /service-areas | **F4** | ADR-017 locks the dedicated page but does NOT lock per-city granularity. F1 alone ships the SEO baseline in 3h. The per-city expansion (F2) is best done in Phase 6 once we have real customer examples and analytics signals to ground each city page's content — premature per-city expansion now risks 4 thin pages with placeholder content (which is worse for SEO than 1 strong page). F4 is the pragmatic phased path. |
| **J** CSI spec | **J1** | The v0 single-paragraph format does the architect's quick-need job — it goes in their spec book unchanged with a manufacturer-agnostic rewording. J2 (full 3-part CSI spec, 4h authoring) is post-launch expansion territory; the ROI per hour drops sharply past the 1-paragraph version. J3 (email-only) loses the on-page SEO + AI-citation hook for the CSI keyword space. |
| **P** /pricing | **P2** | 1 hour of work for both SEO juice retention (inbound `/pricing` links + AI-crawler typing the URL) AND a conversion path (CTA to /contact). P1 (404) wastes those incoming intents. P3 (301) is fine but loses any future /pricing-as-keyword positioning if SB-4 is ever lifted post-launch. P2 keeps options open with minimal commitment. |
| **R** /installation | **R3** | Merge installation into the Subfloor pillar. Subfloor is the ADR-016 launch pillar; installation content lives naturally inside it. R1 (per-product, 6 products × small sections, 8h) over-invests authoring for products that share most installation patterns. R2 (single shared route) is reasonable but creates a second long-form page when we should focus pillar gravity on one URL. R3 keeps Sprint 5 lean; non-subfloor installation can be Phase 6. |
| **T** Form security | **T2** | Cloudflare Turnstile only. We're already on Cloudflare Workers; Turnstile is native, free, transparent for ~95% of users, and harder for 2026-vintage AI agents to bypass than honeypots. T1 (honeypot alone) is roughly 2025-vintage protection — AI scrapers trained on form schemas already identify visually-hidden inputs. T3 (both) adds 30 min for marginal additional deterrence and a slightly higher false-rejection rate. T2 is the modern best practice. |
| **V** IAPMO ER-360 | **V3** | IAPMO ER-360 is the highest-value architect-facing SEO asset per Phase 0.5 audit and expires 2026-07-31 (C2 renewal alarm). V1 (home only) misses the deep-context placement architects need. V2 (pillar only) misses the above-fold home discovery moment. V3 lands both for a 1.5h total cost — strongest signal for the audience that drives the most qualified inbound. |
| **Y** DESIGN.md | **Y2** | Pre-commit linting is the recommended floor — it catches WCAG contrast violations and structural errors before they reach a PR (we already had two contrast issues bite us: F3.R7 calculator and F2.R8 VariantTable). The MASTER_AUDIT §8 convention covers the same-commit sync rule; Y3's autoexport is invasive (tailwind.config.ts becomes generated) and Y4 is review-noise overhead on a 1-contributor project. Y2 is the rigor-per-hour optimum. |

---

## additional_findings

- **title:** "Codex first-round operational risk: response-schema drift"
  - **description:** Codex (GPT-5.1) is the new voter. Its JSON output discipline under the strict schema may differ from the established 4-voter baseline. If `round10_codex.json` returns a non-conforming response, the synthesis step needs a fallback: either re-prompt with a stricter format directive, or have Claude parse the freeform reasoning into the schema. Suggest the synthesis script validate each voter file before tallying.
  - **severity:** medium
  - **applies_to_phase:** 4

- **title:** "Cross-item dependency — R3 + C4 interaction"
  - **description:** If C4 (full pillar including videos) AND R3 (merge installation into pillar) both win quorum, the pillar page becomes very long (UL/IBC/CSI cards + cost narrative + 5 video embeds + installation content). Risk: LCP regression past the ADR-019 1.5s target AND skim-fatigue. Suggest the synthesis flag this combination explicitly and either (a) split installation into its own route despite R3, or (b) lazy-load videos below the fold. My own votes (C2 + R3) sidestep this, but voter combinations could land here.
  - **severity:** medium
  - **applies_to_phase:** 5

- **title:** "Sprint 4 critical-path: C1 (n8n webhook prod migration) must precede T2 token verification"
  - **description:** If T2 (Turnstile) wins, the form's submit flow becomes: client → Turnstile token gen → Next.js route → Turnstile verify API → n8n webhook. The Turnstile verify call adds ~100-200ms latency before the webhook. C1 already requires moving n8n to production endpoint; that work should be the first commit of Sprint 4 so the Turnstile integration tests against the prod webhook and not the test endpoint that may be removed.
  - **severity:** low
  - **applies_to_phase:** 4

- **title:** "DESIGN.md Sprint 4 component placeholders need first-pass token definitions in same PR as Y2 setup"
  - **description:** DESIGN.md currently has 4 placeholder component blocks (SubmittalForm, DocumentLibrary, SectionNav, PillarPageLayout) marked status='not yet implemented'. Once items B / E / A / C votes lock and the components ship, those placeholder blocks need real token definitions. If Y2+ wins, the linter will catch unreferenced tokens — but missing definitions for shipped components is a worse class of drift. Add a Sprint 4 cleanup checklist item: "DESIGN.md component blocks updated from placeholders to real tokens for all components shipped in Sprint 4."
  - **severity:** low
  - **applies_to_phase:** 4

---

## verdict

**verdict:** ship

**verdict_reason:** All 11 ballot items have at least one option that is shippable in Sprint 4–5 within the launch-in-days constraint. No option in any item creates a brand-compliance or ship-blocker risk that would force a hold. The convergent constraints C11-C14 cover the high-severity cross-cutting work without requiring vote ratification. The single risk that could push to revise (DESIGN.md drift over time) is itself addressed by item Y. Confidence: high on items A/E/P/T/Y (low-debate, time-sensitive); medium on items B/C/V (real architectural trade-offs); lower on items F/J/R (Sprint 5 work that interacts with each other).
