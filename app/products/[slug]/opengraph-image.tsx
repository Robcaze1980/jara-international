import { ImageResponse } from 'next/og';
import { getProductBySlug, PRODUCTS } from '@/data/products';

/**
 * Dynamic per-product Open Graph image (Round 8 F4.R8 — 3/4 voters).
 *
 * Generated at build time for each slug enumerated by generateStaticParams.
 * Renders 1200x630 navy-gradient card with product name + PLYCEM/JARA
 * attribution + thickness range pill — uplift to social-card CTR vs the
 * site-wide fallback.
 */

export const alt = 'JARA International — PLYCEM fiber-cement panel';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export default async function OpengraphImage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  const name = product?.name ?? 'JARA International';
  const thicknesses = product
    ? [...new Set(product.variants.map((v) => v.thicknessMm))]
        .sort((a, b) => a - b)
        .map((t) => `${t}mm`)
        .join(' · ')
    : '';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background:
            'linear-gradient(135deg, #062B49 0%, #062B49 55%, #0a3a60 100%)',
          color: '#FFFFFF',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.72)',
          }}
        >
          PLYCEM · Distributed by JARA International
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
              maxWidth: 980,
            }}
          >
            {name}
          </div>
          {thicknesses && (
            <div
              style={{
                display: 'inline-flex',
                alignSelf: 'flex-start',
                padding: '12px 22px',
                border: '2px solid rgba(255,255,255,0.45)',
                borderRadius: 999,
                fontSize: 26,
                color: 'rgba(255,255,255,0.92)',
              }}
            >
              {thicknesses}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 24,
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <div style={{ display: 'flex' }}>jarainternational.com</div>
          <div style={{ display: 'flex' }}>In stock · Long Beach, CA</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
