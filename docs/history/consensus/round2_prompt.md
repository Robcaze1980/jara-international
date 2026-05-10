# Round 2 — JARA International Inc. Website: Visual Design System

**Type:** Visual design decisions — compressed scope due to launch-in-days strategic priority.
**Voters:** DeepSeek V4 Pro, Gemini 3.1 Flash Lite, GLM-5.1, Claude Opus 4.7 (manual). Quorum ≥3/4.

---

## 1. CRITICAL CONTEXT — strategic constraint

**User strategic priority: launch in DAYS, not weeks.**

Quote: "Mi lanzamiento es de dias.....esos plazos con AI se vuelven fraccions dado que no son humanos haciendo el proceso."

Implication for Round 2 voting: when in doubt, **vote for the option that ships fastest**. Polish, animation, and aesthetic ambition are explicitly secondary to time-to-launch. Optimal launch is "good and shipped" over "perfect and pending."

---

## 2. WHAT'S ALREADY LOCKED (do not re-debate)

### From Phase 1 (round1 + round1.5 syntheses)
- **Stack:** Next.js 16 + React 19 + Tailwind 3.4 + Radix UI + lucide-react (deploy Cloudflare Pages)
- **Architecture:** Multi-product Plycem catalog (6 product detail pages + ~20 SKUs)
- **Domain:** jarainternational.com canonical
- **AI strategy:** llms-full.txt + JSON-LD + /api/llm-context
- **Lead capture:** calculator (no price) + form + sticky bar (phone + WhatsApp)
- **Plycem brand:** text-only at launch, logo post-approval
- **SEO:** generic at launch + Phase 4 Plycem-brand sprint after approval
- **Bilingual:** EN full + 1 ES landing page
- **Email:** long canonical domain pattern

### From JARA Brand Strategy & Visual Identity Guidelines (NOT VOTABLE — brand is brand)

**Color palette (locked, no debate):**
- Primary Navy: `#062B49`
- Dark Navy alt: `#04233D`
- Medium Steel Blue: `#5F7894`
- Light Blue-Gray: `#B8C7D6`
- Soft Background Gray: `#F4F6F8`
- Body Text Charcoal: `#1F2933`
- White: `#FFFFFF`

**Typography (locked):**
- Display headings: **Montserrat Bold/SemiBold** (Google Font)
- Body: **Inter Regular** (Google Font)
- Documents/specs: Arial or Aptos
- All weights/hierarchy per JARA guide §9

**Icon library:** lucide-react (already in stack from A1 lock). No custom icons unless specifically required.

**Photography style:** Architectural, clean, material-focused, professional. User supplies all hero/product/visual images via AI generation per project memory. Never source stock; never use generic globe/handshake/dramatic-construction clichés.

**Component library base:** Radix UI primitives + Tailwind utility classes. shadcn/ui pattern confirmed (already in v0).

**Layout primitives:** Standard top nav with logo-left + nav-right + CTA. Standard footer with logo + contact block + nav links + certifications. Both per JARA guide §17.

**EXPLICITLY FORBIDDEN (per JARA guide §12 'Avoid'):**
- Bright royal blue
- Gradients on logo
- Heavy shadows / bevels / 3D effects on logo
- Orange, red, green, or yellow as core brand colors
- Random grays unrelated to navy palette
- Pure black as main brand color

---

## 3. VOTING ITEMS (4 items)

### Item VA — Hero section composition

The home page hero is the highest-leverage visual decision. User will supply the hero image (AI-generated) per memory. The composition controls how that image works with text/CTAs.

- **VA1**: **Full-bleed photo + dark navy overlay (60% opacity) + centered text + 2 CTAs.** Single screen, no scroll-trigger. Headline + subhead + "Request a Quote" (primary navy button) + "View Products" (outline button). Fastest to build. JARA brand-compliant. Accommodates any user-supplied hero image.
- **VA2**: **Split layout — left 60% text/CTAs on white, right 40% hero photo (full bleed of split panel).** No overlay needed on photo. More text-readable on mobile. Slightly more layout work.
- **VA3**: **Three-panel symbol motif as background pattern (subtle SVG, 5% opacity navy on white) + foreground text + CTAs + small product photo collage right.** No single hero image needed (user can supply collage images). Most distinctive but most build effort.

