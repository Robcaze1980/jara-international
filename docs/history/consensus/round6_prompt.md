# Round 6 — Sprint 2 Planning: Home Page Composition

**Type:** Sprint 2 planning consensus (planning round, post-Sprint 1 review).
**Voters:** DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1, Claude Opus 4.7. Quorum ≥3/4.
**Strategic priority (still active):** Launch in DAYS. Time-to-launch dominates.

---

## 1. WHAT'S LOCKED (do not re-debate)

### Hero pattern — ADR-010 VA1 (Round 2 4/4)
- Full-bleed photo + navy `#062B49` overlay (gradient for AA contrast)
- Centered text: H1 (Montserrat Bold) + subhead (Inter) + 2 CTA buttons
- Primary CTA: "Request a Quote" (filled navy button)
- Secondary CTA: "View Products" (outline button)
- Placeholder hero image already in `public/images/hero/_placeholder-hero.svg` until user delivers AI-generated final
- Single screen, no scroll-trigger animation

### Product cards — ADR-013 VB1 (Round 2 + user strategic)
- Photo-first card (image top, name + 1-line description + "View specs →" link)
- Generic navy-gradient placeholder (`public/images/products/_placeholder.svg`) for any product without a delivered AI photo
- Layout never changes; only `<img src>` swaps when user delivers

### Lead capture — ADR-005 E3 (Round 1 3/4)
- Material calculator on home page (input SF + construction type → estimated panel count, **NO PRICE** per ship blocker SB-4)
- Submittal form (3-step) lives at `/resources` (legacy v0 form ported in a later sprint)
- Sticky bottom bar with phone + WhatsApp Business

