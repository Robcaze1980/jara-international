import { SITE } from '@/lib/site';

/**
 * Sprint 1 smoke test home page.
 * Validates: RSC rendering, brand tokens, typography, hreflang, canonical.
 * Will be replaced in Sprint 2 with full hero + calculator + product grid (per ADR-005, ADR-010, ADR-013).
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-bg-soft">
      {/* Sprint 1 placeholder hero — will be replaced with VA1 full-bleed hero in Sprint 2 */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <p className="text-sm font-medium tracking-wider text-bluegray uppercase">
            B2B Construction Materials Distribution
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl text-balance">
            {SITE.tagline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bluegray">
            Premium fiber-cement panels supplied for US contractors, architects, developers, and distributors. UL R15140 classified · ASTM C1186 Type A Grade I · In stock Long Beach, CA.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#"
              className="inline-flex items-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-navy hover:bg-bluegray transition-colors"
            >
              Request a Quote
            </a>
            <a
              href="#"
              className="inline-flex items-center rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
            >
              View Products
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-24">
        <div className="rounded-lg border border-bluegray bg-white p-6 shadow-sm">
          <h2 className="font-display text-2xl font-bold text-navy">Sprint 1 Smoke Test ✓</h2>
          <p className="mt-3 text-ink leading-relaxed">
            This page validates Phase 1 constraint <strong>C5</strong>: Next.js 16 + Tailwind 3.4 + JARA brand tokens (navy <code className="rounded bg-bg-soft px-1.5 py-0.5 text-sm">#062B49</code>, Montserrat display, Inter body) render correctly on Cloudflare Pages.
          </p>
          <ul className="mt-4 space-y-1 text-sm text-steel">
            <li>✓ Server-rendered (RSC) — no client-side hydration of static content</li>
            <li>✓ JSON-LD Organization + LocalBusiness in &lt;head&gt; (per ADR-014)</li>
            <li>✓ hreflang en-US / es-US / x-default (per F1.R3)</li>
            <li>✓ Self-referencing canonical (per Round 3 GLM finding)</li>
            <li>✓ Open Graph + Twitter Card meta (per Round 3 GLM finding)</li>
            <li>✓ robots meta with max-snippet/image/video preview (per ADR-015)</li>
          </ul>
          <p className="mt-4 text-sm text-steel">
            Sprint 2 replaces this with the full home: hero with user-supplied photo, material calculator, featured products, sticky bottom bar.
          </p>
        </div>
      </section>
    </div>
  );
}
