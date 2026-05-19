import Image from 'next/image';
import Link from 'next/link';

/**
 * Hero — per ADR-010 VA1 (full-bleed photo + dark navy overlay + 2 CTAs).
 *
 * Implementation per Round 5 GLM finding (WCAG AA contrast):
 * Overlay is a SOLID-TO-TRANSPARENT GRADIENT (navy 88% left → 60% right) +
 * text-shadow on H1 to guarantee AA contrast regardless of photo brightness.
 *
 * 2026-05-17: hero photo delivered — empty Type I/II commercial floor with
 * fiber-cement subfloor surface + curtain-wall city skyline, sunny daylight.
 * 1920×1434 WebP at 200 KB hits LCP target. The dark gradient overlay still
 * carries the WCAG AA contrast guarantee from Round 5 GLM finding.
 *
 * Per Round 6 F4.R6 / DeepSeek finding: hero must hit LCP <1.5s.
 *
 * 2026-05-16 positioning correction: body copy no longer claims a Long Beach
 * warehouse. JARA supplies via direct factory shipping from Plycem plants in
 * Costa Rica, El Salvador, and Honduras.
 *
 * 2026-05-16 subfloor-hero strategy: Hero now leads explicitly with the
 * PLYCEM High Performance Subfloor / High Performance Subfloor product —
 * Jara's most spec-driven SKU and the only product in the catalog with
 * a complete US compliance package (UL R15140 + ASTM E-136 + IAPMO ER-360
 * + CBC Chapter 7A). The other five products are framed as "Complete the
 * envelope" cross-sell in FeaturedProducts below.
 */

export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-navy"
      aria-labelledby="hero-heading"
    >
      {/* Background image — empty Type I/II commercial floor (subfloor as
          surface) with sunny city skyline through curtain wall. The
          gradient overlay below intentionally darkens the background so
          the floating product-detail circle (right side, above the
          overlay) reads as the brightest, sharpest element on the page. */}
      <Image
        src="/images/hero/hero-home.webp"
        alt=""
        role="presentation"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />

      {/* Solid-to-transparent gradient overlay for AA contrast (Round 5 GLM finding) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/55"
      />

      {/* Floating product-detail circle (right side, md+ to surface the
          visual on tablets as well as desktop — 2026-05-19 founder noted
          the image wasn't appearing at narrower viewports). Positioned
          ABOVE the dark overlay so the T&G close-up pops against the
          shadowed background. 2026-05-17 v2: shrunk + lowered + captioned
          per design review; the circle sits below the headline midline so
          it reads as a supporting visual, not a co-headline. */}
      <div className="pointer-events-none absolute right-4 top-[58%] z-10 hidden -translate-y-1/2 md:right-8 md:block lg:right-12 xl:right-20">
        <div className="relative h-[200px] w-[200px] md:h-[220px] md:w-[220px] lg:h-[260px] lg:w-[260px] xl:h-[300px] xl:w-[300px] 2xl:h-[340px] 2xl:w-[340px]">
          <Image
            src="/images/products/panel-detail.webp"
            alt=""
            role="presentation"
            fill
            priority
            sizes="(min-width: 1536px) 340px, (min-width: 1280px) 300px, (min-width: 1024px) 260px, (min-width: 768px) 220px, 200px"
            className="rounded-full object-cover shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ring-4 ring-white/15"
          />
        </div>
        {/* Caption gives the visual context for first-time visitors who
            don't immediately recognize a T&G edge in macro view. */}
        <div className="mt-4 text-center">
          <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-white/90">
            Tongue-and-groove edge
          </p>
          <p className="mt-1 text-xs text-white/70">
            20–30 mm structural panel
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-4xl">
          <p className="font-display text-sm font-medium uppercase tracking-wider text-bluegray">
            PLYCEM High Performance Subfloor · Multifamily · Hotel · Type I/II Commercial
          </p>
          <h1
            id="hero-heading"
            className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl text-balance"
            style={{ textShadow: '0 2px 8px rgba(4, 35, 61, 0.5)' }}
          >
            Non-Combustible Fiber-Cement Subfloor for Multifamily and Commercial Construction
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            PLYCEM High Performance Subfloor — the UL R15140 classified
            structural subfloor specified for Type V over podium, hotels,
            steel-joist commercial floors, and modular construction. Direct
            from manufacturing in Costa Rica with the complete US compliance
            package: UL, ASTM, IAPMO, IBC, and California Building Code
            Chapter 7A.
          </p>

          {/* Thickness / edge profile callout strip (Plycem-style spec teaser) */}
          <p className="mt-5 inline-flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-white/85">
            <span className="rounded-full border border-white/30 px-3 py-1">20mm</span>
            <span className="rounded-full border border-white/30 px-3 py-1">22mm</span>
            <span className="rounded-full border border-white/30 px-3 py-1">25mm</span>
            <span className="rounded-full border border-white/30 px-3 py-1">30mm</span>
            <span className="text-white/70">Straight or tongue-and-groove edge</span>
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="#material-calculator"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-bluegray transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Calculate My Project →
            </Link>
            <Link
              href="/products/high-performance-subfloor"
              className="inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View Subfloor Specs
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/70">
            UL R15140 · ASTM E-136 Non-Combustible · IAPMO ER-360 · CBC
            Chapter 7A · Direct factory shipping · 3–4 week typical
            door-to-door delivery
          </p>
          {/* Cross-sell to the broader PLYCEM fiber-cement envelope without
              demoting subfloor's hero status (per the founder-locked
              subfloor-as-hero strategy in CLAUDE.md). The line is small,
              de-emphasized, and links to the FeaturedProducts section
              anchor so visitors who want the full catalog can find it
              instantly. 2026-05-19 founder request. */}
          <p className="mt-4 text-sm text-white/75">
            Plus the complete PLYCEM fiber-cement panel envelope —{' '}
            <Link
              href="#featured-products"
              className="underline decoration-white/40 underline-offset-4 hover:decoration-white hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
            >
              roof, siding, deck, façade, cement board, corrugated roof tile, and more
            </Link>
            .
          </p>

          {/* Mobile-only inline render of the panel-detail circle (2026-05-19
              founder request — image must show on phones too). On md+ the
              absolute-positioned version above takes over; below md we stack
              this inline block below the CTAs so it doesn't fight the
              headline for space. Smaller (180px) and centered to fit the
              narrow viewport gracefully. */}
          <div className="mt-10 flex flex-col items-center md:hidden">
            <div className="relative h-[180px] w-[180px]">
              <Image
                src="/images/products/panel-detail.webp"
                alt=""
                role="presentation"
                fill
                sizes="180px"
                className="rounded-full object-cover shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ring-4 ring-white/15"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-white/90">
                Tongue-and-groove edge
              </p>
              <p className="mt-1 text-[11px] text-white/70">
                20–30 mm structural panel
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
