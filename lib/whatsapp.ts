/**
 * WhatsApp deep link helper (per Round 6 Gemini finding).
 *
 * Uses the standard `https://wa.me/[number]` format which works cross-platform
 * (iOS / Android / web) without requiring SDKs or special handling.
 *
 * Per 2026-05-10 phone strategy lock: WhatsApp routes to Robertson's personal
 * cell (NOT Anna AI agent — agents don't handle WhatsApp).
 */

import { SITE } from './site';

/** Build a wa.me URL with optional pre-filled message. */
export function buildWhatsAppUrl(message?: string): string {
  // Robertson's number (NOT Anna's — Anna doesn't handle WhatsApp)
  const number = SITE.phoneSecondaryRaw.replace(/^\+/, '');
  const base = `https://wa.me/${number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

/** Build tel: link from a SITE phone field. */
export function buildTelUrl(rawPhone: string): string {
  return `tel:${rawPhone}`;
}
