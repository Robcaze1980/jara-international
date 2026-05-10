# Hero Images — Drop Zone

User-supplied AI-generated hero images go here.

## Active hero (homepage)

**Filename:** `hero-home.webp` (preferred) or `hero-home.jpg`
**Dimensions:** 2400×1200 (16:8 aspect, full-bleed safe)
**Max file size:** 250 KB after compression
**Color profile:** sRGB

When you drop `hero-home.webp` here, replace the import in `app/page.tsx`:
```tsx
// Before (Sprint 1 placeholder):
src="/images/hero/_placeholder-hero.svg"

// After (your image):
src="/images/hero/hero-home.webp"
```

## AI prompt direction (JARA brand-aligned)

When generating with Midjourney / Imagen / Flux / etc., aim for:

**STYLE:**
- Architectural, clean, professional, premium B2B
- Material-focused (fiber-cement panels, construction sites, modern building facades)
- Real but not cluttered (per JARA brand guide §22)
- Cinematic but restrained — NOT overly dramatic

**SUBJECT (best options):**
- Modern multifamily/commercial building with fiber-cement panel facade
- Close-up texture of stacked panels in warehouse
- Architects/contractors reviewing plans on a clean construction site
- Aerial of construction site with panels in mid-installation

**COLOR DIRECTION:**
- Neutral palette that works under JARA navy `#062B49` overlay
- Avoid: bright orange, red, green, yellow tones (JARA brand §12 forbidden)
- Avoid: warm sunsets that fight the navy overlay
- Prefer: cool grays, concrete tones, steel-blue skies, overcast lighting

**AVOID (per JARA brand guide §22):**
- Low-quality jobsite photos
- Cluttered warehouse images
- Generic handshake shots
- Fake international trade / globe imagery
- Overly dramatic construction (explosions of dust, dramatic angles)

## Other hero variations (Sprint 4.5+ rollouts)

Future hero images for product detail pages and landing pages:
- `hero-products.webp` — /products listing page
- `hero-subfloor.webp` — subfloor product detail
- `hero-cladding.webp` — exterior hidden joint product detail
- `hero-services.webp` — service-areas page
- `hero-resources.webp` — resources hub
- `hero-es.webp` — Spanish landing page