### SEO/AI requirements (cross-cutting from Round 3)
- Every new page must include hreflang en-US + es-US + x-default in metadata
- Self-referencing canonical
- Open Graph + Twitter Card meta
- JSON-LD where applicable (FAQ when items present, Breadcrumb on every page that's not root)
- WCAG AA contrast on hero overlay

### Performance — ADR-019 SH2
- LCP <1.5s, INP <100ms, CLS <0.05 on mobile + desktop

### Plycem brand — ADR-006 F3
- Text-only mentions of PLYCEM at launch ("We distribute PLYCEM Cement Board for…")
- NO PLYCEM logo, NO "Authorized Distributor" claim until consolidated approval received

---

## 2. STRATEGIC INPUTS PENDING FROM USER (will be captured in synthesis if not provided pre-round)

These don't block voting — they're strings filled at implementation time:
- WhatsApp Business number (or skip WhatsApp if not yet set up)
- Phone CTA format (current: +1 415 933 5738 from legacy v0 site — confirm or replace)

---

## 3. VOTING ITEMS (5 items)

### Item HA — Calculator UX pattern

The home-page material calculator helps a contractor estimate how many panels they'll need. It MUST NOT show prices (SB-4 ship blocker). Output: estimated panel count, optional weight + truck-load count, and a "Get full quote" CTA that prefills the submittal form with the calculator inputs.

- **HA1**: **Single-screen.** All inputs (SF area, construction type, panel thickness preference) + result + email-capture CTA on one screen, always visible. Lowest friction; user sees everything at once. Mobile-friendly with vertical stacking.
- **HA2**: **2-step (input → result).** Step 1: inputs only. Step 2: result + "Refine inputs" + "Get full quote" CTA. Cleaner visual hierarchy; result feels "earned" which can lift conversion.
- **HA3**: **Progressive disclosure.** Inputs revealed one at a time as user fills the previous; result appears live as soon as all required fields are valid. Maximum guided UX but more JS, more chance of state bugs, harder to ship in days.

### Item HB — Featured products section on home

The 6 products in the catalog are visible at `/products` (full listing, Sprint 3). Home page features a subset to drive interest without overwhelming.

- **HB1**: **All 6 visible** (3-column grid on desktop, 1-column stacked on mobile). Maximum product visibility; "what JARA distributes" is the headline truth.
- **HB2**: **Top 3 with "View all 6 products →" link.** Shows: subfloor (flagship for fire-rated multifamily), exterior cement board (IAPMO ER-360 win), deck (visually distinctive). Less crowded; emphasizes flagship.
- **HB3**: **By-application grouping** (3 groups: Structural — subfloor + roof sheathing | Cladding — hidden joint + cement board + fibroxton | Outdoor — deck). Each group is a card linking to filtered `/products` view. Better for buyers who think in applications; more component work.

### Item HC — Value props content + count

Below the hero (and above or below products, see HD), we surface 3-4 reasons to choose JARA. Each is an icon + 2-3 word headline + 1 sentence.

- **HC1**: **3 props.** (1) "In stock, Long Beach CA" — 0-3 day delivery to West Coast. (2) "Compliance-ready" — UL R15140, ASTM C1186, IAPMO ER-360 documentation on request. (3) "Technical sales support" — bilingual EN+ES, 1-business-day response.
- **HC2**: **4 props (HC1 + warehouse/origin story).** Adds (4) "3 manufacturing origins" — Costa Rica, El Salvador, Honduras for supply resilience. Differentiates JARA from single-source distributors.
- **HC3**: **4 props (HC1 + product breadth).** Adds (4) "Multi-product catalog" — 6 product lines for subfloor through cladding to outdoor deck. Positions JARA as one-stop shop for fiber-cement.

### Item HD — Section ordering on home (above-fold + scroll order)

Visitors land on hero. What goes next determines the "story" of the page.

- **HD1**: **hero → calculator → featured products → value props → trust bar (certs/compliance logos) → final CTA.** Calculator-first because it's the highest-intent action; gets contractor calculating immediately.
- **HD2**: **hero → value props → featured products → trust bar → calculator → final CTA.** Build credibility (props + products + certs) before asking for engagement (calculator). More conventional B2B funnel.
- **HD3**: **hero → trust bar → featured products → value props → calculator → final CTA.** Lead with credentials (UL, ASTM, IAPMO logos right under hero) — instant authority. Then product breadth. Then differentiators. Then engage with calculator. Best for skeptical/specifier audience.

### Item HE — Sticky CTA bar trigger behavior

The sticky bar at bottom (phone + WhatsApp + "Request Quote" button) has options for when it shows.

- **HE1**: **Always visible** (sticky bottom, all viewports, all scroll positions). Maximum conversion signal; never miss a CTA. Risk: feels pushy / takes screen real estate especially on mobile.
- **HE2**: **Appears after scroll past hero** (visible only after user has scrolled ~600-800px). Less intrusive on first impression; rewards engagement. Standard SaaS pattern.
- **HE3**: **Mobile-only sticky bar; desktop has it as a floating right-side button.** Mobile gets full bottom bar (phone + WhatsApp). Desktop gets a single round button bottom-right with "Quote" + tooltip. Different patterns per device match user behavior.

---

## 4. OUTPUT FORMAT (STRICT JSON ONLY)

```json
{
  "model": "your-model-id",
  "agent": "your-name",
  "votes": {
    "HA": "HA1|HA2|HA3",
    "HB": "HB1|HB2|HB3",
    "HC": "HC1|HC2|HC3",
    "HD": "HD1|HD2|HD3",
    "HE": "HE1|HE2|HE3"
  },
  "reasoning": {
    "HA": "1-2 sentences",
    "HB": "1-2 sentences",
    "HC": "1-2 sentences",
    "HD": "1-2 sentences",
    "HE": "1-2 sentences"
  },
  "additional_findings": [
    {
      "title": "...",
      "description": "...",
      "severity": "blocker|high|medium|low",
      "applies_to_phase": "4|5|6"
    }
  ],
  "verdict": "ship|revise|hold",
  "verdict_reason": "1-2 sentences"
}
```

## 5. Notes to voters

- Launch-in-days remains the dominant constraint. Vote for the option that ships fastest among the brand-compliant options.
- All 5 items must be JARA-brand-compliant by default — flag in reasoning if any option violates the locked palette/typography or Plycem ship blockers.
- `additional_findings` welcome for Sprint 2 implementation gotchas not on the ballot (e.g., calculator validation rules, accessibility patterns, schema markup additions).
- Vote independently — no cross-voter visibility.
- This prompt is immutable.
