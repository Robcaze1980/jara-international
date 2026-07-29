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

## How to run a benchmark round

Split by who can actually do each part. Claude has no access to the GSC or Bing
dashboards; the founder has no reason to run curl.

### Part A — ask Claude (one message)

> "Corré el benchmark del log — las 6 consultas, el crawl y la salud de las
> redirecciones. Compará contra Run 2."

Claude runs: the 6 fixed queries, a full crawl of the sitemap, redirect health
on `plycemca.com` (7 URLs + catch-all), MX/SPF/DMARC, and the `www` → apex
collapse. Then appends the run to this file.

### Part B — founder only (dashboards)

**Google Search Console — `jarainternational.com`**
- *Pages* → indexed vs not-indexed count. **Baseline 2026-07-29: 8 indexed / 4 not indexed.**
  Watch the "Alternate page with proper canonical tag" bucket (was 2) — the www
  301 should retire it.
- *Performance* → impressions/clicks trend, and whether any guide URL appears.
- *Settings → Change of address* → confirm still active, no errors.

**Google Search Console — `plycemca.com`**
- *Pages* → the 7 old URLs should be migrating out of the index.

**Bing Webmaster Tools — `jarainternational.com`**
- *Search Performance* — **baseline 2026-07-29: 3 clicks / 66 impressions.**
- *AI Performance (BETA)* — the metric the citation layer targets. Any guide
  appearing here is the clearest evidence the 2026-07-29 work landed.
- *URL Inspection* on the three guides — Bing had **never discovered** them as
  of 2026-07-29 ("URL is not known to Bing").

Screenshot those and hand them to Claude for interpretation alongside Part A.

### Part C — decide

If the watch signals fired in order (stale-claim decay → plycemca positions
vacating → JARA appearing), the migration is working; no action, wait for Run 4.

If **nothing** moved by Run 4 (~6 weeks), that is the trigger to investigate:
check the redirects still return 301, that Change of Address has not errored,
and whether the `plycemca.com` domain renewed. Do not conclude the on-page work
failed — with zero backlink acquisition, that is not what Run 3/4 can measure.

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
