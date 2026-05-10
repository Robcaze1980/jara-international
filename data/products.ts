/**
 * Product catalog — single source of truth.
 * Derived from 10 Plycem PDFs (Phase 0.5 audit).
 * Used by: product detail pages, /products listing, /api/llm-context, JSON-LD schemas, sitemap.
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
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}
