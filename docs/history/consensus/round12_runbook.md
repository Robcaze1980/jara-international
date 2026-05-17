# Round 12 — Operator Runbook (SEO + AI-Friendliness + Cloudflare Infra Audit)

**Round shape:** Independent comprehensive audit (NOT a vote on pre-cooked findings).
**Voters:** 4 (Codex / DeepSeek / Gemini / GLM). Claude is NOT a voter from R12+.
**Quorum:** ≥3/4 simple majority per finding (overlap measure across 4 independent audits).
**Round date:** 2026-05-17.

---

## Prerequisites

1. `OPENROUTER_API_KEY` set in environment OR readable from `.env.local` (script walks up from cwd).
2. Python 3 with `requests` installed (script handles this).
3. CWD = `jara-website/` repo root.
4. Verify the prompt is finalized:
   ```bash
   wc -l docs/history/consensus/round12_prompt.md
   # expect ~500+ lines
   ```

---

## Run the 4 voters

Run all four in parallel (each call ~30–90s, total round wall-clock ~2 min).

```bash
PROMPT="docs/history/consensus/round12_prompt.md"
OUT="docs/history/consensus"

python scripts/consensus_call.py --prompt "$PROMPT" --model openai/gpt-5.1-codex          --out "$OUT/round12_codex.json"     --temperature 0.3 &
python scripts/consensus_call.py --prompt "$PROMPT" --model deepseek/deepseek-v4-pro      --out "$OUT/round12_deepseek.json"  --temperature 0.3 &
python scripts/consensus_call.py --prompt "$PROMPT" --model google/gemini-3.1-flash-lite  --out "$OUT/round12_gemini.json"    --temperature 0.3 &
python scripts/consensus_call.py --prompt "$PROMPT" --model z-ai/glm-5.1                  --out "$OUT/round12_glm.json"       --temperature 0.3 &
wait
```

Windows PowerShell equivalent (sequential — `&` parallelism doesn't translate to PS 5.1):

```powershell
$PROMPT = "docs/history/consensus/round12_prompt.md"
$OUT    = "docs/history/consensus"

python scripts/consensus_call.py --prompt $PROMPT --model openai/gpt-5.1-codex          --out "$OUT/round12_codex.json"     --temperature 0.3
python scripts/consensus_call.py --prompt $PROMPT --model deepseek/deepseek-v4-pro      --out "$OUT/round12_deepseek.json"  --temperature 0.3
python scripts/consensus_call.py --prompt $PROMPT --model google/gemini-3.1-flash-lite  --out "$OUT/round12_gemini.json"    --temperature 0.3
python scripts/consensus_call.py --prompt $PROMPT --model z-ai/glm-5.1                  --out "$OUT/round12_glm.json"       --temperature 0.3
```

---

## Why temperature 0.3

- Audit findings should be **convergent across runs** of the same model (low variance) so synthesis measures inter-voter overlap, not within-voter noise.
- 0.3 is low enough for consistency but not 0 — gives the model enough latitude to surface less-obvious findings instead of always returning the most common ones.
- Matches R10/R11 temperature choice.

---

## Validate voter responses

Each `round12_<voter>.json` should contain a single JSON object matching the schema in §5 of the prompt. Validate before synthesis:

```bash
for v in codex deepseek gemini glm; do
  echo "=== $v ==="
  python -c "import json,sys; d=json.load(open('docs/history/consensus/round12_$v.json')); print('voter:', d.get('voter')); print('findings:', len(d.get('findings', []))); print('strengths:', len(d.get('strengths', []))); print('open_questions:', len(d.get('open_questions', [])))"
done
```

If any voter returned malformed JSON (markdown fences, trailing prose, missing required fields), either:
1. Re-run that voter with `--temperature 0.2` and a stricter system prompt prefix, OR
2. Hand-extract the JSON from the response and save the cleaned file.

---

## Synthesis — how to score consensus

This is an **overlap audit**, not a binary vote. The synthesis methodology:

1. **Normalize findings across voters** — same defect surfaced with different wording counts as one finding. Match by: dimension + affected artifact + nature of issue (not by literal title).
2. **Group findings by overlap count:**
   - **4/4 voters surfaced it** → critical consensus, ship immediately
   - **3/4 voters surfaced it** → strong consensus, apply
   - **2/4 voters surfaced it** → split — escalate to founder for adjudication
   - **1/4 voter surfaced it** → "additional finding" — surface in synthesis appendix but do not auto-apply (per R11 precedent)
3. **Severity adjudication** — when voters disagree on severity, default to the **higher** severity of the two votes (audit-conservatism: better to over-flag than under-flag).
4. **Conflict with locked constraints** — if a voter recommends something that violates §2 of the prompt, surface it in the synthesis "voter errors" section, do not apply it.
5. **Strengths aggregation** — items in `strengths` arrays don't need quorum; surface unique strengths in synthesis appendix.

### Synthesis output: `round12_synthesis.md`

Structure:
- §1 Round metadata (voters, model versions, total findings count, round cost)
- §2 4/4 unanimous findings (ranked by severity)
- §3 3/4 strong-majority findings
- §4 2/4 split findings (with per-voter rationale, awaiting founder adjudication)
- §5 1/4 single-voter additional findings (info-only)
- §6 Strengths (deduped across voters)
- §7 Open questions (deduped, ranked by how many voters raised)
- §8 Voter errors (recommendations that violated §2 locks, if any)
- §9 Action plan — concrete TODO list grouped by file/area, in shippable order

---

## Apply phase (separate session)

Per CLAUDE.md governance, the applying session should:

1. Read `round12_synthesis.md`
2. Confirm scope with founder before touching code
3. Ship 4/4 and 3/4 items first (high-confidence consensus)
4. Hold 2/4 items for founder adjudication
5. Commit with subject `feat(round12): apply consensus decisions — <summary>`
6. Update `MASTER_AUDIT.md` to reflect any new ADRs locked by R12

---

## Round cost expectation

Per R11 actuals (extrapolated, no Claude voter):
- Codex (GPT-5.1): ~$0.020
- DeepSeek V4 Pro: ~$0.008
- Gemini 3.1 Flash Lite: ~$0.005
- GLM-5.1: ~$0.015

**Expected round total: ~$0.05.** R11 with Claude was $0.178. Dropping Claude saves ~$0.13/round.
