# SEO / GEO audit — 2026-07-29

Successor to `Julio-9-SEO-GEO-Audit.md` (sealed DONE). That pass fixed on-page
technical SEO. This pass ran a **live crawl + a target-query benchmark across
search and AI answer engines**, which the July 9 pass did not, and the benchmark
changed the priority order substantially.

---

## Method

- Crawled all 23 sitemap URLs plus `/long-beach-stock`, `/llms.txt`,
  `/llms-full.txt` — status, canonical, robots, titles, meta, headings, JSON-LD
  types, word count, hreflang, and the full internal link graph.
- Benchmarked 6 priority queries against live search + AI answer engines.
- Cross-checked GSC page-indexing state (8 indexed / 4 not indexed).

---

## Headline finding

**`jarainternational.com` appeared in 0 of 6 target queries** — including an
exact-domain brand search for `"jarainternational.com"`.

The old site, **`plycemca.com`, holds the rankings instead**:

| Query | JARA | plycemca.com |
|---|---|---|
| non-combustible fiber cement subfloor | absent | **#4, #10** |
| UL R15140 fiber cement subfloor classification | absent | **#1, #2, #3, #5** |
| non-combustible subfloor cost per panel delivered | absent | **#2** |
| fiber cement vs plywood subfloor | absent | — |
| subfloor Type I/II construction ASTM E136 | absent | — |
| `"jarainternational.com"` (exact domain) | absent | — |

And `plycemca.com` is a dead end:

- **HTTPS handshake fails** (`SEC_E_ILLEGAL_MESSAGE` / TLS alert) — a crawler
  requesting the canonical `https://` URL gets an error, not a redirect.
- **HTTP returns `302 Found` → `https://www.plycem.com`** — a *temporary*
  redirect, so it passes no link equity, and it points at the **manufacturer's
  corporate site, not JARA**.
- Google still serves the old pages from its index with stale content.

Net effect: the organic demand that the previous site converted at ~2–3
leads/month now resolves to a TLS error or lands on Plycem's corporate site.
**This is the most probable single explanation for zero leads since launch** —
it is a discovery problem upstream of any conversion problem.

### Secondary exposure: the old pages breach current ship blockers

The indexed `plycemca.com` content still publishes claims that JARA's own
contractual rules now forbid:

- `"In Stock CA"`, `"1,500+ panels ready for 0–3 day delivery"`,
  `"CIF Long Beach"` — contradicts **ADR-049** (no US warehouse, ~3–4 week
  container-direct).
- `"65–70% cost savings compared to USG Structo-Crete"` and an entire
  `/structo-crete-alternatives` page — **names a competitor in a comparative
  claim**, which **SB-3** prohibits without written Plycem approval.
- `PLYCEM` in the domain and in every `<title>` — **SB-1**, **SB-5**.
- Stale pricing (`$79–88/panel`) against a superseded cost model.

This is a compliance surface, not only an SEO one.

---

## Ranked gaps

| # | Gap | Impact | Fixable in this repo |
|---|---|---|---|
| **P0** | plycemca.com holds rankings; broken TLS + 302 to supplier | **Critical** | ❌ domain/hosting |
| **P1** | Zero source citations sitewide | High | ✅ **fixed 2026-07-29** |
| **P2** | Guides too thin to be citable; near-orphaned | High | ✅ **fixed 2026-07-29** |
| **P3** | 4 host variants serving `200` | Medium | ✅ open |
| **P4** | `/es` cluster fully orphaned | Medium | ✅ open |
| **P5** | IAPMO ER-360 date sweep | High | ⚠️ open — needs renewed date |

---

## P0 — plycemca.com 301 map (ACTION REQUIRED, outside this repo)

Founder confirmed 2026-07-29 that the domain is still under his control.

Two things must both be done, at the DNS/hosting level (currently IONOS,
`74.208.236.23`):

1. **Fix TLS on the apex + www**, so `https://plycemca.com/` completes a
   handshake. Until this works, Googlebot cannot follow *any* redirect placed
   there — it never gets far enough to see one.
2. **Replace the blanket `302 → www.plycem.com` with per-URL `301`s** to the
   JARA equivalents below. `301` is required; `302` passes no equity.

| Old URL (plycemca.com) | → 301 destination (jarainternational.com) | Rationale |
|---|---|---|
| `/` | `/` | Both are subfloor-anchored homepages; near-identical intent. |
| `/pricing` | `/pricing` | Exact intent match. |
| `/fire-code-compliance` | `/guides/type-i-ii-construction-subfloor` | **Highest-value redirect** — the old page ranks #1–#3 for UL R15140. |
| `/faq` | `/products/high-performance-subfloor` | Pillar carries the FAQPage content. |
| `/thickness-guide` | `/products/high-performance-subfloor` | Pillar's VariantTable is the thickness selector. |
| `/installation` | `/products/high-performance-subfloor` | Install content lives on the pillar; no standalone page. |
| `/structo-crete-alternatives` | `/products/high-performance-subfloor` | ⚠️ Redirect only. **Do not** rebuild competitor-comparison content at the destination — SB-3. |

Catch-all for anything not listed: `301 → https://jarainternational.com/`.

