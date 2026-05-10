# Round 5 — REVIEW Synthesis (Phase 4 Sprint 1 audit)

**Date:** 2026-05-10
**Type:** Post-milestone review consensus (NEW pattern per user mandate)
**Voters captured:** Claude Opus 4.7, Gemini 3.1 Flash Lite, GLM-5.1, DeepSeek V4 Pro (4/4)
**Quorum rule:** ≥3/4 per item (R-CONS-7)
**Prompt:** [`round5_review_prompt.md`](round5_review_prompt.md)
**Vote files:** [`round5_review_claude.md`](round5_review_claude.md), [`round5_review_gemini.json`](round5_review_gemini.json), [`round5_review_glm.json`](round5_review_glm.json), [`round5_review_deepseek.json`](round5_review_deepseek.json)

---

## 1. Vote tally — UNANIMOUS BOTH ITEMS

| Item | Claude (Opus 4.7) | Gemini (3.1 FL) | GLM-5.1 | DeepSeek (V4 Pro) | Tally | Action |
|---|---|---|---|---|---|---|
| **RA** Sprint 1 verdict | RA2 | RA2 | RA2 | RA2 | **RA2 = 4/4** | ✅ **LOCK RA2 — Ship-with-fixes** |
| **RB** Sprint 2 risk grade | RB2 | RB2 | RB2 | RB2 | **RB2 = 4/4** | ✅ **LOCK RB2 — Medium confidence** |

**Verdicts:** 4/4 `revise`. Unanimous "ship-with-fixes-first" — Sprint 1 is good infrastructure but has SEO/AI ADR misses that must close before Sprint 2 compounds debt.

---

## 2. Convergent must-fix items (≥2 voters → MANDATORY before Sprint 2)

### F1.R5 — `/llms-full.txt` missing (Claude + GLM + DeepSeek = 3/4)
- **Severity:** High (compliance against ADR-014 D2 lock)
- **What's wrong:** Sprint 1 scope explicitly listed `llms.txt + llms-full.txt`. Only `/llms.txt` exists. AI crawlers following the manifest may hit a 404 when looking for the full version.
- **Fix:** Generate `/llms-full.txt` at build time from product data + main copy. Markdown form, full content of all canonical pages.
- **Estimate:** ~30 min. Ships in next commit.

### F2.R5 — JSON-LD render verification + missing canonical + OG/Twitter meta (Claude + DeepSeek = 2/4 weighted heavy)
- **Severity:** High (SEO foundation contract)
- **What's wrong:** `lib/jsonld.ts` has builders but no proof JSON-LD actually renders in HTML output. Self-referencing canonical tags (Round 3 GLM finding, applied) not verified. Open Graph + Twitter Card meta (Round 3 GLM finding, applied) not verified.
- **Fix:**
  1. Curl homepage HTML, grep for `application/ld+json`, validate JSON with Google Rich Results Test.
  2. If missing or partial: add to root `layout.tsx` `<head>` via Next.js script tag with `type="application/ld+json"`.
  3. Add canonical via `generateMetadata` returning `{ alternates: { canonical: ... } }`.
  4. Add OG + Twitter via `generateMetadata` returning `{ openGraph: {...}, twitter: {...} }`.
- **Estimate:** ~45 min. Ships in next commit.

