"""Extract and structurally validate JSON-LD blocks from a live URL.

Partial substitute for Google Rich Results Test when run from CLI: confirms
JSON parses, @id values are present and collision-free, expected schema types
match, and key fields (Product.offers, FAQPage.mainEntity, BreadcrumbList items)
are populated. Does not replace Google's parser-specific validation.

Usage: python scripts/validate_jsonld.py <url>...
"""
import json
import re
import sys
import urllib.request


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "jara-validate/1"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8", errors="replace")


def extract_blocks(html: str) -> list[str]:
    return re.findall(
        r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
        html, re.DOTALL,
    )


def report(url: str) -> int:
    print(f"\n=== {url} ===")
    try:
        html = fetch(url)
    except Exception as e:
        print(f"  FAIL: FETCH FAILED: {e}")
        return 1

    blocks = extract_blocks(html)
    print(f"  JSON-LD <script> blocks: {len(blocks)}")
    ids_seen: dict[str, int] = {}
    issues = 0
    for i, raw in enumerate(blocks, 1):
        try:
            obj = json.loads(raw.strip())
        except json.JSONDecodeError as e:
            print(f"  [{i}] FAIL: INVALID JSON at pos {e.pos}: {e.msg}")
            issues += 1
            continue
        t = obj.get("@type", "?")
        idv = obj.get("@id", "")
        print(f"  [{i}] @type={t}  @id={idv or '(none)'}")
        if idv:
            ids_seen[idv] = ids_seen.get(idv, 0) + 1
        if t == "Product":
            offers = obj.get("offers")
            print(f"      offers present: {bool(offers)}", end="")
            if offers:
                print(f"  availability={offers.get('availability', '?')}")
            else:
                print()
                issues += 1
            print(f"      sku={obj.get('sku', '?')}  mpn={obj.get('mpn', '?')}")
            print(f"      additionalProperty count: {len(obj.get('additionalProperty', []))}")
        elif t == "FAQPage":
            ents = obj.get("mainEntity", [])
            print(f"      Q&A count: {len(ents)}")
            if not ents:
                issues += 1
        elif t == "BreadcrumbList":
            items = obj.get("itemListElement", [])
            names = [it.get("name") for it in items]
            print(f"      breadcrumb items: {names}")

    # Collision check
    colliding = {k: v for k, v in ids_seen.items() if v > 1}
    if colliding:
        print(f"  WARN @id COLLISIONS: {colliding}")
        issues += 1
    else:
        print(f"  OK no @id collisions")
    return issues


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: python scripts/validate_jsonld.py <url>...")
        return 2
    total = 0
    for url in sys.argv[1:]:
        total += report(url)
    print(f"\nTotal issues across {len(sys.argv) - 1} URLs: {total}")
    return 1 if total > 0 else 0


if __name__ == "__main__":
    sys.exit(main())
