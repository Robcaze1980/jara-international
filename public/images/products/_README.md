# Product Images — Drop Zone

Per ADR-013: VB1 photo-first product cards with brand-compliant placeholder fallback.

## Required images at launch (1 minimum, 8 ideal)

**Format:** WebP (preferred) or JPEG, sRGB
**Dimensions:** 1600×1200 (4:3 aspect)
**Max file size:** 200 KB after compression

| Filename | Product slug | Required for | Status |
|---|---|---|---|
| `panel-detail.webp` | `/products/high-performance-subfloor` | Day-1 launch (canonical product page) | ✅ Delivered |
| `corrugated-roof-tile.webp` | `/products/corrugated-roof-tile` | Hero image | ✅ Delivered 2026-05-19 |
| `corrugated-roof-tile-pallet.webp` | `/products/corrugated-roof-tile` | Detail page supporting image (pallet view) | ✅ Delivered 2026-05-19 |
| `corrugated-roof-tile-profile.webp` | `/products/corrugated-roof-tile` | Detail page supporting image (profile close-up) | ✅ Delivered 2026-05-19 |
| `roof-sheathing.webp` | `/products/roof-sheathing` | Phase 4.5 (week 1 post-launch) | ⏳ Pending |
| `deck.webp` | `/products/deck` | Phase 4.5 | ⏳ Pending |
| `exterior-hidden-joint.webp` | `/products/exterior-hidden-joint` | Phase 4.5 | ⏳ Pending |
| `exterior-cement-board.webp` | `/products/exterior-cement-board` | Phase 4.5 | ⏳ Pending |
| `fibroxton.webp` | `/products/fibroxton` | Phase 4.5 | ⏳ Pending |
| `siding-hero.webp` | `/products/siding` | Day-1 launch (4-profile parent page hero) | ✅ Delivered 2026-05-19 |
| `siding-tongue-and-groove.webp` | `/products/siding#machihembrado` | Profile grid card | ✅ Delivered 2026-05-19 |
| `siding-tongue-and-groove-alt.webp` | `/products/siding` | Specifier-detail (thickness profile) | ✅ Delivered 2026-05-19 |
| `siding-installation-cedro-stained.webp` | `/products/siding` | Architectural range — Cedro stained | ✅ Delivered 2026-05-19 |
| `siding-pallet.webp` | `/products/siding` | "How it ships" supply-chain section | ✅ Delivered 2026-05-19 |

If a product image is NOT delivered by launch, the card uses `_placeholder.svg` (navy gradient + product name overlay) — **layout never changes**, only the image swaps.

## AI prompt direction per product

### High Performance Subfloor
- Stacked gray fiber-cement panels in warehouse OR installed subfloor on steel/wood joists, mid-construction
- Show panel thickness profile if possible

### Roof Sheathing
- Roof construction with gray fiber-cement boards being installed
- Workers visible in safety harnesses (architectural distance, not close-up)

### Deck
- Outdoor terrace with fiber-cement plank deck
- Wood-look but clearly cement texture
- Daylight, neutral tones

### Exterior Hidden Joint
- Modern building facade with monolithic panel finish (no visible joints)
- Architectural exterior shot, neutral lighting

### Exterior Cement Board
- Wall system with cement board + basecoat application visible
- Construction-in-progress feel

### Fibroxton
- Cladding panels on modern facade
- Tapered edge detail visible if possible

### Corrugated Roof Tile (Eureka Sevillana)
- See [[plycem-roof-tile-visual-spec]] memory for the locked master prompt and 3 reference images
- Hero (`corrugated-roof-tile.webp`): Bay Area / California Mission Revival home with Plycem orange-terracotta tile roof — white stucco, black-framed windows, olive trees, lavender, stone pavers, blue sky
- Pallet (`corrugated-roof-tile-pallet.webp`): clean 3D-render product shot, orange tiles with ~20% burgundy accents on wooden pallet
- Profile (`corrugated-roof-tile-profile.webp`): 4-tile close-up showing the color blend and barrel profile
- Color spec: primary #D85A2E orange terracotta, accent #7A2E22 burgundy-brown; never striped, accents scattered randomly as full tiles
- Cert caveat: this SKU lacks UL Class A; do NOT use imagery that implies California WUI fire-zone spec compliance — keep messaging architectural/aspirational

## Brand alignment (per JARA brand §22)

- Architectural, clean, material-focused
- Real products in their actual manufactured colors (terracotta roof tiles, olive-green panels, etc. are all on-brand when they represent the real product)
- Real but not cluttered
- NOT overly dramatic

**Note (2026-05-19):** Founder removed the prior "neutral colors only / no orange-red-green-yellow" restriction. JARA's brand-color palette (navy/steel/bluegray) applies to UI chrome, not to product photography. Product imagery must show products as they actually look — color is integral to many SKUs (e.g. corrugated-roof-tile comes in Cerámico, Ladrillo, Naranja, Ocre Otoño, Rojo Teja, Verde Aceituna).