### Item VB — Product card layout (used on /products listing + home featured products)

Each card represents one of the 6 product lines (subfloor, roof sheathing, deck, hidden joint, cement board, fibroxton). User will supply product images per memory.

- **VB1**: **Photo-first.** Top: product photo 4:3 ratio. Below: product name (Montserrat Bold) + 1-line description + "View specs →" link. Standard B2B catalog pattern. Fast.
- **VB2**: **Spec-first.** Top: bold product name + key spec (e.g., "20-30mm thickness, ASTM C1186 Type A"). Right: small product photo. Below: list of 2-3 use cases. Bottom: "View specs →". More information-dense, prioritizes technical spec scanning.
- **VB3**: **Icon + spec hybrid.** Top: lucide-react icon representing use case (e.g., Layers for subfloor, Home for cement board) in navy circle. Below: name + key spec + "View →" link. No photo required (faster to ship if user-supplied photos delayed). Icons are temporary; swap to photos when delivered.

### Item VC — Stitch (Google AI design tool) integration scope

Stitch generates UI mockups via Gemini 3 Pro. Setup requires user to obtain Stitch API key (~5 min) + install Stitch MCP via `claude mcp add` (currently blocked: `claude` CLI not on user's PATH — would need `npm install -g @anthropic-ai/claude-code` first).

- **VC1**: **YES — full Stitch usage.** Generate 3-4 mockup variations per major page (home, product list, product detail, resources, contact) for review before coding. Adds ~1 day of setup + iteration but produces visually-validated designs before code. Best for non-trivial visual decisions.
- **VC2**: **YES — limited Stitch usage.** Use Stitch only for hero section variations and home page composition (the highest-leverage visual decisions). Skip for product cards / footer / nav (those follow established B2B patterns). Lower setup cost, focused value.
- **VC3**: **NO — hand-craft using JARA brand tokens directly.** Skip Stitch entirely. Build directly with Tailwind + Radix using locked color palette and typography. Zero setup overhead. Trust the brand guide as the design constraint. Fastest path given launch-in-days priority.

### Item VD — Three-panel symbol UI treatment beyond logo

The JARA logo includes a three-panel symbol (per brand guide §6). Beyond the logo itself, how should this symbol appear in UI?

- **VD1**: **Logo only — no other UI usage.** Symbol appears only in the navigation logo and footer logo. Simplest. Avoids over-using the symbol per brand guide §24 "Do not use the symbol as a decorative pattern too aggressively."
- **VD2**: **Logo + subtle background pattern.** Symbol appears in logo positions PLUS as a very subtle background watermark (3-5% opacity) on hero or section dividers. Adds brand presence without being aggressive.
- **VD3**: **Logo + favicon + section accent.** Symbol in logo positions + favicon (32px) + small accent appearing once or twice as a section divider element (e.g., before footer). Most brand presence but adds component work.

---

## 4. OUTPUT FORMAT (STRICT JSON ONLY)

```json
{
  "model": "your-model-id",
  "agent": "your-name",
  "votes": {
    "VA": "VA1|VA2|VA3",
    "VB": "VB1|VB2|VB3",
    "VC": "VC1|VC2|VC3",
    "VD": "VD1|VD2|VD3"
  },
  "reasoning": {
    "VA": "1-2 sentences",
    "VB": "1-2 sentences",
    "VC": "1-2 sentences",
    "VD": "1-2 sentences"
  },
  "additional_findings": [
    {
      "title": "...",
      "description": "...",
      "severity": "blocker|high|medium|low",
      "applies_to_phase": "2|3|4|5|6"
    }
  ],
  "verdict": "ship|revise|hold",
  "verdict_reason": "1-2 sentence summary"
}
```

## 5. Notes to voters

- **Launch-in-days priority is the most important context.** Time-to-launch is the dominant constraint.
- All visual options must be JARA brand-compliant by default — if you propose anything outside the locked palette/typography, mark it as `revise` with a clear justification.
- `additional_findings` welcome but should be Phase 2 or Phase 4 specific given the immediate launch timeline.
- Votes are independent — do NOT see other voter responses.
- This prompt is immutable.
