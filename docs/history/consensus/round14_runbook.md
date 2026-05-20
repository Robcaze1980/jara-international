# Round 14 — Runbook

**Round date:** 2026-05-20
**Scope:** Targeted technical audit of the Cloudflare Workers env var access fix shipped in commits 9f5a6ec → d19550f → e6d2068.
**Voters:** Codex, DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1 (no Claude per CLAUDE.md governance).
**Quorum:** ≥3/4 per question.

## Prerequisites

- `OPENROUTER_API_KEY` exported (or readable from `.env.local` — the script walks up from cwd).
- `scripts/consensus_call.py` available.
- `docs/history/consensus/round14_prompt.md` present (already written).

## Invoke voters

```bash
PROMPT="docs/history/consensus/round14_prompt.md"
OUT="docs/history/consensus"

python scripts/consensus_call.py --prompt "$PROMPT" --model openai/gpt-5.1-codex          --out "$OUT/round14_codex.json" &
python scripts/consensus_call.py --prompt "$PROMPT" --model deepseek/deepseek-v4-pro     --out "$OUT/round14_deepseek.json" &
python scripts/consensus_call.py --prompt "$PROMPT" --model google/gemini-3.1-flash-lite --out "$OUT/round14_gemini.json" &
python scripts/consensus_call.py --prompt "$PROMPT" --model z-ai/glm-5.1                 --out "$OUT/round14_glm.json" &
wait
```

## Validate each response

```bash
for f in round14_codex.json round14_deepseek.json round14_gemini.json round14_glm.json; do
  echo "=== $f ==="
  jq -e '.voter, .round, .verdicts.Q1, .verdicts.Q2, .overall_verdict_on_e6d2068' "docs/history/consensus/$f" \
    || echo "MALFORMED: $f"
done
```

Expected: `.round == 14`, all Q1–Q10 verdicts present, `overall_verdict_on_e6d2068` is one of SHIP/REVISE/REVERT.

If any voter returns markdown-wrapped JSON, re-run once with a reminder appended. If two failures, document and proceed with ≥2/3 on remaining voters.

## Synthesize

Produce `round14_synthesis.md`:

1. **Per-question tally** — Q1 through Q10. For each, count CORRECT vs INCORRECT vs INSUFFICIENT_EVIDENCE (or DELETE/KEEP/etc per question type). Report margin: 4/4, 3/4, 2/4 split, 1/4 single.
2. **Overall verdict tally** — SHIP/REVISE/REVERT count across voters.
3. **Action list:**
   - If ≥3/4 say SHIP with Q2 = CORRECT → e6d2068 stands, no further action.
   - If ≥3/4 say REVISE → implement the convergent recommended_action from voters.
   - If ≥3/4 say REVERT → roll back e6d2068 and reopen the problem.
4. **Open questions** — union of voter "items" from Q10, deduplicated.

## Estimated cost

R13 ran at ~$0.05 with this voter pool. R14 prompt is shorter and more focused (~4k tokens vs. R13's ~7k) so expect ~$0.02–0.03 total.

## After synthesis

- Commit synthesis + voter JSON files to `docs/history/consensus/` on `main`.
- Apply action items as separate commits per question, message format `R14-Q<n>: <title>`.
- If e6d2068 stands, that's the green light — user proceeds with end-to-end submittal test.
- If REVISE/REVERT, implement before user retests.
