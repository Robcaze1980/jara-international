/**
 * Product catalog — single source of truth.
 * Derived from 10 Plycem PDFs (Phase 0.5 audit).
 * Used by: product detail pages, /products listing, /api/llm-context, JSON-LD schemas, sitemap.
 *
 * Round 8 PB1 extension (2026-05-11): added `faqs[]` (3-5 hand-authored items per
 * product, used by ProductFAQ component + faqSchema()) and optional `image?` field
 * (slot for AI-generated product photo; falls back to `_placeholder.svg`).
 */

export type ComplianceCert = {
  standard: string;
  detail: string;
  /**
   * R13-F7: ISO-8601 expiration date for time-bound evaluation reports
   * (e.g. IAPMO ER-360 expires 2026-07-31). Surfaced in productSchema()
   * additionalProperty as `validThrough` so AI extractors can warn on
   * stale citations.
   */
  validThrough?: string;
};

export type ProductVariant = {
  thicknessMm: number;
  thicknessImperial: string;
  widthMm: number;
  lengthMm: number;
  weightKg: number;
  weightLbs: number;
  sku: string;
  edgeProfile?: 'straight' | 'tongue-and-groove';
  panelsPerPallet?: number;
};

export type ProductFaq = {
  question: string;
  answer: string;
};

/**
 * Optional sub-profile descriptor (used by /products/siding to render the
 * 4-profile selector: Traslapado, Machihembrado, Victoriano, Tablilla).
 * For products that have a single profile this field stays undefined.
 */
export type ProductProfile = {
  /** English profile name shown in the H3 (e.g. "Lap") */
  name: string;
  /** Spanish proprietary name preserved (e.g. "Traslapado") */
  spanishName: string;
  /** Anchor slug used for deep-linking (#traslapado, etc.) */
  anchor: string;
  /** Short positioning sentence rendered below the name */
  positioning: string;
  /** Body paragraph with the architectural use-case */
  description: string;
  /** Inline dimension copy ("247–307 mm × 2438 mm · 8–14 mm thick") */
  dimensions: string;
  /** Optional close-up image; falls back to text-only when undefined */
  image?: string;
  /** Optional differentiator badge (e.g. "No HardiePlank equivalent") */
  badge?: string;
};

export type Product = {
  slug: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  applications: string[];
  variants: ProductVariant[];
  density: { min: number; max: number; unit: string };
  flexuralStrengthMin: { value: number; unit: string };
  compliance: ComplianceCert[];
  /** Plycem manufacturer (for ADR-006 text-only attribution) */
  manufacturer: 'Plycem';
  /** 3-5 hand-authored FAQ items per product (Round 8 PB1) */
  faqs: ProductFaq[];
  /** Optional AI-generated hero image path; falls back to placeholder when undefined */
  image?: string;
  /** Optional supporting gallery images rendered below the hero on the detail page */
  images?: { src: string; alt: string; caption?: string }[];
  /** Optional sub-profile lineup (multi-profile products like Siding) */
  profiles?: ProductProfile[];
  /** Optional second architectural-context image for the "range" section */
  installationImage?: { src: string; alt: string; caption?: string };
  /** Optional palletized shipment image for the "How it ships" section */
  palletImage?: { src: string; alt: string; caption?: string };
};

