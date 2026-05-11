/** Shared cross-module types. Keep this file pure type declarations only. */

export type ConstructionType =
  | 'multifamily-podium'
  | 'commercial-steel'
  | 'hotel-hospitality'
  | 'modular-prefab'
  | 'roof-sheathing'
  | 'exterior-cladding'
  | 'outdoor-deck'
  | 'other';

export type PanelThickness = 14 | 17 | 20 | 22 | 25 | 30;