### F3.R5 — hreflang es-US points to non-existent /es OR cascading unverified (Claude + GLM + DeepSeek + Gemini = 4/4 — STRONGEST CONVERGENT)
- **Severity:** High (ADR-008 H3 + Round 3 F1.R3 lock)
- **What's wrong:** Round 3 F1.R3 (4/4 convergent) requires hreflang en-US + es-US + x-default on EVERY page. Current root layout emits es-US alternate but `/es` route doesn't exist yet. Per Google guidelines: every hreflang target MUST return a 200 page; pointing to a 404 causes Google to ignore ALL hreflang signals AND flags the implementation as erroneous in Search Console.
- **Fix (recommend GLM's "create minimal placeholder" path):** Create `/es/page.tsx` as a minimal Spanish landing — JARA brand-compliant, declares Phase 6 will expand it, contact CTA → English form. This satisfies the hreflang contract AND fulfills ADR-008 H3 ("EN full + 1 ES landing page") AND validates the i18n routing scaffold per ADR-008 rationale.
- **Estimate:** ~45 min (page + ES copy + verify hreflang round-trip). Ships in next commit.

### F4.R5 — `scripts/pull_gsc.py` stub not created (Claude + GLM + DeepSeek + Gemini = 4/4 — STRONGEST CONVERGENT)
- **Severity:** Medium (per memory `performance_feedback_loop.md`, was Sprint 1 obligation)
- **What's wrong:** Sprint 1 scope per memory file required the GSC pull stub. Was not created.
- **Fix:** Create `scripts/pull_gsc.py` as 30-line stub with: imports, OAuth credential loading skeleton, GSC API call placeholder, output path convention `docs/performance/raw/gsc/{date}.json`, TODO comments marking Phase 6 activation. Functional shell, not full implementation.
- **Estimate:** ~10 min. Ships in next commit.

### F5.R5 — Build pipeline depends on uncoded manual dashboard setting (GLM only, but VALID — applied per user SEO+AI mandate raising hygiene single-voter findings)
- **Severity:** Medium (technical debt + bus factor risk)
- **What's wrong:** After fix `84055fd`, deploy works ONLY because user manually changed Cloudflare dashboard build command from `npm run build` to `npm run cf:build`. This is tribal knowledge, not codified. If dashboard setting is reset / new collaborator joins / project re-imports → build silently breaks.
- **Fix:** Document the dashboard requirement prominently in (a) `README.md` "Deployment" section, (b) `wrangler.toml` comment block, (c) `package.json` "scripts" comment.
- **Estimate:** ~10 min. Ships in next commit.

### Bonus single-voter applied: ADR-001 dependency verification (GLM)
- **What:** GLM flagged uncertainty whether @radix-ui/* and lucide-react are in `package.json`.
- **Action:** I'll verify when applying fixes. If missing, install. If present, no-op.

---

## 3. Single-voter concerns — disposition

| Concern | Voter | Severity | Must-fix? | Disposition |
|---|---|---|---|---|
| Open-next.config.ts minimal — no R2/D1 cache backing | Claude | Medium | No | Defer — make conscious decision in Sprint 2 planning |
| `cf:preview` and `cf:typecheck` scripts missing | Claude | Low | No | Defer — add when convenient |
| wrangler.toml `compatibility_date` warning | Claude | Low | No | Apply during F1-F5 commit (cheap, silences warning) |
| Favicon not yet | Claude | Low | No | Sprint 2 first task (covered by Round 2 finding) |
| FAQPage empty schema spam risk | GLM | Low | No | Apply guard in JSON-LD: only render FAQPage when items present |
| `/api/llm-context` no caching strategy documented | GLM | Low | No | Document in route file comment during F2.R5 commit |

---

## 4. Compliments (reinforce good patterns)

Aggregating from all 4 voters:

1. **Production debugging discipline.** 5 fix commits, each tight and justified, no scope creep. Pattern of "encounter blocker → root-cause → minimal fix → commit with explanatory message" worked. (Compliment from Claude, GLM, DeepSeek)
2. **AI-crawler foundation is genuinely shippable, not just scaffolded.** All 6 endpoints (`/`, `/api/llm-context`, `/llms.txt`, `/sitemap.xml`, `/robots.txt`, `/BingSiteAuth.xml`) returning 200 with meaningful payloads on day 1. (Compliment from GLM, DeepSeek)
3. **Consensus methodology held under launch pressure.** 4-way unanimous on most items, user-strategic tiebreak when split (Round 4 → B → J2 worked). The pattern is operating as designed. (Compliment from Claude)
4. **OpenNext runtime debugging handled cleanly.** Edge runtime → Node-via-workerd transition was identified, isolated, and resolved in one commit. (Compliment from Gemini, DeepSeek)
5. **`/api/llm-context` highly structured payload.** Strong foundation for AI agent consumption. (Compliment from Gemini, DeepSeek)

---

## 5. Token + cost summary

| Voter | Prompt tokens | Completion tokens | Cost (USD) |
|---|---|---|---|
| Gemini 3.1 Flash Lite | 2,623 | 502 | $0.0014 |
| DeepSeek V4 Pro | 2,433 | 3,011 | $0.0036 |
| GLM-5.1 | 2,392 | 3,264 | $0.0175 |
| Claude Opus 4.7 (manual) | (in-session) | (in-session) | ~$0.05 est. |
| **Total Round 5 review** | — | — | **~$0.07** |
| **Project cumulative (Phase 1-3 + Sprint 1 build/fix + Sprint 1 review)** | — | — | **~$0.42** |

---

## 6. Verdict + Action plan

✅ **Round 5 status: COMPLETE — unanimous SHIP-WITH-FIXES.**

**Phase 4 Sprint 1 status: 90% complete.** Infrastructure shipped; 4 SEO/AI ADR misses + 1 technical-debt fix to close before Sprint 2 starts.

**Sprint 1 close-out fixes (single commit):**
1. F1.R5 — Create `/llms-full.txt` build-time generator
2. F2.R5 — Verify + add JSON-LD render + canonical + OG/Twitter meta
3. F3.R5 — Create minimal `/es` Spanish landing page (resolves hreflang contract)
4. F4.R5 — Create `scripts/pull_gsc.py` Phase 6 stub
5. F5.R5 — Document Cloudflare dashboard build command requirement
6. Bonus: bump wrangler `compatibility_date`, add FAQPage guard, document `/api/llm-context` no-cache strategy in comment, verify Radix/lucide-react presence

**Estimated cleanup time:** ~2 hours of focused work. Single commit titled `fix(sprint1-cleanup): apply Round 5 review must-fix items`.

**After cleanup → Round 6 Sprint 2 planning round** (home page composition, calculator UX, featured products card content, value props copy, sticky CTA bar).
