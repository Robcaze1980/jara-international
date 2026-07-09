# Round 16 — Runbook

**Prompt:** `docs/history/consensus/round16_prompt.md`
**Date run:** 2026-07-09
**Operator:** Claude Code session (founder-directed).

## Voter invocation (as run)

```bash
S="scripts/consensus_call.py"
P="docs/history/consensus/round16_prompt.md"
O="docs/history/consensus"

python "$S" --prompt "$P" --model openai/gpt-5.1-codex          --out "$O/round16_codex.json"
python "$S" --prompt "$P" --model deepseek/deepseek-v4-pro      --out "$O/round16_deepseek.json"
python "$S" --prompt "$P" --model google/gemini-3.1-flash-lite  --out "$O/round16_gemini.json"
python "$S" --prompt "$P" --model z-ai/glm-5.1                  --out "$O/round16_glm.json"
```

`OPENROUTER_API_KEY` read from environment (present in shell profile). All 4 calls
returned exit 0. Round cost ≈ **$0.039** (codex $0.0184 + deepseek $0.0068 +
gemini $0.0021 + glm $0.0116).

## Outputs
- `round16_codex.json`, `round16_deepseek.json`, `round16_gemini.json`, `round16_glm.json`
- `round16_synthesis.md` — tallied result + action items.

## Notes
- Some voters echoed the schema example's `voter` name in their body; attribute by
  the OpenRouter `model` field, not the self-reported name.
- Q3 (JSON-LD schema) failed quorum (2-1-1). Pending founder tie-break or Round 16.5.
