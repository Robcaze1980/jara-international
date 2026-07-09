import { ImageResponse } from 'next/og';
import { PRODUCTS } from '@/data/products';
import { getFromPriceUsd, formatUsd } from '@/lib/pricing';

/**
 * OG image for /pricing (SEO audit item 34) — 1200x630 navy card that leads with
 * the subfloor from-price, so shared /pricing links surface the price hook in
 * social + chat unfurls. Price derives from lib/pricing (no drift).
 */

export const alt = 'JARA International — delivered (DDP) fiber-cement pricing';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function PricingOpengraphImage() {
  const subfloor = PRODUCTS.find((p) => p.slug === 'high-performance-subfloor');
  const from = subfloor ? getFromPriceUsd(subfloor) : undefined;

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
          background: 'linear-gradient(135deg, #062B49 0%, #062B49 55%, #0a3a60 100%)',
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
          Delivered (DDP) Pricing · JARA International
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: -1,
              maxWidth: 1000,
            }}
          >
            Non-combustible fiber-cement subfloor
          </div>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              padding: '14px 26px',
              background: 'rgba(255,255,255,0.16)',
              borderRadius: 999,
              fontSize: 34,
              fontWeight: 700,
              color: '#FFFFFF',
            }}
          >
            {from != null
              ? `From ${formatUsd(from)}/panel — delivered, duty paid`
              : 'Delivered (DDP) — duty paid'}
          </div>
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
          <div style={{ display: 'flex' }}>jarainternational.com/pricing</div>
          <div style={{ display: 'flex' }}>Full container · 3–4 wk delivery</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
