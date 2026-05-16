import Image from 'next/image';
import Link from 'next/link';

/**
 * Hero — per ADR-010 VA1 (full-bleed photo + dark navy overlay + 2 CTAs).
 *
 * Implementation per Round 5 GLM finding (WCAG AA contrast):
 * Overlay is a SOLID-TO-TRANSPARENT GRADIENT (navy 88% left → 60% right) +
 * text-shadow on H1 to guarantee AA contrast regardless of photo brightness.
 *
 * Per memory `user_provides_visuals.md`: hero image is a placeholder SVG
 * until user delivers AI-generated final at /public/images/hero/hero.{webp|jpg}.
 *
 * Per Round 6 F4.R6 / DeepSeek finding: hero placeholder must hit LCP <1.5s.
 *
 * 2026-05-16 positioning correction: body copy no longer claims a Long Beach
 * warehouse. JARA supplies via direct factory shipping from Plycem plants in
 * Costa Rica, El Salvador, and Honduras.
 *
 * 2026-05-16 subfloor-hero strategy: Hero now leads explicitly with the
 * PLYCEM Entrepiso Alto Desempeño / High Performance Subfloor product —
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
      {/* Background image (placeholder until user delivers AI hero) */}
      <Image
        src="/images/hero/_placeholder-hero.svg"
        alt=""
        role="presentation"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-50"
      />

      {/* Solid-to-transparent gradient overlay for AA contrast (Round 5 GLM finding) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-navy/90 via-navy/75 to-navy/55"
      />

      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="max-w-3xl">
          <p className="font-display text-sm font-medium uppercase tracking-wider text-bluegray">
            PLYCEM Entrepiso Alto Desempeño · Multifamily · Hotel · Type I/II Commercial
          </p>
          <h1
            id="hero-heading"
            className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl text-balance"
            style={{ textShadow: '0 2px 8px rgba(4, 35, 61, 0.5)' }}
          >
            Non-Combustible Fiber-Cement Subfloor for Multifamily and Commercial Construction
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            PLYCEM Entrepiso Alto Desempeño — the UL R15140 classified
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
        </div>
      </div>
    </section>
  );
}
