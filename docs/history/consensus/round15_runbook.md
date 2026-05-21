# Round 15 — Runbook

**Round date:** 2026-05-21
**Scope:** Product catalog regulatory pass — per-SKU keep/drop/reposition decisions, Cement Board deploy gate, Plycem follow-up email content.
**Voters:** Codex, DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1 (no Claude per CLAUDE.md governance).
**Quorum:** ≥3/4 per question.

## Prerequisites

- `OPENROUTER_API_KEY` exported (or readable from `.env.local` — the script walks up from cwd).
- `scripts/consensus_call.py` available.
- `docs/history/consensus/round15_prompt.md` present (already written).

## Invoke voters

```bash
PROMPT="docs/history/consensus/round15_prompt.md"
OUT="docs/history/consensus"

python scripts/consensus_call.py --prompt "$PROMPT" --model openai/gpt-5.1-codex          --out "$OUT/round15_codex.json" &
python scripts/consensus_call.py --prompt "$PROMPT" --model deepseek/deepseek-v4-pro     --out "$OUT/round15_deepseek.json" &
python scripts/consensus_call.py --prompt "$PROMPT" --model google/gemini-3.1-flash-lite --out "$OUT/round15_gemini.json" &
python scripts/consensus_call.py --prompt "$PROMPT" --model z-ai/glm-5.1                 --out "$OUT/round15_glm.json" &
wait
```

## Validate each response

```bash
for f in round15_codex.json round15_deepseek.json round15_gemini.json round15_glm.json; do
  echo "=== $f ==="
  jq -e '.voter, .round, .verdicts.Q1.choice, .verdicts.Q2.choice, .verdicts.Q3.choice, .verdicts.Q4.choice, .verdicts.Q5.i.choice, .verdicts.Q6.choice, .verdicts.Q7.choice, .verdicts.Q8.choice, .overall_catalog_recommendation' "docs/history/consensus/$f" \
    || echo "MALFORMED: $f"
done
```

Expected:
- `.round == 15`
- All Q1–Q8 `choice` fields present and matching the option-letter constraints in the prompt
- `Q5` has all 5 sub-items (i / ii / iii / iv / v) with INCLUDE|SKIP
- `overall_catalog_recommendation` is one of SHIP / REVISE / WAIT_FOR_PLYCEM

If any voter returns markdown-wrapped JSON, re-run once with a reminder appended (`"Return JSON only, no markdown fences."`). If two failures, document and proceed with the remaining ≥2/3 voters.

## Synthesize

Produce `round15_synthesis.md` with the following structure:

1. **Per-question tally** — Q1 through Q8. For each, count votes per option letter. Report margin: `4/4 unanimous`, `3/4 strong majority`, `2/4 failed quorum` (kick to Round 15.5). For Q5, tally each sub-item separately.
2. **Overall recommendation tally** — SHIP / REVISE / WAIT_FOR_PLYCEM count across voters.
3. **Q9 reframing summary** — list each voter's reframing suggestions; flag if ≥2 voters propose the same reframing (signals the prompt should be revised in a 15.5).
4. **Q10 open items** — union of voter items, deduplicated. Each one becomes a candidate for Round 16 scope.
5. **Action list per Q with quorum:**
   - Q1 (deploy gate): apply the majority option to the cement-board promotion before any deploy
   - Q2 (Fibroxton): execute drop / warning / no-action per majority
   - Q3 (Deck plank): execute reposition / consolidation / drop per majority
   - Q4 (Deck Modular): execute promotion / keep-in-grid per majority
   - Q5 (Plycem follow-up): compile the INCLUDE items into a follow-up email draft alongside the one already sent
   - Q6 (FAQ cleanup): execute one-line edit per majority
   - Q7 (Siding warning): edit or hold per majority
   - Q8 (catalog count): records the resulting catalog size for llms.txt / sitemap / homepage copy adjustments
6. **Failed-quorum items**: list each Q where no option reached ≥3/4, plus the prompt that should be re-asked in Round 15.5.

## Estimated cost

R14 ran at ~$0.02–0.03 with this voter pool. R15 prompt is ~5k tokens (longer than R14 due to per-product evidence). Expect **~$0.04–0.06 total** across the 4 voters.

## After synthesis

- Commit synthesis + voter JSON files to the repo: `docs/history/consensus/round15_*.{json,md}`.
- For each quorum-reached question, implement the action as a separate commit, message format `R15-Q<n>: <title>`. Example: `R15-Q2: Drop Fibroxton from catalog (4-0 unanimous)`.
- For Q5 INCLUDE items: append them to a new `docs/plycem-cert-verification-followup.md` file (keep the original `plycem-cert-verification-email.md` immutable as a sent-mail record).
- If Q1 majority is `B. DEFENSIVE_REVERT`: execute the cement-board promotion rollback in a single commit before any other deploys.
- If Q1 majority is `A. HOLD`: do not push to `main` until Plycem reply lands. Update CLAUDE.md "Currently-open items" to reflect the hold and add a self-imposed deadline (e.g., 2026-06-15 reconsider).
- If Q1 majority is `D. DEPLOY_WITH_WARNING`: add a CertGapWarning entry for `exterior-cement-board` in `CERT_GAP_WARNINGS`, then deploy.

## Notes for the synthesizer

- The cement-board deploy gate (Q1) is the most consequential question. If it splits 2/2, default to `B. DEFENSIVE_REVERT` as the lowest-risk option per the CLAUDE.md "no unverified claims" feedback rule.
- The Q2 (Fibroxton) and Q3 (Deck) outcomes determine the Q8 catalog count automatically. Verify the count majority is consistent with the Q2/Q3 majorities; flag inconsistency.
- Q5 sub-items are not equally weighted. (i) Allura ESR-3500 is the highest-leverage ask (could unlock the entire Siding market). (iv) US distribution rights is a relationship question, not technical. Bias rationale-weight accordingly when narrating.
