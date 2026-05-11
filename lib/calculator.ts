/**
 * Material calculator logic — input validation + panel estimate + URL prefill builder.
 *
 * Per ADR-005 E3 + Round 6 ADR-022 HA1 (single-screen calculator) +
 * Round 6 F1.R6 (4/4 convergent: airtight validation) +
 * Round 6 F2.R6 (URL prefill mechanism for /resources submittal).
 *
 * Plycem ship blocker SB-4 compliance: NEVER returns price strings, currency
 * symbols, or cost values. Output is panel count, weight, and truck loads only.
 */

import type { ConstructionType, PanelThickness } from './types';

export const CONSTRUCTION_TYPES = [
  { value: 'multifamily-podium', label: 'Multifamily (Type V over Podium)', defaultThickness: 20 },
  { value: 'commercial-steel', label: 'Commercial steel-joist floor', defaultThickness: 22 },
  { value: 'hotel-hospitality', label: 'Hotel / Hospitality', defaultThickness: 22 },
  { value: 'modular-prefab', label: 'Modular / Prefab construction', defaultThickness: 25 },
  { value: 'roof-sheathing', label: 'Roof sheathing', defaultThickness: 17 },
  { value: 'exterior-cladding', label: 'Exterior cladding (hidden joint)', defaultThickness: 12 },
  { value: 'outdoor-deck', label: 'Outdoor deck', defaultThickness: 30 },
  { value: 'other', label: 'Other / I will specify', defaultThickness: 20 },
] as const;

export const PANEL_THICKNESSES = [
  { value: 14, label: '14 mm (9/16") — Roof Sheathing' },
  { value: 17, label: '17 mm (11/16") — Roof Sheathing' },
  { value: 20, label: '20 mm (13/16") — Subfloor' },
  { value: 22, label: '22 mm (7/8") — Subfloor' },
  { value: 25, label: '25 mm (1") — Subfloor' },
  { value: 30, label: '30 mm (1-3/16") — Subfloor / Deck' },
] as const;

// Sane bounds (Round 6 F1.R6 — DeepSeek hard-cap convergent finding)
export const MIN_SF = 1;
export const MAX_SF = 500_000; // safety cap; alerts user above this

// Panel coverage per panel — based on Plycem standard 1219×2438mm panel = ~32 SF
export const SF_PER_PANEL = 32;
// Approximate panel weight in lbs by thickness (from data/products.ts)
const WEIGHT_LBS_BY_THICKNESS: Record<number, number> = {
  14: 103.9,
  17: 127.2,
  20: 149.6,
  22: 164.7,
  25: 187.1,
  30: 224.5,
};
// Approximate truck load (40' high cube container) panel capacity by thickness
const PANELS_PER_TRUCK: Record<number, number> = {
  14: 360,
  17: 320,
  20: 300,
  22: 270,
  25: 240,
  30: 200,
};

export type CalculatorInputs = {
  squareFeet: string; // string from form input; parsed in validation
  constructionType: ConstructionType | '';
  thicknessMm: PanelThickness | 0; // 0 = not selected; default applied per construction type
};

export type ValidationError = {
  field: keyof CalculatorInputs;
  message: string;
};

export type CalculatorEstimate = {
  panelCount: number;
  totalWeightLbs: number;
  truckLoads: number;
  thicknessUsedMm: number;
  squareFeet: number;
};

/** Validate inputs. Returns array of errors (empty = valid). */
export function validateCalculatorInputs(inputs: CalculatorInputs): ValidationError[] {
  const errors: ValidationError[] = [];

  // SF must be positive number within bounds
  const sfRaw = inputs.squareFeet.trim();
  if (!sfRaw) {
    errors.push({ field: 'squareFeet', message: 'Project square footage is required.' });
  } else {
    const sf = Number(sfRaw);
    if (!Number.isFinite(sf)) {
      errors.push({ field: 'squareFeet', message: 'Square footage must be a number.' });
    } else if (sf < MIN_SF) {
      errors.push({ field: 'squareFeet', message: `Square footage must be at least ${MIN_SF}.` });
    } else if (sf > MAX_SF) {
      errors.push({
        field: 'squareFeet',
        message: `For projects over ${MAX_SF.toLocaleString()} SF, please request a custom quote directly.`,
      });
    }
  }

  // Construction type required
  if (!inputs.constructionType) {
    errors.push({ field: 'constructionType', message: 'Please select your construction type.' });
  }

  return errors;
}

/** Calculate panel estimate. Caller MUST validate first. */
export function calculateEstimate(inputs: CalculatorInputs): CalculatorEstimate {
  const sf = Number(inputs.squareFeet);

  // Resolve thickness: explicit > construction-type default > 20mm fallback
  let thicknessMm: number = inputs.thicknessMm;
  if (!thicknessMm) {
    const ct = CONSTRUCTION_TYPES.find((c) => c.value === inputs.constructionType);
    thicknessMm = ct?.defaultThickness ?? 20;
  }

  const panelCount = Math.ceil(sf / SF_PER_PANEL);
  const weightPerPanelLbs = WEIGHT_LBS_BY_THICKNESS[thicknessMm] ?? WEIGHT_LBS_BY_THICKNESS[20];
  const totalWeightLbs = Math.round(panelCount * weightPerPanelLbs);
  const panelsPerTruck = PANELS_PER_TRUCK[thicknessMm] ?? PANELS_PER_TRUCK[20];
  const truckLoads = Math.ceil(panelCount / panelsPerTruck);

  return {
    panelCount,
    totalWeightLbs,
    truckLoads,
    thicknessUsedMm: thicknessMm,
    squareFeet: sf,
  };
}

/**
 * Build URL to /resources prefilled with calculator inputs.
 * Per Round 6 F2.R6 — eliminates dead-link risk at launch.
 *
 * Format: /resources?sf=500&type=multifamily-podium&thickness=20
 */
export function buildResourcesPrefillUrl(estimate: CalculatorEstimate, constructionType: string): string {
  const params = new URLSearchParams({
    sf: String(estimate.squareFeet),
    type: constructionType,
    thickness: String(estimate.thicknessUsedMm),
    panels: String(estimate.panelCount),
  });
  return `/resources?${params.toString()}`;
}

/**
 * Format estimate for display. Per ship blocker SB-4: NO currency, NO price words.
 * This function is the canonical formatter — extending the calculator output should
 * use this so the no-currency CI test (Round 1.5 F3.5 / constraint C3) has one
 * place to grep.
 */
export function formatEstimate(estimate: CalculatorEstimate): {
  panels: string;
  weight: string;
  trucks: string;
  thickness: string;
} {
  return {
    panels: `~${estimate.panelCount.toLocaleString()} panels`,
    weight: `${estimate.totalWeightLbs.toLocaleString()} lbs total`,
    trucks: estimate.truckLoads === 1 ? '1 truck load' : `${estimate.truckLoads} truck loads`,
    thickness: `${estimate.thicknessUsedMm}mm panels`,
  };
}
