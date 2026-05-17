# Round 11 — Operator Runbook

**Audience:** the human or agent running the consensus process for Round 11.
**NOT seen by voters.** Voters receive only `round11_prompt.md`.

---

## What this round is reviewing

5 commits shipped on 2026-05-16 that materially changed positioning, layout, and the product catalog:

- `34a2353` — husky hook fix
- `abb8dfd` — ADR-049 warehouse-positioning correction
- `20b283e` — subfloor-hero homepage
- `099d544` — 3 new products added to catalog
- `666a8db` — application-string tuning

Full retrospective in `round11_prompt.md` §1. 8 voting items (R11-A through R11-H).

---

## Voter pool & model slugs

| Voter | OpenRouter slug | Vote artifact | Capture method |
|---|---|---|---|
| **Codex** (GPT-5.1) | `openai/gpt-5.1-codex` | `round11_codex.json` | `scripts/consensus_call.py` |
| **DeepSeek V4 Pro** | `deepseek/deepseek-v4-pro` | `round11_deepseek.json` | `scripts/consensus_call.py` |
| **Gemini 3.1 Flash Lite** | `google/gemini-3.1-flash-lite` | `round11_gemini.json` | `scripts/consensus_call.py` |
| **GLM-5.1** | `z-ai/glm-5.1` | `round11_glm.json` | `scripts/consensus_call.py` |
| **Claude Opus 4.7** | `anthropic/claude-opus-4-7` (do NOT use in-session) | `round11_claude.md` | **Fresh Claude conversation — manual paste** |

### Why Claude must come from a fresh session for Round 11 (and not from the work-doing session)

The current Claude session authored every change being reviewed (R11-A through R11-H). Voting on its own work in-session is a textbook conflict of interest — the synthesis author should not be a defender of the proposals.

**Two acceptable ways to capture the Claude vote:**

1. **Open a new Claude conversation** (claude.ai / Claude Code with a fresh context) → paste the entire contents of `round11_prompt.md` → save the response as `round11_claude.md`.
2. **Call `anthropic/claude-opus-4-7` via the OpenRouter runner** (treat Claude as just another OpenRouter voter for this round). This is the cleanest automation path; saves as `.json` like the others, but consistency with the Round 10 naming convention (`round10_claude.md`) suggests `.md` is preferred.

Either captures an uncontaminated vote. Do NOT have the current session vote.

---

## Prerequisites

- `OPENROUTER_API_KEY` set in environment (currently: set, length 73 chars — confirmed via env check)
  - Falls back to `.env.local` in any ancestor directory (handled by `_load_env_local()` in the script)
- Python 3 with stdlib only (no extra packages — the runner uses `urllib.request`)
- The prompt file at `docs/history/consensus/round11_prompt.md`

## Commands (run from repo root)

```bash
# Working dir
cd "C:/Users/rob62/My Drive/Jara Intl - Website/jara-website"

# Set common variables (PowerShell would use $env:PROMPT etc.)
PROMPT="docs/history/consensus/round11_prompt.md"
OUT_DIR="docs/history/consensus"

# === 4 OpenRouter voters ===
python scripts/consensus_call.py \
    --prompt "$PROMPT" \
    --model openai/gpt-5.1-codex \
    --out "$OUT_DIR/round11_codex.json"

python scripts/consensus_call.py \
    --prompt "$PROMPT" \
    --model deepseek/deepseek-v4-pro \
    --out "$OUT_DIR/round11_deepseek.json"

python scripts/consensus_call.py \
    --prompt "$PROMPT" \
    --model google/gemini-3.1-flash-lite \
    --out "$OUT_DIR/round11_gemini.json"

python scripts/consensus_call.py \
    --prompt "$PROMPT" \
    --model z-ai/glm-5.1 \
    --out "$OUT_DIR/round11_glm.json"

# === 5th voter (Claude) ===
# Option A: OpenRouter (most automated)
python scripts/consensus_call.py \
    --prompt "$PROMPT" \
    --model anthropic/claude-opus-4-7 \
    --out "$OUT_DIR/round11_claude.json"

# Option B: Fresh Claude conversation
# 1. Open claude.ai or a new Claude Code session (zero prior context)
# 2. Paste the entire contents of round11_prompt.md as the first message
# 3. Save the assistant's response verbatim to docs/history/consensus/round11_claude.md
```

Each OpenRouter call should complete in 30–120 seconds and cost ~$0.005–0.05 depending on the voter (Codex and Opus are the more expensive ones; GLM-5.1 and Gemini Flash Lite are cheap). Total budget for the 4–5 calls: approximately **$0.10–$0.30**.

The runner has built-in retry (3 attempts with exponential backoff) for transient network errors. JSON-decode errors are not retried.

## After all 5 votes are in

1. **Sanity-check each response** — open each `.json`/`.md` and confirm:
   - The `votes` block has all 8 items (A–H) filled
   - Each vote letter matches one of the prompt's allowed options (e.g., A1/A2/A3/A4)
   - `verdict` is one of `"ship" | "tune" | "rollback"`
   - `additional_findings` is parseable (could be empty)

2. **Produce `round11_synthesis.md`** by tallying votes per item:
   - 5-0 unanimous → **locked**, no dissent note required
   - 4-1 strong majority → locked, single-sentence dissent note
   - 3-2 bare quorum → locked with a multi-sentence dissent note that captures the minority position (these tend to need a follow-up review or are revisited in the next round)
   - 2-3 or worse → **failed quorum**, item kicks to Round 11.5 with a re-scoped option set
3. **Apply the locked decisions** as a follow-up commit on `main` titled `feat(round11): apply synthesis decisions (R11-A…H)` or similar. Each decision either confirms shipped work (no code change) or applies a TUNE/REVERT (code change).

4. **`additional_findings` triage** — any voter-flagged finding with `severity: "blocker"` becomes an immediate Round 11.5 item OR a hot-fix commit (depending on whether it requires re-vote or is unambiguous). `severity: "high"` items get folded into the next planning round. `low/medium` go to the backlog.

5. **The synthesis Claude session is OK to use the work-doing session** — synthesis is mechanical tallying + applying voting rules, not original decision-making, so the conflict-of-interest concern doesn't apply.

## What this runbook does NOT do

- Does not actually invoke any voter automatically. The operator (you) chooses when to run, accepting the OpenRouter cost.
- Does not validate the prompt content — if the prompt has a typo or a vote-option mismatch, voters will return malformed responses. Validate the prompt before sending.
- Does not handle voter timeouts past 300 seconds (the script's `urlopen` timeout). If a voter hangs, the call fails — manually retry that voter, or move on with 4-voter quorum (which is acceptable per ADR-032 if 3/4 still gets you majority on each item).

## Cost-conscious option: skip an expensive voter

If budget is the concern, the Round 10 cost data showed Codex at ~$0.02 per round. Gemini Flash Lite and GLM-5.1 are sub-cent. DeepSeek and Opus are mid-range. A 5-voter pass on Round 10 cost the user roughly **$0.05–$0.10 total**. Skipping one voter to save budget is cheap-but-not-free in terms of consensus quality — quorum drops from 3/5 to 3/4 which means tied items (2-2) lack a tiebreaker. Not recommended unless API spend matters more than decision robustness.
