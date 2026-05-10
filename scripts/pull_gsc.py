"""Pull Google Search Console performance data → docs/performance/raw/gsc/.

Phase 6 stub (per memory `performance_feedback_loop.md` + Round 5 F4.R5).

This script is a deliberately incomplete skeleton committed to the repo
PRE-LAUNCH so that Phase 6 (post-launch month-2+) can activate the
performance feedback loop without a cold start.

Activate by:
  1. Filling in the OAuth service account JSON path (see CONFIG below)
  2. Removing the `if __name__ == "__main__"` early exit
  3. Implementing the `pull_search_analytics` body using the Google API client

Until then, running this file prints a skeleton message and exits 0.

Usage (once activated):
    python scripts/pull_gsc.py --days 7
    python scripts/pull_gsc.py --start 2026-06-01 --end 2026-06-30 --dimension query

Output convention:
    docs/performance/raw/gsc/{YYYY-MM-DD}.json   (immutable raw pulls)

Required env vars (set by user when activating):
    GSC_SERVICE_ACCOUNT_JSON_PATH  e.g. "%USERPROFILE%/.gsc-credentials/jara.json"
    GSC_PROPERTY_URL               e.g. "sc-domain:jarainternational.com"

Required Python packages (install when activating):
    pip install google-api-python-client google-auth-oauthlib google-auth
"""

import argparse
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path

# ────────────────────────────────────────────────────────────────────
# CONFIG (activate by filling these in Phase 6)
# ────────────────────────────────────────────────────────────────────

OUTPUT_DIR = Path(__file__).parent.parent / "docs" / "performance" / "raw" / "gsc"
DEFAULT_PROPERTY = "sc-domain:jarainternational.com"
DEFAULT_DIMENSIONS = ["query", "page", "country", "device", "date"]

# ────────────────────────────────────────────────────────────────────
# IMPLEMENTATION (Phase 6 work)
# ────────────────────────────────────────────────────────────────────


def pull_search_analytics(
    property_url: str,
    start_date: str,
    end_date: str,
    dimensions: list[str],
    output_dir: Path,
) -> Path:
    """Fetch Search Analytics data from GSC API and write to JSON.

    TODO Phase 6:
    - Load service account credentials from GSC_SERVICE_ACCOUNT_JSON_PATH env var
    - Build googleapiclient.discovery.build('searchconsole', 'v1', credentials=creds)
    - Call service.searchanalytics().query(siteUrl=property_url, body={...}).execute()
    - Paginate if rowLimit (max 25,000) is hit
    - Write atomically to {output_dir}/{end_date}.json with metadata header
    - Return path to written file
    """
    raise NotImplementedError(
        "Phase 6 stub — see TODO comments. Activate per docstring instructions."
    )


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument("--property", default=DEFAULT_PROPERTY)
    p.add_argument("--days", type=int, default=7, help="Pull last N days (overrides --start/--end)")
    p.add_argument("--start", help="YYYY-MM-DD (with --end)")
    p.add_argument("--end", help="YYYY-MM-DD (with --start)")
    p.add_argument(
        "--dimensions",
        nargs="+",
        default=DEFAULT_DIMENSIONS,
        help="Any of: query, page, country, device, date, searchAppearance",
    )
    p.add_argument("--output-dir", type=Path, default=OUTPUT_DIR)
    return p.parse_args()


def main() -> int:
    print("[pull_gsc] Phase 6 stub — not yet activated.")
    print("[pull_gsc] To activate:")
    print("[pull_gsc]   1. Set env GSC_SERVICE_ACCOUNT_JSON_PATH")
    print("[pull_gsc]   2. pip install google-api-python-client google-auth-oauthlib google-auth")
    print("[pull_gsc]   3. Implement pull_search_analytics() body (see TODO)")
    print("[pull_gsc]   4. Remove this early-exit block")
    return 0

    # ──── Phase 6 activation: remove return above and uncomment below ────
    # args = parse_args()
    # if args.days and not args.start:
    #     end_dt = datetime.utcnow().date()
    #     start_dt = end_dt - timedelta(days=args.days)
    # else:
    #     start_dt = datetime.fromisoformat(args.start).date()
    #     end_dt = datetime.fromisoformat(args.end).date()
    # output_path = pull_search_analytics(
    #     property_url=args.property,
    #     start_date=start_dt.isoformat(),
    #     end_date=end_dt.isoformat(),
    #     dimensions=args.dimensions,
    #     output_dir=args.output_dir,
    # )
    # print(f"[pull_gsc] wrote {output_path}")
    # return 0


if __name__ == "__main__":
    sys.exit(main())