export const PRODUCTS: Product[] = [
  {
    slug: 'high-performance-subfloor',
    name: 'High Performance Subfloor',
    image: '/images/products/panel-detail.webp',
    shortDescription:
      'Non-combustible fiber-cement structural panels for fire-rated floor assemblies in Type I and II construction.',
    longDescription:
      'Plycem High Performance Subfloor is a UL R15140 classified fiber-cement structural panel for use in 1-hour and 2-hour fire-rated floor/ceiling assemblies. Manufactured in Costa Rica, El Salvador, and Honduras under ISO 9001/14001/45001 quality systems. Suitable for multifamily wood-frame over podium, commercial steel-joist floors, hotels, and modular construction.',
    applications: [
      'Multifamily residential (Type V over podium)',
      'Commercial steel-joist floors',
      'Hotels and hospitality',
      'Modular and prefab construction',
    ],
    variants: [
      { thicknessMm: 20, thicknessImperial: '13/16"', widthMm: 1219, lengthMm: 2438, weightKg: 67.88, weightLbs: 149.6, sku: '960140', edgeProfile: 'straight', panelsPerPallet: 50 },
      { thicknessMm: 20, thicknessImperial: '13/16"', widthMm: 1219, lengthMm: 2438, weightKg: 67.9, weightLbs: 149.6, sku: '972254', edgeProfile: 'tongue-and-groove', panelsPerPallet: 50 },
      { thicknessMm: 22, thicknessImperial: '7/8"', widthMm: 1219, lengthMm: 2438, weightKg: 74.67, weightLbs: 164.7, sku: '960151', edgeProfile: 'straight', panelsPerPallet: 45 },
      { thicknessMm: 22, thicknessImperial: '7/8"', widthMm: 1219, lengthMm: 2438, weightKg: 74.69, weightLbs: 164.7, sku: '971677', edgeProfile: 'tongue-and-groove', panelsPerPallet: 45 },
      { thicknessMm: 25, thicknessImperial: '1"', widthMm: 1219, lengthMm: 2438, weightKg: 84.85, weightLbs: 187.1, sku: '960159', edgeProfile: 'straight', panelsPerPallet: 40 },
      { thicknessMm: 25, thicknessImperial: '1"', widthMm: 1219, lengthMm: 2438, weightKg: 84.87, weightLbs: 187.1, sku: '971829', edgeProfile: 'tongue-and-groove', panelsPerPallet: 40 },
      { thicknessMm: 30, thicknessImperial: '1-3/16"', widthMm: 1219, lengthMm: 2438, weightKg: 101.82, weightLbs: 224.5, sku: '960162', edgeProfile: 'straight', panelsPerPallet: 35 },
    ],
    density: { min: 1.0, max: 1.2, unit: 'kg/dm³' },
    flexuralStrengthMin: { value: 7.0, unit: 'N/mm²' },
    compliance: [
      { standard: 'UL R15140', detail: 'UL Classified for fire-rated floor/ceiling assemblies (H502, H504, H511, U449, U487)' },
      { standard: 'ASTM C1186-08', detail: 'Type A, Grade I' },
      { standard: 'ISO 8336:2018', detail: 'Category A, Class 1, Level 1' },
      { standard: 'ASTM E-84', detail: 'Flame spread 0, smoke developed 0 (Class A)' },
      { standard: 'ASTM E-136', detail: 'Non-combustible' },
      { standard: 'IBC 2021', detail: 'Type I/II construction (§602, §711, §803, Table 601)' },
      { standard: 'CBC', detail: 'California Building Code Chapter 7A, §420' },
    ],
    manufacturer: 'Plycem',
    faqs: [
      {
        question: 'What fire-rated assemblies is High Performance Subfloor classified for?',
        answer:
          'UL R15140 Classified for use in 1-hour and 2-hour fire-rated floor/ceiling assemblies including H502, H504, H511, U449, and U487 designs. Suitable for Type I and Type II construction per IBC 2021 §602, §711, §803, and Table 601. Ask us for the full UL Assembly directory references and approved deck/joist combinations for your specific occupancy.',
      },
      {
        question: 'Which thickness should I specify for multifamily wood-frame over podium?',
        answer:
          'The 20mm (13/16") panel is the most-specified thickness for multifamily Type V over podium construction. 22mm (7/8") and 25mm (1") are used where additional acoustic mass or longer joist spans are required. 30mm (1-3/16") is reserved for heavy-load commercial floors. We will recommend a thickness once we know your span, joist size, and live-load design.',
      },
      {
        question: 'When should I use the tongue-and-groove edge profile versus straight?',
        answer:
          'Tongue-and-groove (T&G) panels self-align during installation and reduce panel-edge deflection at joints — preferred for finished floors with thin coverings (LVT, glue-down vinyl, sheet goods). Straight-edge panels are typical when a structural floor topping or self-leveling underlayment will be poured over the subfloor. Both edge profiles share the same UL classifications.',
      },
      {
        question: 'Does this product meet California Building Code Chapter 7A wildfire requirements?',
        answer:
          'Yes. High Performance Subfloor is non-combustible per ASTM E-136 and meets ASTM E-84 Class A (flame spread 0, smoke developed 0). It is recognized under California Building Code Chapter 7A and §420 for use in Wildland-Urban Interface (WUI) construction. We can provide test reports for AHJ submittal.',
      },
      {
        question: 'How is it fastened to wood versus steel joists?',
        answer:
          'On wood joists, the panel is screwed with corrosion-resistant fasteners sized to the panel thickness — typical schedule is 6" on panel edges and 12" in the field. On steel joists, self-drilling/self-tapping screws of equivalent corrosion class are used. Full fastening schedule (screw size, embedment, edge distance) is in the technical datasheet — request a copy via the CTA below.',
      },
    ],
  },
  // Roof Sheathing (PLYCEM Base de Techo) removed 2026-05-21. The product has
  // no ICC-ES ESR / IAPMO UES ER for US roof deck use, no UL 263 fire-rated
  // roof assembly listing, and no UL 790 / ASTM E-108 exterior fire
  // classification. The prescriptive US roof deck (OSB per DOC PS 2 or
  // plywood per DOC PS 1) is called out directly in IBC Chapter 23 and is
  // what every architect specifies by default. Selling Base de Techo as a
  // structural roof deck in the US requires IBC 104.11 alternative-materials
  // approval on every project — not a viable repeat-sale position. Removed
  // from catalog rather than carry a CertGapWarning that would never close.
  // Deck (plank) — restored to catalog 2026-05-21 (founder direction,
  // reversing R15.5-Q3). The R15.5 unanimous vote to drop was driven by
  // product-market fit concerns (Trex/composite dominance, heaviness, cold
  // feel underfoot), not by a documentation gap. The Jan 2023 Plycem Deck
  // datasheet documents IDENTICAL US standards to Deck Modular (ASTM C1186
  // Type A, ASTM E-84 Class A, ISO 8336) — the real distinction between the
  // two is use case: Deck plank is structural (governed by IRC R507) so
  // every project needs IBC 104.11 alternative-materials approval from the
  // AHJ, while Deck Modular as a surface finish doesn't need an ESR at all.
  // Both products are legally sellable in the US; Modular has a cleaner
  // sales path, but Deck plank serves real niches (coastal, mountain,
  // commercial / multifamily amenity decks, industrial walkways) where
  // composite alternatives fail.
  {
    slug: 'deck',
    name: 'Deck',
    image: '/images/products/deck.webp',
    installationImage: {
      src: '/images/products/deck-installation.webp',
      alt: 'Plycem Deck installed on a luxury coastal hospitality terrace at golden hour — warm wood-tone fiber-cement planks, glass railing, gas fire feature, Pacific Ocean view',
      caption: 'Coastal California hospitality — fiber-cement deck installed for a wildfire-zone compatible terrace.',
    },
    shortDescription:
      'Fiber-cement plank system for outdoor decks and drained floors with the look and workability of wood.',
    longDescription:
      'Plycem Deck is a clip-based exterior structural plank system for terraces, outdoor walkways, and drained floors. Combines the appearance of wood with fiber-cement durability — paintable or dyeable. Maximum 40.6 cm (16") joist spacing.',
    applications: ['Outdoor decks', 'Terraces', 'Drained outdoor floors', 'Indoor walkways'],
    variants: [
      { thicknessMm: 30, thicknessImperial: '1-3/16"', widthMm: 150, lengthMm: 3657, weightKg: 20.7, weightLbs: 45.6, sku: '982315' },
      { thicknessMm: 30, thicknessImperial: '1-3/16"', widthMm: 150, lengthMm: 3657, weightKg: 20.7, weightLbs: 45.6, sku: '1323611' },
    ],
    density: { min: 1.0, max: 1.3, unit: 'kg/dm³' },
    flexuralStrengthMin: { value: 10.0, unit: 'N/mm²' },
    compliance: [
      { standard: 'ASTM C1186-08', detail: 'Type A' },
      { standard: 'ISO 8336:2018', detail: 'Category A, Class 1, Level 1' },
      { standard: 'ASTM E-84', detail: 'Flame spread 0, smoke developed 0' },
    ],
    manufacturer: 'Plycem',
    faqs: [
      {
        question: 'What is the maximum joist spacing for Plycem Deck planks?',
        answer:
          'Maximum 40.6 cm (16") on-center joist spacing. The 30mm (1-3/16") plank profile is engineered for this span under residential live-load conditions. For commercial applications with higher pedestrian loads, the design engineer should confirm joist spacing and connection details.',
      },
      {
        question: 'Can the planks be painted, stained, or dyed?',
        answer:
          'Yes — the surface accepts paint, stain, and integral dye. Many specifiers prefer dyeing for a wood-tone finish that won\'t chip or peel. Use exterior-grade coatings rated for cementitious substrates; manufacturer technical bulletins list approved coating systems.',
      },
      {
        question: 'How does the clip-based installation system work?',
        answer:
          'Planks are fastened to joists using hidden stainless-steel clips that engage grooves in the plank edges, leaving no exposed fasteners on the walking surface. This delivers a clean monolithic deck appearance and accommodates seasonal expansion/contraction without surface cracking. Clips are sold separately by the same manufacturer.',
      },
      {
        question: 'How does fiber-cement deck compare to wood or composite for moisture resistance?',
        answer:
          'Fiber-cement is dimensionally stable in wet conditions and will not rot, warp, or harbor mold like wood, and will not soften under prolonged UV exposure like some wood-plastic composites. Density is 1.0–1.3 kg/dm³ and flexural strength is 10 N/mm² minimum — superior to most wood-composite decking products.',
      },
      {
        question: 'How does this differ from Deck Modular?',
        answer:
          'Plycem Deck is a long-grain structural plank (150×3657mm) fastened to joists with hidden clips — it IS the structural floor of an outdoor deck. Plycem Deck Modular is a 300×300mm interlocking surface tile installed on top of an already-engineered substrate (concrete slab, OSB+membrane, pedestal pavers) — it is a finish, not a structural element. The same fiber-cement material, two different uses. Both share ASTM C1186 Type A and ASTM E-84 Class A. Choose plank when you are building the deck from joists up; choose Modular when you are finishing a rooftop terrace, balcony, or pool surround over an existing structural floor.',
      },
      {
        question: 'What is the US code path for fiber-cement decking?',
        answer:
          'Wood and wood-plastic composite decking are prescriptively listed in IRC R507. Fiber-cement decking is not on that prescriptive list, so installations require approval from the local Authority Having Jurisdiction (AHJ) under IBC Section 104.11 "Alternative Materials, Design and Methods of Construction." JARA provides the manufacturer\'s ASTM C1186 + ASTM E-84 documentation needed for that approval. Best fit for coastal / mountain / commercial / multifamily amenity decks where fiber-cement durability outperforms composite or wood and the project team is willing to coordinate the alternative-materials submittal.',
      },
    ],
  },
  {
    slug: 'exterior-hidden-joint',
    name: 'Exterior Hidden Joint',
    shortDescription:
      'Fiber-cement panels for monolithic-finish facade cladding with hidden joints.',
    longDescription:
      'Plycem Exterior Hidden Joint panels deliver a continuous monolithic facade finish with concealed joints, resistant to weather, insects, heat, and humidity. Available with tapered edge for premium surface finish. Installs on metal or wood structure.',
    applications: ['Exterior facade with monolithic finish', 'Interior accent walls', 'Commercial cladding'],
    variants: [
      { thicknessMm: 8, thicknessImperial: '5/16"', widthMm: 1219, lengthMm: 2438, weightKg: 28.47, weightLbs: 62.8, sku: '960018' },
      { thicknessMm: 8, thicknessImperial: '5/16"', widthMm: 1219, lengthMm: 2438, weightKg: 28.71, weightLbs: 63.3, sku: '960019' },
      { thicknessMm: 8, thicknessImperial: '5/16"', widthMm: 1200, lengthMm: 2400, weightKg: 27.59, weightLbs: 60.8, sku: '972234' },
      { thicknessMm: 10, thicknessImperial: '3/8"', widthMm: 1219, lengthMm: 2438, weightKg: 35.89, weightLbs: 79.1, sku: '960093' },
      { thicknessMm: 10, thicknessImperial: '3/8"', widthMm: 1219, lengthMm: 3048, weightKg: 44.87, weightLbs: 98.9, sku: '960096' },
      { thicknessMm: 11, thicknessImperial: '7/16"', widthMm: 1219, lengthMm: 2438, weightKg: 39.48, weightLbs: 87.0, sku: '979441' },
      { thicknessMm: 12, thicknessImperial: '15/32"', widthMm: 1219, lengthMm: 2438, weightKg: 43.17, weightLbs: 95.2, sku: '979422' },
      { thicknessMm: 14, thicknessImperial: '9/16"', widthMm: 1219, lengthMm: 2438, weightKg: 50.37, weightLbs: 111.0, sku: '979423' },
    ],
    density: { min: 1.08, max: 1.18, unit: 'kg/dm³' },
    flexuralStrengthMin: { value: 7.0, unit: 'N/mm²' },
    compliance: [
      { standard: 'ASTM C1186-08', detail: 'Type A, Grade I' },
      { standard: 'ISO 8336:2018', detail: 'Category A, Class 1, Level 1' },
      { standard: 'ASTM E-84', detail: 'Flame spread 0, smoke developed 0' },
    ],
    manufacturer: 'Plycem',
    faqs: [
      {
        question: 'When should I use a tapered edge versus a straight edge?',
        answer:
          'Tapered edge is specified for monolithic facade finishes where seams are filled with joint compound and feathered out for a continuous wall appearance. Straight edge is acceptable when the joint detail is intentionally visible (reveal-joint design). Both edge profiles share the same ASTM C1186 Type A Grade I classification.',
      },
      {
        question: 'What is the difference between this product and Exterior Cement Board?',
        answer:
          'Exterior Hidden Joint is a fiber-cement panel optimized for monolithic facade finishes with concealed joints — it ships with smooth surfaces ready to receive primer + paint or finish coatings. Exterior Cement Board is a Portland-cement panel reinforced with fiber-glass mesh on both faces, engineered for basecoat-and-skim wall systems (similar to plaster substrates). Choose Hidden Joint for paint-grade facades and Cement Board for stucco/basecoat systems.',
      },
      {
        question: 'What thicknesses are available and how do I select?',
        answer:
          'Eight variants span 8mm (5/16") through 14mm (9/16"). Thinner panels (8–10mm) are typical for interior accent walls and weight-sensitive applications. Mid-range (11–12mm) is the most-specified for exterior cladding. The 14mm variant is selected for high-impact zones, taller wall heights, or where additional stiffness is required. Width is consistently 1219mm (4 ft); lengths run 2438mm (8 ft) or 3048mm (10 ft).',
      },
      {
        question: 'Can it be installed on metal-stud or wood-stud framing?',
        answer:
          'Yes — both. Fastener type and spacing differ between metal and wood substrates; refer to the manufacturer fastening schedule (available on request) for screw size, edge distance, and panel-to-panel joint detail. The panel is suitable for ventilated rainscreen assemblies and direct-applied systems alike.',
      },
    ],
  },
  // R15-Q1 cleanup (2026-05-21, 4/4 unanimous consensus): the prior compliance
  // array listed IAPMO ER-360, ICC IBC/IRC 2015/2012, ASTM E-84, ASTM E-136,
  // and NFPA 285 — none of which appear on PLYCEM's June 2024 Microconcreto
  // Exterior technical datasheet. The datasheet lists only Costa Rica RTCR
  // 491:2017, INTE/ISO 8336:2018, and a Chilean NCh1914 non-combustibility
  // note with manufacturer-claimed equivalence to ASTM E-136/E-84. Until
  // PLYCEM provides written confirmation of the US-specific certs (see
  // docs/plycem-cert-verification-email.md sent 2026-05-21), this entry
  // surfaces only what the datasheet substantiates. Re-add the stripped
  // claims in a single commit if PLYCEM confirms.
  // 2026-05-21 second cleanup pass: PLYCEM's product page (plycem.com)
  // explicitly positions Microconcreto Exterior as a RESIDENTIAL remodel +
  // expansion product, not a commercial substrate. Verbatim manufacturer
  // copy: "diseñado para usarse en paredes y fachadas externas de obras
  // residenciales" and "se adapta a las necesidades de remodelación y
  // ampliación de proyectos residenciales." The prior site copy positioned
  // this product against commercial competitors (DensGlass Gold, DuRock,
  // PermaBase) — that was overreach. The stripped US claims (IAPMO ER-360,
  // NFPA 285, ICC IBC) are not part of the manufacturer's positioning at
  // all; they were likely assigned to this product in error.
  {
    slug: 'exterior-cement-board',
    name: 'Exterior Cement Board',
    image: '/images/products/exterior-cement-board.jpg',
    shortDescription:
      'Residential cement-board panel with double fiber-glass mesh reinforcement for monolithic remodel/expansion facades with basecoat finish.',
    longDescription:
      'PLYCEM Exterior Cement Board (manufacturer name: Microconcreto Exterior) is a Portland cement panel reinforced with double fiber-glass mesh — one mesh layer embedded on each face. PLYCEM positions this product specifically for residential remodeling and addition projects: exterior walls and facades where a monolithic basecoat / stucco finish is desired. Single thickness 12mm. Ships on standard residential-job pallets direct from PLYCEM manufacturing in Costa Rica, El Salvador, and Honduras.',
    applications: [
      'Residential exterior facade remodel + additions',
      'Residential facade refinishing over existing wood / CMU substrate',
      'Residential interior wet areas (bathrooms, kitchens, laundry)',
      'Residential soffit cladding',
    ],
    variants: [
      { thicknessMm: 12, thicknessImperial: '15/32"', widthMm: 1220, lengthMm: 2440, weightKg: 46, weightLbs: 101.4, sku: '1323827' },
    ],
    density: { min: 1.0, max: 1.4, unit: 'g/cm³' },
    flexuralStrengthMin: { value: 7.0, unit: 'MPa (equilibrium)' },
    compliance: [
      { standard: 'INTE/ISO 8336:2018', detail: 'International fiber-cement standard' },
      { standard: 'RTCR 491:2017', detail: 'Costa Rica National Technical Regulation' },
      { standard: 'NCh1914/1.Of84', detail: 'Chilean non-combustibility test — manufacturer-claimed equivalence to ASTM E-136 / E-84 (not independently certified for US market; residential positioning does not require US fire-rated commercial cert)' },
      { standard: 'ISO 9001:2015 / 14001:2015 / 45001:2018', detail: 'Manufacturing certified (Costa Rica, El Salvador, Honduras plants)' },
    ],
    manufacturer: 'Plycem',
    faqs: [
      {
        question: 'Is this product positioned for commercial Type I/II construction?',
        answer:
          'No. PLYCEM positions Microconcreto Exterior specifically for residential projects — exterior remodel and addition facades, residential interior wet areas, and residential soffit cladding. It is NOT positioned by the manufacturer for commercial Type I/II construction, NFPA 285 wall assemblies, or buildings above 40 ft. For commercial fiber-cement substrate needs, US-market specifiers typically use products with documented ICC-ES ESR or NFPA 285 assembly listings (DensGlass Gold, DuRock, PermaBase, James Hardie HardieBacker) — those are different competitive categories.',
      },
      {
        question: 'What about US code compliance for residential use?',
        answer:
          'For one-family and two-family dwelling exterior facade work under the IRC residential code path, the Authority Having Jurisdiction typically reviews manufacturer ASTM C1186 / ISO 8336 documentation and approves under alternative-materials provisions. PLYCEM\'s June 2024 datasheet does not list a US-accredited ASTM lab report, ICC-ES ESR, or IAPMO ER for this product — it lists Costa Rica RTCR 491:2017, INTE/ISO 8336:2018, and a Chilean NCh1914 non-combustibility note. Contact JARA for current verification status before specifying; if your AHJ requires a US-issued evaluation report, this product is not a match for your project.',
      },
      {
        question: 'How is basecoat or stucco applied to the panel?',
        answer:
          'The double fiber-glass mesh embedded on both faces of the panel provides a mechanical key for direct-applied basecoats, fiber-reinforced stucco systems, and acrylic finishes. For residential remodel and addition work, most one-component or two-component basecoat / acrylic stucco systems will adhere directly to the meshed face. Confirm specific compatibility with the finish manufacturer\'s technical specifications and with your local AHJ inspector.',
      },
      {
        question: 'Where is it typically used inside the building?',
        answer:
          'Residential interior applications include wet areas (bathrooms, kitchens, laundry rooms) where the panel\'s humidity resistance outperforms gypsum wallboard, and soffit cladding. For commercial wet areas (locker rooms, high-impact corridors, healthcare wet walls), US specifiers typically use a substrate with documented commercial ratings — this product is not positioned for that segment.',
      },
    ],
  },
  // Fibroxton (slug: 'fibroxton') removed 2026-05-21 per Round 15 Q2 (4/4
  // unanimous voter consensus). The product carried only Chilean NCh1914 +
  // ISO 9001/14001/45001 manufacturing certs — no ASTM C1186 even claimed,
  // no ICC, no IAPMO, no IBC alternative-materials recognition. Weakest
  // compliance dossier in the catalog. Differentiator vs Exterior Hidden
  // Joint ("wood-fiber blend gives different texture") is insufficient for
  // US specifiers who require code compliance on the HardiePanel / Allura /
  // Cembrit / Equitone / Nichiha shelf. Same playbook as Roof Sheathing:
  // 301 redirect added in next.config.mjs.
  {
    slug: 'deck-modular',
    name: 'Deck Modular',
    image: '/images/products/deck-modular.webp',
    shortDescription:
      'Interlocking fiber-cement floor tiles (30×30 cm) for outdoor terraces, balconies, and rooftop decks. Tool-free installation.',
    longDescription:
      'Plycem Deck Modular is a 300×300×14mm interlocking fiber-cement tile system for outdoor floors. Tiles snap together without tools, fasteners, or adhesive — ideal for terraces, balconies, rooftop decks, and gardens where a removable, replaceable surface is preferred over a permanent plank deck. Available in graphite ("GRAF") or wood-look ("MAD") textures. Manufactured at Plycem facilities in Costa Rica, El Salvador, and Honduras.',
    applications: [
      'Outdoor decks',
      'Rooftop decks and balconies',
      'Outdoor terraces and patios',
      'Garden walkways and pool decks',
      'Removable architectural floor accents',
    ],
    variants: [
      { thicknessMm: 14, thicknessImperial: '9/16"', widthMm: 300, lengthMm: 300, weightKg: 9.21, weightLbs: 20.3, sku: '1330393' },
      { thicknessMm: 14, thicknessImperial: '9/16"', widthMm: 300, lengthMm: 300, weightKg: 9.21, weightLbs: 20.3, sku: '1330392' },
    ],
    density: { min: 1.0, max: 1.18, unit: 'kg/dm³' },
    flexuralStrengthMin: { value: 7.0, unit: 'N/mm²' },
    compliance: [
      { standard: 'ASTM C1186-08', detail: 'Type A, Grade I' },
      { standard: 'ISO 8336:2018', detail: 'Category A, Class 1, Level 1' },
      { standard: 'ASTM E-84', detail: 'Tested per surface burning characteristics standard' },
      { standard: 'ISO 9001:2015 / 14001:2015 / 45001:2018', detail: 'Manufacturing certified (Costa Rica, El Salvador, Honduras plants)' },
    ],
    manufacturer: 'Plycem',
    faqs: [
      {
        question: 'How does this differ from the standard Plycem Deck plank product?',
        answer:
          'Plycem Deck (plank) is a 150×3657mm long-grain plank fastened to joists with hidden clips — a permanent fiber-cement plank-deck system. Deck Modular is a 300×300mm tile that interlocks without fasteners — ideal when you need a removable surface (rooftop terrace where you may need under-floor access) or a fast-install pattern floor over an existing flat surface like a concrete slab. Both share ASTM C1186 fiber-cement durability.',
      },
      {
        question: 'Do I need adhesive or fasteners to install Deck Modular tiles?',
        answer:
          'No. The interlocking edge engages adjacent tiles mechanically; the assembly is held in place by its own weight (9.21 kg per tile) and the perimeter constraints of the deck area. For high-wind rooftop installations or pool surrounds, perimeter edge fixing or weighted border tiles are recommended — consult our technical team for the specific anchoring detail.',
      },
      {
        question: 'Can I remove individual tiles for under-deck access?',
        answer:
          'Yes — that is a key advantage of the modular system. Individual tiles can be lifted to access waterproofing membranes, drains, or services below. This makes Deck Modular well-suited for rooftop terraces above occupied spaces where maintenance access matters, where a permanent plank deck would require destructive removal.',
      },
      {
        question: 'How does fiber-cement modular compare to plastic interlocking deck tiles?',
        answer:
          'Plastic modular tiles (Trex, IKEA Runnen, polypropylene grids, etc.) are lighter and cheaper but degrade under UV exposure and do not carry the load or long-term weather resistance of fiber-cement. Plycem Deck Modular delivers wood-look or graphite aesthetics with the long-term durability of cementitious material — will not warp, soften, or fade like polymer tiles.',
      },
    ],
  },
  {
    slug: 'siding',
    name: 'Plycem Siding',
    image: '/images/products/siding-hero.webp',
    installationImage: {
      src: '/images/products/siding-installation-cedro-stained.webp',
      alt: 'Modern mountain residence corner with Plycem Siding in Cedro wood-grain finish stained in warm cedar tone, dark stone wainscot, dark-framed window',
      caption: 'Cedro wood-grain finish in cedar stain — Pacific Northwest / mountain modern residential context.',
    },
    palletImage: {
      src: '/images/products/siding-pallet.webp',
      alt: 'Plycem Siding planks stacked on shipping pallet, ready for direct factory freight from Costa Rica, El Salvador, or Honduras',
      caption: 'Direct factory shipment — typical door-to-door delivery 3–4 weeks. No US warehouse markup.',
    },
    profiles: [
      {
        name: 'Lap',
        spanishName: 'Traslapado',
        anchor: 'traslapado',
        positioning: 'The workhorse exterior profile.',
        description:
          'Each plank overlaps the one below, creating the classic horizontal shadow line found on American residential architecture from coast to coast. The direct equivalent of James Hardie HardiePlank, in 8 mm to 14 mm thicknesses for projects that need a thinner or thicker substrate. Specified across Bay Area Craftsman, New England Coastal, Pacific Northwest modern, and Charleston/Garden District restoration work.',
        dimensions: '247–307 mm wide · 2438 mm long · 8 / 10 / 11 / 14 mm thick',
      },
      {
        name: 'Tongue-and-Groove',
        spanishName: 'Machihembrado',
        anchor: 'machihembrado',
        positioning: 'Hidden-fastener flush wall plane.',
        description:
          'Tongue-and-groove edges enable concealed fastening for a clean uninterrupted wall surface — preferred for modern minimalist architecture and for interior accent walls, ceilings, and soffits where exposed fasteners would compromise the design. The only profile in the family suitable for both exterior cladding AND interior architectural finishes.',
        dimensions: '247–307 mm wide · 2438 mm long · 14 mm thick',
        image: '/images/products/siding-tongue-and-groove.webp',
      },
      {
        name: 'Victorian',
        spanishName: 'Victoriano',
        anchor: 'victoriano',
        positioning: 'Historic restoration profile — no HardiePlank equivalent.',
        description:
          'Decorative channel-cut profile creating a double-shadow line at every plank seam — the visual signature of historic Victorian and Edwardian wood siding. The only profile in the Plycem family with no direct James Hardie equivalent, making it the specification of choice for historic restoration in Charleston, Savannah, New Orleans Garden District, and the San Francisco Painted Ladies. Narrower 185–207 mm width matches the visual rhythm of original Victorian-era lumber.',
        dimensions: '185–207 mm wide · 2438 mm long · 11 mm thick',
        badge: 'No HardiePlank equivalent',
      },
      {
        name: 'Slat',
        spanishName: 'Tablilla',
        anchor: 'tablilla',
        positioning: 'Narrow-strip accent profile.',
        description:
          'Narrow 200 mm slat profile for accent walls, eave soffits, and vertical-strip modern applications. The high-rhythm visual line is distinct from the broader lap profiles — specified when fine detail matters and when the wall composition benefits from a denser, more articulated shadow pattern.',
        dimensions: '200 mm wide · 2438 mm long · 10 mm thick',
      },
    ],
    shortDescription:
      'Fiber-cement plank siding in four architectural profiles — Lap, Tongue-and-Groove, Victorian, and Slat. Wood look without the wood. Specified for exterior cladding and interior accent walls.',
    longDescription:
      'Plycem Siding is the complete fiber-cement plank siding family — four distinct architectural profiles (Traslapado / Lap, Machihembrado / Tongue-and-Groove, Victoriano / Victorian, Tablilla / Slat) manufactured at Plycem facilities in Costa Rica, El Salvador, and Honduras. The substrate is non-combustible fiber-cement; the face accepts smooth Clásico or wood-grain Cedro texture in any exterior-grade paint or stain. Specified across Bay Area residential, Pacific Northwest modern, mountain contemporary, and historic restoration projects. The wood look architects and designers prefer, with the durability and fire resistance of cement.',
    applications: [
      'Exterior facade cladding (residential and light commercial)',
      'Interior architectural accent walls',
      'Ceiling and soffit applications',
      'Eaves and porch ceilings',
      'Historic restoration (Victoriano profile)',
      'Modern flush-wall design (Machihembrado profile)',
      'Vertical strip / accent wall (Tablilla profile)',
    ],
    variants: [
      { thicknessMm: 8, thicknessImperial: '5/16"', widthMm: 247, lengthMm: 2438, weightKg: 6.6, weightLbs: 14.6, sku: 'TRA-8-247', edgeProfile: 'straight' },
      { thicknessMm: 10, thicknessImperial: '3/8"', widthMm: 247, lengthMm: 2438, weightKg: 8.2, weightLbs: 18.1, sku: 'TRA-10-247', edgeProfile: 'straight' },
      { thicknessMm: 11, thicknessImperial: '7/16"', widthMm: 307, lengthMm: 2438, weightKg: 11.2, weightLbs: 24.7, sku: 'TRA-11-307', edgeProfile: 'straight' },
      { thicknessMm: 14, thicknessImperial: '9/16"', widthMm: 247, lengthMm: 2438, weightKg: 11.5, weightLbs: 25.4, sku: 'TRA-14-247', edgeProfile: 'straight' },
      { thicknessMm: 14, thicknessImperial: '9/16"', widthMm: 307, lengthMm: 2438, weightKg: 14.3, weightLbs: 31.5, sku: 'TRA-14-307', edgeProfile: 'straight' },
      { thicknessMm: 14, thicknessImperial: '9/16"', widthMm: 247, lengthMm: 2438, weightKg: 11.5, weightLbs: 25.4, sku: '960190', edgeProfile: 'tongue-and-groove', panelsPerPallet: 5 },
      { thicknessMm: 14, thicknessImperial: '9/16"', widthMm: 307, lengthMm: 2438, weightKg: 14.3, weightLbs: 31.5, sku: '960199', edgeProfile: 'tongue-and-groove', panelsPerPallet: 4 },
      { thicknessMm: 11, thicknessImperial: '7/16"', widthMm: 185, lengthMm: 2438, weightKg: 5.4, weightLbs: 11.9, sku: 'VIC-11-185', edgeProfile: 'straight' },
      { thicknessMm: 11, thicknessImperial: '7/16"', widthMm: 207, lengthMm: 2438, weightKg: 6.0, weightLbs: 13.2, sku: 'VIC-11-207', edgeProfile: 'straight' },
      { thicknessMm: 10, thicknessImperial: '3/8"', widthMm: 200, lengthMm: 2438, weightKg: 5.3, weightLbs: 11.7, sku: 'TAB-10-200', edgeProfile: 'straight' },
    ],
    density: { min: 1.0, max: 1.18, unit: 'kg/dm³' },
    flexuralStrengthMin: { value: 7.0, unit: 'N/mm²' },
    compliance: [
      { standard: 'ASTM C1186-08', detail: 'Type A, Grade I' },
      { standard: 'ISO 8336:2018', detail: 'Category A, Class 1, Level 1' },
      { standard: 'ASTM E-84', detail: 'Tested per surface burning characteristics standard' },
      { standard: 'ISO 9001:2015 / 14001:2015 / 45001:2018', detail: 'Manufacturing certified' },
    ],
    manufacturer: 'Plycem',
    faqs: [
      {
        question: 'Which profile do I use for what?',
        answer:
          'Lap (Traslapado) for traditional exterior cladding — the everyday choice that matches American residential architecture from coast to coast. Tongue-and-Groove (Machihembrado) for hidden-fastener walls and the only profile suitable for interior accent walls and ceilings. Victorian (Victoriano) for historic restoration projects where the channel-cut profile is the architectural signature. Slat (Tablilla) for narrow-strip accent walls and soffits where fine visual rhythm matters.',
      },
      {
        question: 'What is the difference between "Clásico" and "Cedro" finish?',
        answer:
          '"Clásico" is a smooth or lightly textured face suitable for any paint or solid stain application. "Cedro" has an integral wood-grain texture mimicking stained cedar plank — ideal when a natural-wood aesthetic is desired without the maintenance burden of real cedar. Both share the identical fiber-cement substrate and accept exterior-grade paints, stains, and integral dyes. The two installation references on this page show the same product family in two finishes: white Clásico-painted (Bay Area Craftsman) and warm cedar-stained Cedro (mountain modern).',
      },
      {
        question: 'How does this compare to James Hardie HardiePlank?',
        answer:
          'Both are ASTM C1186 fiber-cement plank siding. HardiePlank carries a current ICC-ES Evaluation Service Report (ESR-2290) that documents specific assembly testing for US building codes — important for insurance-driven specs and larger commercial work. Plycem Siding is certified to ASTM C1186 + ISO 8336 without an equivalent US ESR; AHJ acceptance of ASTM documentation directly is sufficient for residential and light commercial. Where Plycem outperforms: four architectural profiles in one product family vs HardiePlank\'s lap-only offering (Victoriano has no Hardie equivalent), interior-suitable T&G profile, and direct factory shipping without distributor markup. For residential, light commercial, and historic-restoration projects, the choice is profile range and supply chain economics; for large commercial with strict ESR requirements, HardiePlank is the safer spec.',
      },
      {
        question: 'Can it be used for interior applications?',
        answer:
          'Yes — this is one of Plycem Siding\'s structural advantages over James Hardie, which is positioned strictly as exterior cladding. The Machihembrado (T&G) profile especially is suitable for interior accent walls, ceilings, and decorative paneling. The fiber-cement substrate is moisture- and pest-resistant, doesn\'t off-gas like wood composites, and accepts interior or exterior paint systems. Use Tablilla for narrow-strip interior accent walls where the visual rhythm should be tighter.',
      },
      {
        question: 'Can I paint or stain it?',
        answer:
          'Yes — and both Clásico and Cedro finishes accept any exterior-grade paint or stain in any color. The Cedro wood-grain texture is integral to the panel; the color is the project\'s choice. The two installation references on this page demonstrate the range: the same product family painted crisp white for Bay Area Craftsman residential, and stained warm cedar for mountain-modern contemporary. Specify the paint or stain system based on the project, not the substrate.',
      },
      {
        question: 'How does it ship and how long does delivery take?',
        answer:
          'Plycem Siding ships palletized direct from manufacturing facilities in Costa Rica, El Salvador, or Honduras. Typical timeline is 3–4 weeks door-to-door: factory → ocean freight → US port of entry → customs clearance → trucking to jobsite. JARA coordinates the full chain. There is no US warehouse — pricing reflects direct factory economics without mid-supply-chain stocking markup. Submit project sheets for delivered pricing within 48 hours.',
      },
    ],
  },
  {
    slug: 'corrugated-roof-tile',
    name: 'Corrugated Roof Tile (Eureka Sevillana)',
    image: '/images/products/corrugated-roof-tile.webp',
    images: [
      {
        src: '/images/products/corrugated-roof-tile-pallet.webp',
        alt: 'Plycem Eureka Sevillana roof tiles stacked on shipping pallet — orange terracotta with burgundy accent tiles',
        caption: 'How it ships — palletized for direct factory freight from Costa Rica, El Salvador, or Honduras',
      },
      {
        src: '/images/products/corrugated-roof-tile-profile.webp',
        alt: 'Close-up of four Plycem Eureka Sevillana tiles showing the orange and burgundy color blend and barrel profile',
        caption: 'Color blend — Rojo Teja primary with scattered burgundy accent tiles; color is integral to the panel, not a surface coating',
      },
    ],
    shortDescription:
      'Sinusoidal corrugated fiber-cement roof panel with Spanish-tile aesthetic. International / Caribbean market — NOT currently UL-classified for US Class A fire-rated roof assemblies.',
    longDescription:
      'Plycem Techos Eureka Sevillana is a sinusoidal corrugated fiber-cement roofing panel that replicates the look of traditional Spanish clay tile at lower weight (12.5 kg/m²) and cost. Manufactured under the Eternit brand within the Plycem family. Available in six architectural colors (Cerámico, Ladrillo, Naranja, Ocre Otoño, Rojo Teja, Verde Aceituna) in 1.04m and 1.34m panel lengths. Minimum roof slope 27%. IMPORTANT US-market disclosure: this product is currently certified to international and regional standards (Plycem manufacturing ISO 9001/14001/45001 + Costa Rica RTCR 491:2017 + INTE/ISO 8336:2018) and does NOT carry UL 263 or UL 790 Class A fire-rated roof classification. US installations should confirm AHJ acceptance; jurisdictions enforcing Class A fire-rated roof assemblies — notably California Chapter 7A WUI zones, Florida Miami-Dade HVHZ, and most insurance-driven specifications — will require alternative product selection.',
    applications: [
      'Residential roofing',
      'Residential roofs with Spanish-tile architectural aesthetic',
      'Caribbean, Central American, and international export markets',
      'Re-roofing where traditional clay tile weight is impractical',
      'US installations only where AHJ does not require UL Class A fire-rated roof',
    ],
    variants: [
      { thicknessMm: 5.7, thicknessImperial: '7/32"', widthMm: 920, lengthMm: 1040, weightKg: 12.0, weightLbs: 26.5, sku: '1316260' },
      { thicknessMm: 5.7, thicknessImperial: '7/32"', widthMm: 920, lengthMm: 1040, weightKg: 12.0, weightLbs: 26.5, sku: '1316168' },
      { thicknessMm: 5.7, thicknessImperial: '7/32"', widthMm: 920, lengthMm: 1340, weightKg: 15.4, weightLbs: 34.0, sku: '1315994' },
      { thicknessMm: 5.7, thicknessImperial: '7/32"', widthMm: 920, lengthMm: 1340, weightKg: 15.4, weightLbs: 34.0, sku: '1316230' },
    ],
    density: { min: 1.5, max: 1.7, unit: 'kg/dm³' },
    flexuralStrengthMin: { value: 18.0, unit: 'MPa' },
    compliance: [
      { standard: 'ISO 9001:2015 / 14001:2015 / 45001:2018', detail: 'Plycem manufacturing certified' },
      { standard: 'INTE/ISO 8336:2018', detail: 'Fiber-cement roofing standard (Category A, Class 1, Level 1)' },
      { standard: 'RTCR 491:2017', detail: 'Costa Rica National Technical Regulation' },
    ],
    manufacturer: 'Plycem',
    faqs: [
      {
        question: 'Why does this product not have a US Class A roof fire rating?',
        answer:
          'The Eureka Sevillana product family is certified to international and regional standards (ISO 8336, Costa Rica RTCR 491) without an accompanying UL 263 or UL 790 Class A roof assembly test. US roofing fire ratings require US-specific assembly testing that Plycem has not pursued for this SKU. For US projects in jurisdictions enforcing Class A roof requirements (California WUI zones, most metro fire codes, insurance-driven specs), this product cannot be specified — alternative roof products are needed. For the Caribbean and international export market where local codes apply, the product is fully approved.',
      },
      {
        question: 'What colors are available?',
        answer:
          'Six standard colors: Cerámico (clay-tone), Ladrillo (brick red), Naranja (orange), Ocre Otoño (autumn ochre), Rojo Teja (tile red), and Verde Aceituna (olive green). Color is integral to the panel — not a surface coating — so weathering and abrasion do not expose contrasting substrate. Custom colors are not available; minimum order quantities apply per color and per shipment.',
      },
      {
        question: 'What is the minimum roof slope for installation?',
        answer:
          'Minimum 27% slope (approximately 15° pitch or 3:12). Below this slope, water can travel sideways under the corrugation and bypass the lap, causing leaks. For low-slope roofs, the prescriptive US default is OSB or plywood structural sheathing with a separate waterproof membrane (modified bitumen, single-ply PVC/TPO, or built-up roofing) — a different product family entirely.',
      },
      {
        question: 'How does fiber-cement Spanish tile compare to clay tile in weight and performance?',
        answer:
          'Plycem Eureka Sevillana weighs about 12.5 kg/m² versus 40–50 kg/m² for traditional clay tile — roughly one-third the weight. This allows installation on residential framing that could not support clay tile without structural upgrades and reduces seismic mass. Aesthetic trade-offs: corrugated panels create a different shadow line than individual clay tiles up close, and panels span larger areas so the visual rhythm of "tiles" is coarser than discrete clay tile.',
      },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
