"""Call an OpenRouter model with a prompt file; save response as JSON.

Used for running consensus rounds with GLM-5.1 (or any other OpenRouter
model). Gemini 3 Pro votes are collected manually via Antigravity and
preserved as .md files in docs/history/consensus/.

Usage:
    OPENROUTER_API_KEY=... \\
    python scripts/consensus_call.py \\
        --prompt <path-to-prompt-file.md> \\
        --model <model-slug> \\
        --out <path-to-output.json> \\
        [--temperature 0.3]

Example:
    python scripts/consensus_call.py \\
        --prompt docs/history/consensus/round1_prompt.md \\
        --model z-ai/glm-5.1 \\
        --out docs/history/consensus/round1_glm.json
"""

import argparse
import http.client
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path


OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def _call_once(prompt: str, model: str, temperature: float, api_key: str) -> dict:
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "temperature": temperature,
    }
    req = urllib.request.Request(
        OPENROUTER_URL,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://localhost",
            "X-Title": "PhotoBooth Consensus",
            "Accept-Encoding": "identity",  # avoid chunked decoding issues
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=300) as resp:
        raw = resp.read().decode("utf-8")
    return json.loads(raw)


def call(prompt: str, model: str, temperature: float, api_key: str) -> dict:
    transient = (
        http.client.IncompleteRead,
        urllib.error.URLError,
        ConnectionResetError,
    )
    last_exc = None
    for attempt in range(3):
        try:
            return _call_once(prompt, model, temperature, api_key)
        except transient as e:
            last_exc = e
            print(
                f"[consensus_call] transient error attempt {attempt + 1}: {type(e).__name__}",
                file=sys.stderr,
            )
            time.sleep(2 ** attempt)
        except json.JSONDecodeError as e:
            print(f"[consensus_call] JSON decode error at {e.pos}", file=sys.stderr)
            raise
    raise RuntimeError(f"consensus_call failed after 3 attempts: {last_exc}")


def main() -> int:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--prompt", required=True, type=Path)
    p.add_argument("--model", required=True)
    p.add_argument("--out", required=True, type=Path)
    p.add_argument("--temperature", type=float, default=0.3)
    args = p.parse_args()

    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("ERROR: OPENROUTER_API_KEY env var not set", file=sys.stderr)
        return 2

    prompt = args.prompt.read_text(encoding="utf-8")
    data = call(prompt, args.model, args.temperature, api_key)

    content = data["choices"][0]["message"]["content"]
    usage = data.get("usage", {})

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(
        json.dumps(
            {"model": args.model, "content": content, "usage": usage},
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    try:
        print(f"=== {args.model} → {args.out} ===\n{content}\n--- usage ---\n{usage}")
    except UnicodeEncodeError:
        print(f"(Output saved to {args.out}; console cannot print all unicode)")

    return 0


if __name__ == "__main__":
    sys.exit(main())
