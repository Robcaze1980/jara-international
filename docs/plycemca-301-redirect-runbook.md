# Runbook — plycemca.com → jarainternational.com (301 migration)

**Status:** approved to execute. Plycem confirmed 2026-07-29 that JARA may keep
`plycemca.com` **as a redirect only** — no content published on it.

This closes gap **P0** from `Julio-29-SEO-GEO-Audit.md`, the highest-impact item
in the audit: `plycemca.com` currently holds **#1–#3 for "UL R15140"** while
`jarainternational.com` ranks for none of the 6 target queries.

> **Compliance note.** The permission is for a *redirect*, not a site. The domain
> must serve **zero content** — no HTML, no titles, no logos, no landing page.
> A redirect-only zone publishes nothing, so no PLYCEM-branded surface exists.
> Do **not** point `plycemca.com` DNS at the JARA Worker — that would serve the
> whole site on a second hostname and create a duplicate-host problem on top of
> the one already open (P3).

---

## Why Cloudflare, not IONOS

Current state at IONOS (`74.208.236.23`): HTTPS handshake **fails**, and HTTP
returns a blanket `302` to `https://www.plycem.com`.

Both must change. Moving the zone to Cloudflare fixes them together:

| Problem | Cloudflare solution |
|---|---|
| TLS handshake fails | Universal SSL — automatic, free, no cert management |
| Blanket `302` to the supplier | Bulk Redirects — per-URL `301` |
| Two dashboards to maintain | Same account as `jarainternational.com` |

Until TLS works, **Googlebot never sees any redirect you place there** — it
requests `https://plycemca.com/` first, gets a TLS error, and stops. The cert is
a hard prerequisite, not a nice-to-have.

---

## Step 1 — Add the zone to Cloudflare

1. Cloudflare dashboard → **Add a site** → `plycemca.com` → **Free** plan.
2. Cloudflare shows two nameservers. Go to the **registrar** for `plycemca.com`
   and replace the IONOS nameservers with Cloudflare's.
3. Wait for the zone to go **Active** (usually under an hour; can take longer).
4. Confirm **SSL/TLS → Overview** is set to **Full** (not Flexible, not Off).

## Step 1.5 — DNS inventory BEFORE touching nameservers

⚠️ **`plycemca.com` has live email on IONOS Mail.** Moving nameservers without
recreating these records takes the mailbox down. Captured from the authoritative
IONOS nameservers on 2026-07-29:

| Type | Name | Value | After migration |
|---|---|---|---|
| A | `@` | `74.208.236.23` | **change** → `192.0.2.1`, proxied |
| AAAA | `@` | `2607:f1c0:100f:f000::200` | **delete** — see note |
| A | `www` | `74.208.236.23` | **change** → `192.0.2.1`, proxied |
| MX | `@` | `10 mx00.ionos.com` | **keep exactly**, DNS-only |
| MX | `@` | `10 mx01.ionos.com` | **keep exactly**, DNS-only |
| TXT | `@` | `v=spf1 include:_spf-us.ionos.com ~all` | **keep exactly** |
| CNAME | `_dmarc` | `dmarc.ionos.com` | **keep exactly**, DNS-only |
| CNAME | `autodiscover` | `adsredir.ionos.info` | **keep exactly**, DNS-only |

Current nameservers (IONOS): `ns1029.ui-dns.de`, `ns1060.ui-dns.com`,
`ns1075.ui-dns.org`, `ns1118.ui-dns.biz`.

**Why the AAAA must go.** If the IPv6 record still points at the old IONOS host
while IPv4 points at Cloudflare, any IPv6-capable visitor or crawler — Googlebot
included — reaches the old broken server and never sees the redirect. Delete it,
or repoint it to a proxied placeholder. Leaving it is the single easiest way to
make this migration look like it silently failed.

**Email safety.** MX, SPF, DMARC and autodiscover must stay **DNS-only (grey
cloud)** — Cloudflare does not proxy mail. Because the MX targets
(`mx00/mx01.ionos.com`) live outside this zone, proxying the *website* records
has no effect on mail delivery. Email keeps working as long as the rows above
are reproduced verbatim.