> **SB-3 note:** redirecting the `structo-crete-alternatives` URL is fine — the
> destination is a plain product page making no comparative claim. What is *not*
> permitted is recreating the naming/comparison content on JARA surfaces.

Expected effect: the accumulated authority currently stranded on a broken domain
starts consolidating onto `jarainternational.com`, and the highest-intent
compliance query (`UL R15140`) begins routing to a live JARA page. Reprocessing
is measured in weeks.

---

## P1 + P2 — FIXED 2026-07-29 (commit `dbe91f9`)

**P1.** The crawl found the only external link on any page was the WhatsApp deep
link, while the copy asserts ~8 code/compliance claims with nothing verifiable
behind them. The benchmark made the cost concrete: answer engines resolved these
exact questions from `codes.iccsafe.org`, `buildsteel.org`, `icc-nta.org` and
`uniform-es.org` — sources that are linkable and corroborated. JARA was in none
of the citation graphs.

**P2.** The guides cluster — built in the July 9 pass specifically to win
informational queries — was too thin to earn a citation and near-orphaned.

Shipped:

- `lib/sources.ts` — registry of issuing authorities, each mapped to the
  specific claim it substantiates. All URLs verified to resolve.
- `components/SourceCitations.tsx` — "Sources & verification" block. **Followed**
  links (not `nofollow`) to issuing bodies; paywalled/registration targets
  labeled so a login wall does not read as a dead reference.
- `articleSchema()` emits `citation`, giving extractors an explicit
  claim → authority edge.

| Page | Words | Authority links | Schema added |
|---|---|---|---|
| `/guides` | 86 → **333** | — | ItemList |
| `/guides/type-i-ii-construction-subfloor` | 225 → **1292** | 0 → **7** | FAQPage + 7 citations |
| `/guides/fiber-cement-vs-plywood-subfloor` | 257 → **1040** | 0 → **5** | FAQPage + 5 citations |
| `/guides/non-combustible-subfloor-cost` | 247 → **829** | 0 → **3** | FAQPage + 3 citations |

Each guide went from **1 → 4 inbound internal links** (hub + 2 siblings +
subfloor pillar). Sitewide authority outbound links: **0 → 15**.

Also closed two price-drift paths the parity check does not cover: the hardcoded
`$74` in the guides-hub blurb and in the comparison table now derive from
`lib/pricing`.

---

## P3 — host canonicalization (OPEN)

Four host variants all return `200` with no redirect between them:

| URL | Status |
|---|---|
| `https://jarainternational.com` | 200 (canonical) |
| `https://www.jarainternational.com` | **200** — serves the whole site |
| `http://jarainternational.com` | **200** — no HTTPS enforcement |
| `http://www.jarainternational.com` | **200** |

`rel=canonical` on the duplicates correctly points to the apex, which is why GSC
reports these as *"Alternate page with proper canonical tag" (2 pages)* rather
than as duplicates — Google is handling it. But it doubles the crawl surface and
the count grows as more www URLs are discovered.

Fix: `301` www → apex and http → https, at the Cloudflare edge (Redirect Rule)
or via host-matched `redirects()` in `next.config.mjs`. Verify carefully for
redirect loops before deploying — a bad host rule takes the whole site down.

`jaraintl.com` does **not** resolve (`NXDOMAIN`-equivalent), despite
`lib/site.ts` commenting that it "301 redirects to canonical". That comment is
stale.

---

## P4 — orphaned `/es` cluster (OPEN)

`/es/contact`, `/es/pricing`, `/es/resources`, `/es/service-areas` each have
**zero** inbound internal links from anywhere on the site, including from `/es`
itself. They are reachable only via the sitemap. `/es/pricing` in particular is a
full priced page (744 words, ItemList + FAQPage schema) that nothing links to.

They also carry only `Organization` schema — no BreadcrumbList — unlike their EN
counterparts.

Fix: give `/es` a real sub-navigation, and add breadcrumbs to the ES pages.

---

## P5 — IAPMO ER-360 date sweep (OPEN — blocked on the renewed date)

Founder confirmed renewal on 2026-07-29, but the **new expiry date is not yet
recorded**. The prior edition ran to **2026-07-31**.

`lib/sources.ts` deliberately leaves `validThrough` **unset** rather than
publishing the superseded window — a citation block that states a lapsed date as
current is worse than one that states none.

Surfaces still carrying `2026-07-31`, to sweep once the letter is in hand:

- `data/products.ts` — `cert.validThrough` (flows into Product JSON-LD)
- `public/llms.txt` — "valid through 2026-07-31"
- meta descriptions on `/` and `/resources`
- `lib/sources.ts` — set `iapmoUes.validThrough`

---

## Re-audit cadence

The on-site work is verifiable immediately; the benchmark is not. Google must
recrawl and reprocess, and answer engines refresh on their own cycle. **Re-run
the 6-query benchmark at +2 weeks and +6 weeks**, not same-day — a same-day
re-run measures nothing and reads as a false negative.

The P0 redirect is the variable most likely to move the benchmark. Nothing on
`jarainternational.com` outranks a domain that currently holds #1–#3 with
JARA's own product story.
