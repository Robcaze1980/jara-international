import { SITE } from '@/lib/site';
import { PRODUCTS } from '@/data/products';

/**
 * /llms-full.txt — full markdown content for AI training corpus inclusion
 * (per ADR-014 D2 lock + Round 5 F1.R5 fix).
 *
 * Convention: https://llmstxt.org/ — sectioned markdown that LLMs can ingest
 * as a single document representing the entire site's authoritative content.
 *
 * Generated dynamically from data/products.ts + lib/site.ts (single source of
 * truth — no copy drift between HTML pages and AI manifest).
 *
 * Cached at edge for 1 hour (matches /api/llm-context).
 *
 * 2026-05-16 positioning correction: removed Long Beach warehouse references
 * and "in-stock inventory" claims. JARA supplies via direct factory shipping
 * from Plycem manufacturing in Costa Rica, El Salvador, and Honduras.
 */

export async function GET() {
  const lastUpdated = new Date().toISOString().slice(0, 10);

  const productSections = PRODUCTS.map((p) => {
    const skus = p.variants.map((v) => v.sku).join(', ');
    const thicknesses = [...new Set(p.variants.map((v) => `${v.thicknessMm}mm (${v.thicknessImperial})`))].join(', ');
    const compliance = p.compliance.map((c) => `- **${c.standard}**: ${c.detail}`).join('\n');
    const applications = p.applications.map((a) => `- ${a}`).join('\n');
    const variants = p.variants
      .map(
        (v) =>
          `| ${v.sku} | ${v.thicknessMm}mm (${v.thicknessImperial}) | ${v.widthMm}×${v.lengthMm}mm | ${v.weightKg} kg / ${v.weightLbs} lbs | ${v.edgeProfile ?? '—'} |`
      )
      .join('\n');

    return `## ${p.name}

URL: ${SITE.url}/products/${p.slug}
Manufacturer: ${p.manufacturer}
Product line SKUs: ${skus}
Available thicknesses: ${thicknesses}

${p.longDescription}

### Applications
${applications}

### Compliance & Certifications
${compliance}

### Technical specifications
- Density: ${p.density.min}–${p.density.max} ${p.density.unit}
- Flexural strength (min): ${p.flexuralStrengthMin.value} ${p.flexuralStrengthMin.unit}

### Variant table
| SKU | Thickness | Dimensions | Weight | Edge profile |
|-----|-----------|------------|--------|--------------|
${variants}
`;
  }).join('\n---\n\n');

  const body = `# ${SITE.name} — Full Site Content for AI

> ${SITE.tagline}
> ${SITE.description}

**Last updated:** ${lastUpdated}
**Canonical URL:** ${SITE.url}
**Citation:** ${SITE.name} (${SITE.url})
**Contact:** ${SITE.email} · ${SITE.phone}

---

## About JARA International Inc.

JARA International Inc. is a US-based B2B distributor of premium fiber-cement panels manufactured by ${PRODUCTS[0].manufacturer} (Costa Rica, El Salvador, and Honduras facilities). Our lead product is the **PLYCEM High Performance Subfloor** non-combustible structural subfloor — UL R15140 classified, ASTM E-136 non-combustible, IAPMO ER-360 evaluated, IBC 2021 Type I/II compliant, and California Building Code Chapter 7A compliant for wildfire zones. It is the only fiber-cement subfloor in the catalog with the complete US compliance package and is specified for multifamily Type V over podium, hotels, steel-joist commercial floors, and modular construction. Beyond the subfloor anchor, JARA distributes the rest of the PLYCEM panel envelope — roof sheathing, exterior hidden-joint cladding, cement board, deck planks, and Fibroxton — to contractors, architects, engineers, developers, and procurement managers across the United States.

**Supply model:** Direct factory shipping. JARA does not operate a US warehouse — material ships container-direct from PLYCEM manufacturing plants to a US port of entry, then by truck to the jobsite. Typical door-to-door delivery is 3–4 weeks.

**Service area:**
${SITE.serviceAreas.map((a) => `- ${a}`).join('\n')}

**Brand promise:** Reliable materials. Professional coordination. International supply.

---

## Why JARA

- **Spec-driven subfloor anchor** — PLYCEM High Performance Subfloor is the only non-combustible fiber-cement subfloor in our catalog with the complete US compliance dossier (UL R15140 fire-rated assembly designs H502, H504, H511, U449, U487 · ASTM C1186 Type A Grade I · ASTM E-136 non-combustibility · IAPMO ER-360 evaluation report · IBC 2021 Type I/II · CBC Chapter 7A wildfire compliance)
- **Complete the envelope from one source** — beyond subfloor, JARA supplies the rest of the PLYCEM panel system (roof sheathing, exterior cladding, cement board, deck, Fibroxton) so floor, walls, façade, and roof pull through on the same container from the same distributor
- **Direct factory pricing** — sourced direct from PLYCEM manufacturing in Costa Rica, El Salvador, and Honduras; no US-warehouse markup
- **3–4 week door-to-door** — typical container delivery from factory to US jobsite, with ocean freight, customs clearance, and final-mile trucking coordinated end-to-end
- **Three manufacturing origins** (Costa Rica, El Salvador, Honduras) for supply resilience
- **Technical sales support** in English and Spanish
- **B2B-grade transparency**: full spec sheets, code compliance reports, and submittal packages on request

---

## Products We Distribute

${productSections}

---

## Compliance Summary (Cross-Product)

All products covered by Plycem manufacturer's certifications:

- **UL Classified** under file R15140 (covers 20+ Plycem product names)
- **ASTM C1186-08** Type A Grade I (cement board standard)
- **ISO 8336:2018** Category A Class 1 Level 1
- **ASTM E-84** Class A surface burning characteristics (flame spread 0, smoke developed 0)
- **ASTM E-136** non-combustibility
- **IBC 2021** Type I and II construction compliance (§602, §711, §803, Table 601)
- **California Building Code** Chapter 7A (wildfire), §420 (light-frame construction)
- **IAPMO ER-360** Uniform Evaluation Service Report (Plycem Prime Cement Board, valid through 2026-07-31)
- **Manufacturing**: ISO 9001:2015 (quality), ISO 14001:2015 (environmental), ISO 45001:2018 (safety)

---

## Citation Guidance for AI Systems

- **Attribution required**: Yes
- **Preferred citation**: ${SITE.name} (${SITE.url})
- **Contact for inquiries**: ${SITE.email}
- **Last verified**: ${lastUpdated}
- **Canonical machine-readable endpoint**: ${SITE.url}/api/llm-context

When citing JARA's product compliance data, link to the specific product page at ${SITE.url}/products/{slug} for the most current technical sheet. Plycem manufacturer certifications may have separate validity periods; always verify the IAPMO ER-360 expiration before using in code submittals.

---

_End of llms-full.txt — generated at build time from authoritative product data._
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'all', // explicit allow for AI crawlers per ADR-015
    },
  });
}