## Step 2 — DNS records (redirect-only pattern)

A redirect-only zone still needs a **proxied** record for Cloudflare to
intercept the request. Point it at the documentation-reserved IP — nothing ever
connects there, because the redirect fires at the edge first.

| Type | Name | Content | Proxy |
|---|---|---|---|
| A | `plycemca.com` | `192.0.2.1` | **Proxied** (orange cloud) |
| A | `www` | `192.0.2.1` | **Proxied** (orange cloud) |

Delete every other A/AAAA/CNAME record pointing at the old IONOS host, and
delete any existing redirect/forwarding rule left over from IONOS. **The proxy
must be ON** — a grey-cloud (DNS-only) record bypasses the redirect entirely.

Leave MX and TXT records alone if email runs on this domain.

## Step 3 — Load the redirect list

Cloudflare → **Bulk Redirects** → create a list named `plycemca-to-jara` →
**Upload CSV** using `plycemca-301-redirects.csv` (next to this file).

Then create a Bulk Redirect **Rule** that applies the list. Free plan supports
this.

The list is ordered most-specific first. The final row is a catch-all with
subpath matching, so any URL not explicitly mapped still lands on the JARA
homepage rather than a 404.

## Step 4 — Verify

Ask Claude to run the verification, or check manually:

```bash
for u in / /pricing /fire-code-compliance /faq /thickness-guide /installation /structo-crete-alternatives /some-random-url; do
  echo -n "$u -> "
  curl -sI -o /dev/null -w "%{http_code} %{redirect_url}\n" "https://plycemca.com$u"
done
```

**Pass criteria — every line must show `301` and a `jarainternational.com`
target.** A `302` means the rule is misconfigured and passes no authority. A
`000` or TLS error means Step 1 is not finished.

## Step 5 — Accelerate with GSC Change of Address

This is the step most people skip, and it materially speeds up reprocessing.

1. Google Search Console → add and verify `plycemca.com` as a property (you
   control the DNS now, so DNS TXT verification is easiest).
2. In that property: **Settings → Change of address** → select
   `jarainternational.com` as the destination.
3. Google validates that the 301s are live, then explicitly migrates the
   ranking signals instead of rediscovering them page by page.

Change of Address requires the redirects to already be working, so do this
**after** Step 4 passes.

Do the same in **Bing Webmaster Tools** → *Site Move*.

---

## Redirect map

| Old URL (plycemca.com) | → 301 destination | Why |
|---|---|---|
| `/` | `/` | Both subfloor-anchored homepages; near-identical intent |
| `/pricing` | `/pricing` | Exact match |
| `/fire-code-compliance` | `/guides/type-i-ii-construction-subfloor` | **Highest value** — this is the page ranking #1–#3 for UL R15140 |
| `/faq` | `/products/high-performance-subfloor` | Pillar carries the FAQPage content |
| `/thickness-guide` | `/products/high-performance-subfloor` | Pillar's VariantTable is the thickness selector |
| `/installation` | `/products/high-performance-subfloor` | Install content lives on the pillar |
| `/structo-crete-alternatives` | `/products/high-performance-subfloor` | ⚠️ Redirect only — see below |
| anything else | `/` | Catch-all, no 404s |

> **SB-3 reminder.** Redirecting `/structo-crete-alternatives` is fine: the
> destination makes no comparative claim and names no competitor. What remains
> prohibited is **recreating** that comparison content on any JARA surface. The
> redirect is what makes the old competitor-naming page stop being served.

---

## What to expect

- **Immediately:** the old URLs stop erroring and stop leaking to the supplier's
  corporate site.
- **Days:** Google begins recrawling the old URLs and following the 301s.
- **2–6 weeks:** ranking signals consolidate onto `jarainternational.com`.
  Re-run the 6-query benchmark in `Julio-29-SEO-GEO-Audit.md` at **+2 weeks**
  and **+6 weeks**. A same-day re-run measures nothing — that was verified on
  2026-07-29.

Watch for the `UL R15140` query specifically. That is where the old domain holds
#1–#3, so it is the clearest signal that the migration is working.
