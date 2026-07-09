#!/usr/bin/env node
/**
 * Pricing parity check — SEO/GEO audit item 43 (drift-hardening).
 *
 * lib/pricing.ts (PRICE_BY_SKU) is the single source of truth for prices. Every
 * price surface EXCEPT one derives from it at runtime and cannot drift:
 *   /pricing, /es/pricing, product JSON-LD (Offer/AggregateOffer),
 *   /llms-full.txt, /api/llm-context.
 * The exception is the STATIC public/llms.txt, which hardcodes prices. This check
 * fails the commit/build if any PRICE_BY_SKU entry is missing from public/llms.txt,
 * so the AI-crawler summary can never advertise a stale price.
 *
 * Run: `npm run check:pricing`  (also wired into .husky/pre-commit, blocking).
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const pricingSrc = readFileSync(join(root, 'lib', 'pricing.ts'), 'utf8');
const llms = readFileSync(join(root, 'public', 'llms.txt'), 'utf8');

const block = pricingSrc.match(/PRICE_BY_SKU[^{]*\{([\s\S]*?)\n\};/);
if (!block) {
  console.error('[pricing-parity] PRICE_BY_SKU not found in lib/pricing.ts');
  process.exit(1);
}

const map = {};
for (const m of block[1].matchAll(/'(\d+)':\s*(\d+)/g)) map[m[1]] = Number(m[2]);

const errors = [];
for (const [sku, price] of Object.entries(map)) {
  // Tolerate both "$74 (SKU 960140)" and "$28 (960018)" formats.
  const re = new RegExp('\\$' + price + '\\s*\\((?:SKU\\s*)?' + sku + '\\)');
  if (!re.test(llms)) {
    errors.push(`SKU ${sku}: expected "$${price} (${sku})" in public/llms.txt`);
  }
}

if (errors.length) {
  console.error('[pricing-parity] FAIL — public/llms.txt is out of sync with lib/pricing.ts PRICE_BY_SKU:');
  for (const e of errors) console.error('  - ' + e);
  console.error('  Fix: update the "## Pricing" section of public/llms.txt to match PRICE_BY_SKU.');
  process.exit(1);
}

console.log(`[pricing-parity] OK — ${Object.keys(map).length} priced SKUs match public/llms.txt`);
