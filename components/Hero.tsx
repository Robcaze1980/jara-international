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
 * Solution: SVG placeholder is small (~3KB), inlined intrinsic dimensions,
 * `priority` flag set on <Image> to preload.
 *
 * 2026-05-16 positioning correction: body copy no longer claims a Long Beach
 * warehouse. JARA supplies via direct factory shipping from Plycem plants in
 * Costa Rica, El Salvador, and Honduras with 3–4 week typical door-to-door
 * delivery. Supersedes the warehouse portion of ADR-017.
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
            Premium Fiber-Cement Panel Distribution · United States
          </p>
          <h1
            id="hero-heading"
            className="mt-4 font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl text-balance"
            style={{ textShadow: '0 2px 8px rgba(4, 35, 61, 0.5)' }}
          >
            Non-Combustible Fiber-Cement Panels for Type I &amp; II Construction
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/90 md:text-xl">
            We distribute the full PLYCEM product line — subfloor, roof
            sheathing, deck, exterior cladding, cement board, and fibroxton —
            sourced direct from manufacturing plants in Costa Rica, El
            Salvador, and Honduras to contractors, architects, and developers
            across the United States.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="#material-calculator"
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-sm font-semibold text-navy hover:bg-bluegray transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Estimate My Project →
            </Link>
            <Link
              href="#featured-products"
              className="inline-flex items-center justify-center rounded-md border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View Products
            </Link>
          </div>
          <p className="mt-6 text-xs text-white/70">
            UL R15140 · ASTM C1186 Type A Grade I · IAPMO ER-360 · Direct
            factory shipping · 3–4 week typical door-to-door delivery
          </p>
        </div>
      </div>
    </section>
  );
}
