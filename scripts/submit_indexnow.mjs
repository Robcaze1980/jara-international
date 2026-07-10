#!/usr/bin/env node
/**
 * IndexNow submission — instant-index ping to Bing + Yandex (go-live accelerator).
 *
 * Run AFTER the key file (public/<KEY>.txt) is LIVE in production, otherwise the
 * endpoint returns 403 (key not verifiable):
 *   node scripts/submit_indexnow.mjs
 *
 * IndexNow is one-way: it asks the engines to crawl these URLs now. Google does
 * not use IndexNow — submit the sitemap in Google Search Console for Google.
 */
const KEY = 'b3d9f1a7c25e480d9a6f3c81e07b45d2';
const HOST = 'jarainternational.com';
const base = `https://${HOST}`;

const urlList = [
  '',
  '/pricing',
  '/about',
  '/guides',
  '/es',
  '/es/pricing',
  '/products',
  '/products/high-performance-subfloor',
  '/products/deck',
  '/products/exterior-hidden-joint',
  '/products/exterior-cement-board',
  '/products/deck-modular',
  '/products/siding',
  '/products/corrugated-roof-tile',
  '/guides/non-combustible-subfloor-cost',
  '/guides/fiber-cement-vs-plywood-subfloor',
  '/guides/type-i-ii-construction-subfloor',
  '/resources',
  '/service-areas',
  '/contact',
].map((p) => base + p);

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `${base}/${KEY}.txt`,
  urlList,
};

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(body),
});

console.log(`[indexnow] HTTP ${res.status} ${res.statusText} — submitted ${urlList.length} URLs`);
if (res.status !== 200 && res.status !== 202) {
  console.error(`[indexnow] non-success. Confirm the key file is live: ${body.keyLocation}`);
  process.exit(1);
}
