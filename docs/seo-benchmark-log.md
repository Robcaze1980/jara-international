# Target-query benchmark log

Fixed 6-query panel, re-run on a schedule to measure whether the 2026-07-29
work moves organic and AI-answer visibility. **Queries must stay identical
run-to-run** — changing the panel destroys comparability, which is the only
thing this log is for.

Method: run each query against live search + AI answer engines, record where
`jarainternational.com` appears and where `plycemca.com` appears.

---

## Run 1 — 2026-07-29, BEFORE the work (baseline)

| # | Query | JARA | plycemca.com |
|---|---|---|---|
| 1 | non-combustible fiber cement subfloor | — | **#4, #10** |
| 2 | fiber cement vs plywood subfloor | — | — |
| 3 | UL R15140 fiber cement subfloor classification | — | **#1, #2, #3, #5** |
| 4 | non-combustible subfloor cost price per panel delivered | — | **#2** |
| 5 | subfloor Type I/II construction ASTM E136 requirement | — | — |
| 6 | `"jarainternational.com"` (exact domain) | — | — |

**0 / 6.** Absent even from an exact-domain brand search.

## Run 2 — 2026-07-29, AFTER the work (T=0)

Same day as deployment. Run purely to fix a precise comparison point — Google
had not recrawled, so no movement was expected and none was observed.

| # | Query | JARA | plycemca.com |
|---|---|---|---|
| 1 | non-combustible fiber cement subfloor | — | **#4, #10** |
| 2 | fiber cement vs plywood subfloor | — | — |
| 3 | UL R15140 fiber cement subfloor classification | — | **#1, #2, #3, #5** |
| 4 | non-combustible subfloor cost price per panel delivered | — | **#2** |
| 5 | subfloor Type I/II construction ASTM E136 requirement | — | — |
| 6 | `"jarainternational.com"` (exact domain) | — | — |

**Unchanged from Run 1.** This is the expected and correct result: a same-day
re-run measures crawl latency, not the work.

### Watch signals for the next run

Three concrete things to look for, in rough order of how early they should move:

1. **Stale-claim decay.** The AI synthesis for query 4 still repeats
   *"CIF Long Beach"* and *"3–5 business day delivery"* — read from Google's
   cached copy of `plycemca.com/pricing`. Those are ADR-049-violating claims.
   When that phrasing stops appearing, Google has reprocessed the old pages.
2. **plycemca.com positions dropping** on query 3 (currently #1/#2/#3/#5).
   Those URLs now 301; as Google follows them the listings should vacate.
3. **JARA appearing** on queries 2, 3, 5 — the three the rewritten guides
   target directly. Query 3 is the highest-value signal because it is where the
   old domain holds the top of the page.

Ordering matters: 1 and 2 should precede 3. Seeing 3 without 1 or 2 would be
surprising and worth investigating.

---

## Run 3 — target ~2026-08-12 (+2 weeks)

_Not yet run._

## Run 4 — target ~2026-09-09 (+6 weeks)

_Not yet run._

---

## What was changed between Run 2 and Run 3

For attribution when the numbers do move:

- **Old-domain migration** — `plycemca.com` moved to Cloudflare, TLS repaired,
  7 URLs + catch-all now `301` to JARA equivalents, GSC Change of Address
  confirmed, Bing verified. Previously: TLS handshake failure and a blanket
  `302` to the manufacturer's corporate site.
- **Citation layer** — 15 outbound links to issuing authorities (ASTM, ICC, UL,
  IAPMO) where there had been zero sitewide; `citation` in Article schema.
- **Guide depth** — 225→1272, 257→1040, 247→829 words; `FAQPage` on all three.
- **Internal linking** — guides 1→4 inbound links each; `/es` sub-pages 0→4.
- **Host canonicalization** — `www` 301s to apex.
- **IndexNow** — 20 URLs pushed to Bing/Yandex.

Confounders to keep in mind: no backlink acquisition was done, and Bing
explicitly flags inbound links as the site's top weakness. Ranking gains in
Run 3 are therefore most plausibly attributed to the migration rather than to
on-page work.
