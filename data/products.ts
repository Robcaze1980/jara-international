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
};

export const PRODUCTS: Product[] = [
  {
    slug: 'high-performance-subfloor',
    name: 'High Performance Subfloor',
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
          'Yes. Fiber-cement composition (ASTM C1186 Type A) is dimensionally stable in humid and coastal conditions where wood-based sheathing can swell, delaminate, or rot. Long Beach warehouse stock has been specified for projects throughout coastal Southern California and the Bay Area.',
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
      { standard: 'IAPMO ER-360', detail: 'Evaluation Report (valid through 2026-07-31)' },
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
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
