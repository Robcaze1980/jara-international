# Round 13 — Runbook

**Round date:** 2026-05-18
**Scope:** GEO / AI-overview citation readiness (narrow follow-up to R12).
**Voters:** Codex, DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1 (no Claude per CLAUDE.md governance).
**Quorum:** ≥3/4.

## Prerequisites

- `OPENROUTER_API_KEY` exported (or readable from `.env.local` walking up from cwd).
- `scripts/consensus_call.py` available.
- `docs/history/consensus/round13_prompt.md` present (already written).

## Invoke voters

Run the four voter calls in parallel (independent — no cross-dependency):

```bash
PROMPT="docs/history/consensus/round13_prompt.md"
OUT="docs/history/consensus"

python scripts/consensus_call.py --prompt "$PROMPT" --model openai/gpt-5.1-codex          --out "$OUT/round13_codex.json" &
python scripts/consensus_call.py --prompt "$PROMPT" --model deepseek/deepseek-v4-pro     --out "$OUT/round13_deepseek.json" &
python scripts/consensus_call.py --prompt "$PROMPT" --model google/gemini-3.1-flash-lite --out "$OUT/round13_gemini.json" &
python scripts/consensus_call.py --prompt "$PROMPT" --model z-ai/glm-5.1                 --out "$OUT/round13_glm.json" &
wait
```

## Validate each response

Each voter response MUST be a single JSON object matching §6 of the prompt. Quick sanity check:

```bash
for f in round13_codex.json round13_deepseek.json round13_gemini.json round13_glm.json; do
  echo "=== $f ==="
  jq -e '.voter, .round, (.findings|length), (.external_claim_adjudication|length)' "docs/history/consensus/$f" \
    || echo "MALFORMED: $f"
done
```

Expected: `.round == 13`, `findings` array present, `external_claim_adjudication` array with 10 entries (G1–G10).

If any voter returns markdown-wrapped JSON or extra prose, re-run that voter once with a reminder appended to the prompt. If it fails twice, document the failure in synthesis and proceed with the remaining 3 voters at lower quorum (≥2/3).

## Synthesize

Produce `round13_synthesis.md` following the R12 synthesis pattern:

1. **Tally findings** — group by deduplicated `title`/`fix` semantics across voters. Report vote margin: 4/4 unanimous, 3/4 strong majority, 2/4 split, 1/4 single-voter.
2. **Adjudicate external claims** — for each G1–G10, tally CONFIRM/REFUTE/PARTIAL. Report consensus verdict per claim.
3. **Action list** — apply ≥3/4 findings immediately, escalate 2/4 splits to founder, archive 1/4 as "additional findings."
4. **Open questions** — union of voter open_questions, deduplicated.

## Estimated cost

R12 ran at ~$0.05 with Codex+DeepSeek+Gemini-Flash-Lite+GLM. R13 prompt is shorter (~7k tokens vs. R12's ~12k) so expect ~$0.03–0.04 total.

## After synthesis

- Commit synthesis + voter JSON files to `docs/history/consensus/` on a feature branch.
- Apply consensus action items as separate commits per finding (R12 pattern: one commit per F-id, message format `R13-F<n>: <title>`).
- Update `CLAUDE.md` "Currently-open items" section with anything that becomes a new tracked item.
- Push and let Cloudflare auto-deploy. Spot-check live with the `curl` snippet in CLAUDE.md.
