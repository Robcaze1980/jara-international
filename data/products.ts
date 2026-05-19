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
  {
    slug: 'roof-sheathing',
    name: 'Roof Sheathing',
    shortDescription:
      'Fiber-cement structural panels for roof decking and exterior facade with exposed joint.',
    longDescription:
      'Plycem Roof Sheathing supports waterproof roof coverings (asphalt shingles, asphalt mantle, PVC) and is also used for exterior facade applications with exposed joint detail. Available in two thicknesses for residential and commercial roofs.',
    applications: ['Residential roofing', 'Commercial roofing', 'Exterior facade with exposed joint'],
    variants: [
      { thicknessMm: 14, thicknessImperial: '9/16"', widthMm: 1219, lengthMm: 2438, weightKg: 47.15, weightLbs: 103.9, sku: '960102' },
      { thicknessMm: 17, thicknessImperial: '11/16"', widthMm: 1219, lengthMm: 2438, weightKg: 57.7, weightLbs: 127.2, sku: '960145' },
    ],
    density: { min: 1.0, max: 1.2, unit: 'kg/dm³' },
    flexuralStrengthMin: { value: 7.0, unit: 'N/mm²' },
    compliance: [
      { standard: 'ASTM C1186-08', detail: 'Type A, Grade I' },
      { standard: 'ISO 8336:2018', detail: 'Category A, Class 1, Level 1' },
      { standard: 'ASTM E-84', detail: 'Flame spread 0, smoke developed 0' },
    ],
    manufacturer: 'Plycem',
    faqs: [
      {
        question: 'What roof coverings can be installed over Plycem Roof Sheathing?',
        answer:
          'It supports waterproof roof coverings including asphalt shingles, asphalt-mantle systems (modified bitumen, SBS torch-down), and PVC single-ply membranes. The panel acts as the structural deck — the waterproofing layer above is selected by the roofing system designer for the specific climate and slope.',
      },
      {
        question: 'When do I specify 14mm versus 17mm thickness?',
        answer:
          '14mm (9/16") is typical for residential roof decking with rafter spacing up to 24" on-center. 17mm (11/16") is specified for commercial decks, longer spans, or where heavier-grade roof coverings are anticipated. Both thicknesses share ASTM C1186 Type A Grade I classification and ASTM E-84 Class A fire performance.',
      },
      {
        question: 'Can this panel be used for exterior facade applications?',
        answer:
          'Yes — Roof Sheathing is also approved for exterior facade with exposed-joint detail (open architectural reveal between panels). The panel is fastened to the structural framing and joints are left visible as a design feature. For closed-joint or monolithic facade finishes, specify Exterior Hidden Joint or Fibroxton instead.',
      },
      {
        question: 'Is it suitable for high-humidity or coastal environments?',
        answer:
          'Yes. Fiber-cement composition (ASTM C1186 Type A) is dimensionally stable in humid and coastal conditions where wood-based sheathing can swell, delaminate, or rot — a key reason it is specified in coastal, hurricane-prone, and high-humidity climates throughout the US and Caribbean.',
      },
    ],
  },
  {
    slug: 'deck',
    name: 'Deck',
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
  {
    slug: 'exterior-cement-board',
    name: 'Exterior Cement Board',
    shortDescription:
      'Fiber-glass-mesh-reinforced cement board for interior and exterior walls with basecoat finish.',
    longDescription:
      'Plycem Exterior Cement Board is a Portland cement panel reinforced with fiber-glass mesh on both sides, designed for monolithic wall systems with basecoat coatings. High impact and humidity resistance. IAPMO ER-360 evaluation report.',
    applications: ['Exterior wall systems', 'Interior wet areas', 'Soffit cladding'],
    variants: [
      { thicknessMm: 12, thicknessImperial: '15/32"', widthMm: 1220, lengthMm: 2440, weightKg: 46, weightLbs: 101.4, sku: '1323827' },
    ],
    density: { min: 1.0, max: 1.4, unit: 'g/cm³' },
    flexuralStrengthMin: { value: 7.0, unit: 'MPa (equilibrium)' },
    compliance: [
      { standard: 'IAPMO ER-360', detail: 'Evaluation Report', validThrough: '2026-07-31' },
      { standard: 'ICC IBC 2015/2012', detail: 'Recognized alternative material' },
      { standard: 'ICC IRC 2015/2012', detail: 'Residential code compliant' },
      { standard: 'ASTM E-84', detail: 'Flame spread 0, smoke developed ≤5 (Class A)' },
      { standard: 'ASTM E-136', detail: 'Non-combustible' },
      { standard: 'NFPA 285', detail: 'Eligible (assembly-tested for >40ft)' },
    ],
    manufacturer: 'Plycem',
    faqs: [
      {
        question: 'What does the IAPMO ER-360 evaluation report cover?',
        answer:
          'IAPMO ER-360 is the evaluation report that recognizes Plycem Exterior Cement Board as an alternative material under ICC IBC and IRC 2015/2012 codes. It documents acceptable wall-assembly designs, fastening details, and basecoat compatibility. The current ER-360 is valid through 2026-07-31; we provide it for AHJ submittal on request.',
      },
      {
        question: 'Is this product eligible for NFPA 285 wall assemblies above 40 feet?',
        answer:
          'Yes — Plycem Exterior Cement Board is eligible for use in assembly-tested NFPA 285-compliant exterior wall systems on buildings greater than 40 feet in height. Eligibility depends on the complete assembly (sheathing, WRB, insulation, exterior finish). We can confirm assembly-level NFPA 285 documentation for your specific wall buildup.',
      },
      {
        question: 'Is the panel Class A fire-rated and non-combustible?',
        answer:
          'Yes. It tests to ASTM E-84 Class A (flame spread 0, smoke developed ≤5) and is non-combustible per ASTM E-136. This makes it suitable for Type I and Type II construction and for exterior wall assemblies that must meet wildfire-region requirements.',
      },
      {
        question: 'How is basecoat or stucco applied to the panel?',
        answer:
          'The fiber-glass mesh embedded on both faces of the panel provides a mechanical key for direct-applied basecoats, fiber-reinforced stucco systems, and acrylic finishes. Most exterior insulation finish system (EIFS) and Portland-cement plaster systems list this panel category as an approved substrate. Confirm specific compatibility with the finish manufacturer\'s technical specifications.',
      },
      {
        question: 'Where is it typically used inside the building?',
        answer:
          'Interior applications include wet areas (bathrooms, kitchens, locker rooms), soffit cladding, and high-impact corridors. The panel resists humidity and water damage substantially better than gypsum wallboard, making it the preferred substrate behind tile in commercial wet environments.',
      },
    ],
  },
  {
    slug: 'fibroxton',
    name: 'Fibroxton',
    shortDescription:
      'Fiber-cement-and-wood composite panel for exterior cladding with monolithic hidden-joint finish.',
    longDescription:
      'Plycem Fibroxton combines cellulosic fibers and wood with Portland cement for exterior or interior cladding with monolithic finish. Tapered edge for high-quality surface. Manufactured at Plycem facilities in Costa Rica, El Salvador, and Honduras.',
    applications: ['Exterior facade cladding', 'Interior architectural walls'],
    variants: [
      { thicknessMm: 10, thicknessImperial: '3/8"', widthMm: 1219, lengthMm: 2438, weightKg: 35.31, weightLbs: 77.8, sku: '1332667' },
    ],
    density: { min: 1.0, max: 1.25, unit: 'g/cm³' },
    flexuralStrengthMin: { value: 4.0, unit: 'MPa (wet)' },
    compliance: [
      { standard: 'NCh1914/1.Of84', detail: 'Non-combustible (similar to ASTM E136 / E84)' },
      { standard: 'ISO 9001:2015 / 14001:2015 / 45001:2018', detail: 'Manufacturing certified' },
    ],
    manufacturer: 'Plycem',
    faqs: [
      {
        question: 'How is Fibroxton different from Plycem Exterior Hidden Joint?',
        answer:
          'Both target monolithic-finish facade cladding, but Fibroxton combines cellulosic fibers AND wood fibers with Portland cement, giving it a different surface texture and slightly different flexural characteristics (4 MPa wet minimum). Exterior Hidden Joint is a pure fiber-cement composition. Specifiers choose Fibroxton when the wood-fiber blend better matches a specific architectural finish or when paired with Plycem-recommended coating systems for a particular climate.',
      },
      {
        question: 'Is the tapered edge required for monolithic finishes?',
        answer:
          'Tapered edge is strongly recommended for monolithic-finish facades because it allows the seam to be filled and feathered for a continuous wall plane. Without the taper, joint compound creates a visible bump line. The 10mm (3/8") panel ships with the tapered profile for this purpose.',
      },
      {
        question: 'What ISO certifications cover Fibroxton manufacturing?',
        answer:
          'Fibroxton is manufactured under ISO 9001:2015 (quality management), ISO 14001:2015 (environmental management), and ISO 45001:2018 (occupational health and safety). It is produced at Plycem facilities in Costa Rica, El Salvador, and Honduras — multi-origin supply lets us maintain stock when single-plant disruptions occur.',
      },
      {
        question: 'Can Fibroxton be used for interior architectural walls?',
        answer:
          'Yes — Fibroxton is suitable for interior architectural and accent walls where a monolithic painted finish is desired. The same tapered-edge installation logic applies, with painting/finish completed after joint treatment. For high-moisture interior environments (showers, locker rooms), Plycem Exterior Cement Board is the better-suited product.',
      },
    ],
  },
  {
    slug: 'deck-modular',
    name: 'Deck Modular',
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
    slug: 'lap-siding-tongue-and-groove',
    name: 'Lap Siding — Tongue-and-Groove',
    shortDescription:
      'Fiber-cement tongue-and-groove plank siding for exterior and interior wall finishes. Wood-look "Clásico" smooth or "Cedro" wood-grain textures.',
    longDescription:
      'Plycem Siding Machihembrado is a horizontal fiber-cement plank with tongue-and-groove edges for exterior or interior wall cladding, ceilings, and soffits. Available in 246.5mm or 306.5mm widths × 2444.5mm length × 14mm thickness, with "Clásico" smooth or "Cedro" wood-grain finish. The T&G profile enables hidden-fastener installation for a clean uninterrupted wall plane. Manufactured at Plycem facilities in Costa Rica and El Salvador.',
    applications: [
      'Exterior facade cladding',
      'Exterior wall siding (residential and light commercial)',
      'Interior architectural wall finishes',
      'Ceiling and soffit applications',
      'Eaves and porch ceilings',
    ],
    variants: [
      { thicknessMm: 14, thicknessImperial: '9/16"', widthMm: 306.5, lengthMm: 2444.5, weightKg: 11.3, weightLbs: 24.9, sku: '960199', edgeProfile: 'tongue-and-groove', panelsPerPallet: 4 },
      { thicknessMm: 14, thicknessImperial: '9/16"', widthMm: 246.5, lengthMm: 2444.5, weightKg: 9.1, weightLbs: 20.1, sku: '960190', edgeProfile: 'tongue-and-groove', panelsPerPallet: 5 },
      { thicknessMm: 14, thicknessImperial: '9/16"', widthMm: 246.5, lengthMm: 2444.5, weightKg: 9.1, weightLbs: 20.1, sku: '960192', edgeProfile: 'tongue-and-groove', panelsPerPallet: 5 },
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
        question: 'How does this compare to James Hardie HardiePlank?',
        answer:
          'Both are fiber-cement lap siding certified to ASTM C1186 Type A. The primary technical difference is that HardiePlank carries a current ICC-ES Evaluation Service Report (ESR-2290) that documents specific assembly testing for US building codes, while Plycem Siding Machihembrado is certified to ASTM C1186 + ISO 8336 without an equivalent US ESR. For projects where AHJs accept manufacturer ASTM documentation directly, both products perform comparably. For projects requiring an ESR-referenced wall assembly (insurance specs, larger commercial), HardiePlank is the safer specification — confirm acceptance with your AHJ before specifying.',
      },
      {
        question: 'What is the difference between "Clásico" and "Cedro" finish?',
        answer:
          '"Clásico" is a smooth or lightly textured finish suitable for paint applications. "Cedro" has a deeper wood-grain texture mimicking cedar plank — ideal when a natural-wood aesthetic is desired without the maintenance of real cedar. Both share the same fiber-cement substrate and accept exterior-grade paints, stains, and integral dyes.',
      },
      {
        question: 'Can it be used for ceilings and soffits in addition to walls?',
        answer:
          'Yes. The 14mm thickness and T&G profile work equally well for horizontal soffit and ceiling applications. For exterior eaves and porch ceilings, fiber-cement is preferred over wood because it resists insect damage, rot, and moisture-driven warping. Fastening schedule changes for overhead applications — refer to the Plycem installation manual.',
      },
      {
        question: 'Which width is more common — 246.5mm or 306.5mm?',
        answer:
          'The narrower 246.5mm width (about 9-3/4") matches the visual proportion of traditional 8-inch lap siding and is the more frequently specified profile for residential exteriors. The 306.5mm width (about 12") creates a bolder horizontal line — preferred for modern architectural designs and when fewer joints are desired. Both widths share the same T&G mechanical interlock.',
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
          'Minimum 27% slope (approximately 15° pitch or 3:12). Below this slope, water can travel sideways under the corrugation and bypass the lap, causing leaks. For low-slope roofs, a different roof system (Plycem Roof Sheathing with a separate waterproof membrane, for example) is the appropriate product family.',
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
