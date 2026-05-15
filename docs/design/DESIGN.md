---
# JARA International — Design System (DESIGN.md v1)
# Spec: https://github.com/google-labs-code/design.md
# Authored: 2026-05-14 (Round 10 prep)
# Source of truth status: CANONICAL for visual design tokens. Supersedes
#   token drift across app/globals.css, tailwind.config.ts, lib/site.ts,
#   Round 2 synthesis, and the JARA Brand Strategy Guidelines PDF.
# Per ADR-033: any commit changing a color, typography size, spacing
#   token, or named component must update this file in the same commit.

overview:
  brand: "JARA International Inc."
  tagline: "Global Sourcing. Built on Trust."
  aesthetic: |
    Industrial B2B serious. Navy + steel-blue palette anchored on JARA Brand
    Strategy Guidelines §10–11. Light mode only (no dark mode per brand §14).
    Confidence through restraint — generous whitespace, semantic typography,
    minimal decoration. The three-panel symbol is reserved for navigation
    logo and footer logo per brand §24 + ADR-012 (no decorative reuse).
  positioning: "US-based B2B distributor of premium PLYCEM fiber-cement panels"
  authority_sources:
    - "JARA Brand Strategy Guidelines (PDF, 2026)"
    - "Plycem Distributor Brand Usage Guide (PDF, 2026)"
    - "MASTER_AUDIT.md §5 ship blockers SB-1..SB-9"
    - "Round 2 synthesis (visual design locks: ADR-010..013)"
    - "Round 6 synthesis (home layout locks: ADR-021..025)"
    - "Round 8 synthesis (product detail locks: ADR-027..031)"

colors:
  # Brand core — per JARA Brand Strategy §10–11. Hex values authoritative.
  navy: "#062B49"            # Primary Navy — main brand, h1/h2/h3, primary buttons
  navy-dark: "#04233D"       # Dark Navy — hover state for primary, deep accents
  steel: "#5F7894"           # Medium Steel Blue — accent, eyebrow text, focus ring
  bluegray: "#B8C7D6"        # Light Blue-Gray — borders, dividers, light surfaces
  bg: "#FFFFFF"              # Background — page default
  bg-soft: "#F4F6F8"         # Soft Background Gray — section alternation, input fill
  ink: "#1F2933"             # Body Text Charcoal — NOT pure black (brand §12)
  white: "#FFFFFF"           # White — text on navy backgrounds

  # Semantic mappings (consumed by Tailwind theme + components)
  background: "{colors.bg}"
  foreground: "{colors.ink}"
  primary: "{colors.navy}"
  primary-foreground: "{colors.white}"
  secondary: "{colors.bg-soft}"
  secondary-foreground: "{colors.navy}"
  muted: "{colors.bg-soft}"
  muted-foreground: "{colors.steel}"
  accent: "{colors.steel}"
  accent-foreground: "{colors.white}"
  border: "{colors.bluegray}"
  input-border: "{colors.bluegray}"
  ring: "{colors.steel}"

  # Error state (uses Tailwind defaults — kept narrow, brand-foreign tone is
  # intentional so error UI doesn't get confused with brand UI)
  error-bg: "#FEF2F2"        # red-50
  error-border: "#B91C1C"    # red-700
  error-text: "#7F1D1D"      # red-900

  # FORBIDDEN colors per JARA Brand Strategy §12 (any future request to add
  # one of these MUST go through a fresh consensus round + brand-team review):
  forbidden:
    - "bright royal blue (e.g., #0066FF)"
    - "orange (any saturation)"
    - "red (except narrow error UI state)"
    - "green (any saturation)"
    - "yellow (any saturation)"
    - "pure black (#000000) — use {colors.ink} for text instead"

typography:
  # Per Round 2 ADR-010 + Round 2 GLM finding: use next/font/google to
  # eliminate CLS and render-blocking. Loaded in app/layout.tsx.
  fonts:
    display: "Montserrat"        # h1/h2/h3, eyebrow labels, button text
    sans: "Inter"                # body, paragraphs, captions, table cells
    mono: "system-ui-monospace"  # SKU codes, CSI section codes
  font-stack:
    display: "var(--font-montserrat), system-ui, -apple-system, Segoe UI, sans-serif"
    sans: "var(--font-inter), system-ui, -apple-system, Segoe UI, sans-serif"

  # Sizes — Tailwind defaults except where called out. Mobile-first, with
  # responsive bumps at md (768px) and lg (1024px) for h1.
  sizes:
    xs: "0.75rem"      # 12px — kicker labels, captions, legal
    sm: "0.875rem"     # 14px — body small, table cells
    base: "1rem"       # 16px — body default
    lg: "1.125rem"     # 18px — body large (hero subhead)
    xl: "1.25rem"      # 20px — section subheads
    "2xl": "1.5rem"    # 24px — h2 mobile
    "3xl": "1.875rem"  # 30px — h2 desktop, calculator result number
    "4xl": "2.25rem"   # 36px — h1 mobile
    "5xl": "3rem"      # 48px — h1 tablet
    "6xl": "3.75rem"   # 60px — hero h1 desktop

  weights:
    regular: 400
    medium: 500
    semibold: 600
    bold: 700

  line-heights:
    tight: 1.1          # hero h1 — leading-tight in Tailwind
    snug: 1.25          # secondary headings
    normal: 1.5         # body default
    relaxed: 1.625      # long-form body — leading-relaxed in Tailwind

  letter-spacing:
    normal: "0"
    wider: "0.05em"        # tracking-wider — eyebrow kickers
    widest-custom: "0.12em" # tracking-[0.12em] — "Applications" labels
    widest-emphasis: "0.18em" # tracking-[0.18em] — section eyebrow labels, primary kickers

  text-utilities:
    balance: "applied on all h1/h2/h3 via globals.css base layer + text-balance utility"
    pretty: "available on body where set explicitly"

  forbidden:
    - "Space Grotesk (was in v0 site; superseded by Montserrat)"
    - "any serif font (off-brand)"
    - "Google Fonts CDN <link> tags (use next/font/google instead — CLS prevention)"

layout:
  # Container widths (max-width caps)
  containers:
    page-narrow: "640px"     # auth pages, focused content — max-w-2xl
    page-medium: "768px"     # long-form prose — max-w-3xl
    page-wide: "896px"       # calculator, form sections — max-w-4xl
    page-default: "1280px"   # all top-level sections — max-w-7xl

  # Horizontal padding (responsive)
  padding-x:
    mobile: "1.5rem"   # px-6
    desktop: "2rem"    # lg:px-8

  # Vertical section rhythm (responsive)
  section-padding-y:
    compact: { mobile: "2.5rem", desktop: "3rem" }      # py-10 lg:py-12 — TrustBar, narrow strips
    standard: { mobile: "3rem",  desktop: "4rem" }      # py-12 lg:py-16 — Footer
    spacious: { mobile: "4rem",  desktop: "6rem" }      # py-16 lg:py-24 — main sections (ValueProps, MaterialCalculator, FeaturedProducts)
    hero: { mobile: "6rem", desktop: "8rem" }           # py-24 lg:py-32 — Hero only

  # Spacing scale (Tailwind defaults — common values listed for reference)
  spacing-scale:
    "0.5": "0.125rem"   # 2px
    "1":   "0.25rem"    # 4px
    "2":   "0.5rem"     # 8px
    "3":   "0.75rem"    # 12px
    "4":   "1rem"       # 16px
    "6":   "1.5rem"     # 24px
    "8":   "2rem"       # 32px
    "10":  "2.5rem"     # 40px
    "12":  "3rem"       # 48px

  # Grid patterns
  grids:
    cards-3up: "1 col mobile, 3 cols md+"     # ValueProps, FeaturedProducts
    cards-2up: "1 col mobile, 2 cols md+"     # Product card pairs
    footer:    "1 col mobile, 2 cols md, 4 cols lg"
    product-detail-hero: "1 col mobile, [1.2fr_1fr] md+"

  scroll-anchors:
    offset: "5rem"     # scroll-mt-20 — accounts for any future sticky header

elevation:
  # Box-shadow tokens. Use sparingly — JARA brand is restrained, not flashy.
  none: "none"
  sm:  "0 1px 2px 0 rgb(0 0 0 / 0.05)"                            # Default card depth
  md:  "0 4px 6px -1px rgb(0 0 0 / 0.10), 0 2px 4px -2px rgb(0 0 0 / 0.10)"  # Calculator result, hover
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)"                     # Sticky CTA bar (floating UI)

  # Custom shadows used in components
  custom:
    sticky-col-edge: "2px 0 0 0 rgba(11, 27, 42, 0.06)"    # VariantTable sticky-first-column edge hint

  layering:
    z-base: 0
    z-floating: 40       # Sticky CTA bar
    z-modal: 50          # (none yet — future)
    z-toast: 60          # (none yet — future)

  # Depth principles
  rules:
    - "Default cards use shadow-sm + border-bluegray/40. Border carries most weight, shadow is just a hint."
    - "shadow-md only on hover or on emphasized state (calculator result panel)."
    - "shadow-2xl reserved for floating UI that sits above content (Sticky CTA bar)."
    - "Never use shadow + thick border together — pick one depth mechanism."

shapes:
  radius:
    none: "0"
    sm: "0.25rem"      # 4px — small pills, tags
    md: "0.375rem"     # 6px — buttons, inputs (Tailwind default md)
    lg: "0.5rem"       # 8px — cards, panels, hero CTAs, modals (--radius CSS var)
    full: "9999px"     # pills, badges, application chips

  borders:
    width-default: "1px"
    width-emphasis: "2px"       # Calculator result panel, focus rings
    color-default: "{colors.bluegray}"
    color-default-soft: "{colors.bluegray} at 40% opacity"   # border-bluegray/40 — most cards
    color-on-dark: "{colors.white} at 10-30% opacity"        # border-white/10..30 — dark surface dividers

  aspect-ratios:
    product-card: "4 / 3"        # ProductCard image, ProductDetailHero image
    hero: "auto"                  # Hero is full-bleed, no constrained ratio
    video: "16 / 9"               # (potential future use)

components:
  # ----- BUTTONS -----
  button-primary:
    description: "Main CTA on light backgrounds. High-contrast, brand-anchoring."
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    typography: "{typography.weights.semibold} {typography.sizes.sm}"
    padding: "0.625rem 1.25rem"      # py-2.5 px-5 — small. Or py-3 px-6 for hero
    rounded: "{shapes.radius.md}"
    hoverBackgroundColor: "{colors.navy-dark}"
    focus: "outline-2 outline-offset-2 outline-{colors.navy}"
    sizes:
      default: "py-2.5 px-5 text-sm"
      hero: "py-3 px-6 text-sm"

  button-primary-on-dark:
    description: "Primary CTA when sitting on navy background (Hero CTAs, StickyCTABar Quote button)."
    backgroundColor: "{colors.white}"
    textColor: "{colors.navy}"
    typography: "{typography.weights.semibold} {typography.sizes.sm}"
    padding: "0.75rem 1.5rem"        # py-3 px-6
    rounded: "{shapes.radius.md}"
    hoverBackgroundColor: "{colors.bluegray}"
    focus: "outline-2 outline-offset-2 outline-{colors.white}"

  button-outline:
    description: "Secondary CTA. Outline only, no fill."
    backgroundColor: "transparent"
    textColor: "{colors.navy}"
    border: "1px solid {colors.navy} at 30% opacity"
    typography: "{typography.weights.semibold} {typography.sizes.sm}"
    padding: "0.625rem 1.25rem"
    rounded: "{shapes.radius.md}"
    hoverBackgroundColor: "{colors.bg-soft}"

  button-outline-on-dark:
    description: "Outline CTA on navy background."
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    border: "1px solid {colors.white} at 30-40% opacity"
    typography: "{typography.weights.semibold} {typography.sizes.sm}"
    padding: "0.75rem 1.5rem"
    rounded: "{shapes.radius.md}"
    hoverBackgroundColor: "{colors.white} at 10% opacity"

  button-tertiary:
    description: "Subtle CTA. Bluegray fill on dark, used in StickyCTABar Quote button."
    backgroundColor: "{colors.bluegray}"
    textColor: "{colors.navy}"
    typography: "{typography.weights.semibold} {typography.sizes.sm}"
    rounded: "{shapes.radius.md}"
    hoverBackgroundColor: "{colors.white}"

  # ----- FORM INPUTS -----
  input-text:
    description: "Default text/number input. Used in MaterialCalculator + future Sprint 4 forms."
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.bluegray} at 60% opacity"
    typography: "{typography.sizes.base} {typography.weights.regular}"
    padding: "0.5rem 0.75rem"        # py-2 px-3
    rounded: "{shapes.radius.md}"
    placeholderColor: "{colors.ink} at 40% opacity"
    focusBorder: "{colors.navy}"
    focusOutline: "outline-2 outline-offset-2 outline-{colors.navy}"
    errorBorder: "{colors.error-border}"
    errorBackground: "{colors.error-bg}"

  input-label:
    description: "Label paired with input."
    textColor: "{colors.navy}"
    typography: "{typography.sizes.sm} {typography.weights.semibold}"
    requiredAsteriskColor: "{colors.steel}"     # aria-hidden, decorative

  # ----- CARDS / PANELS -----
  card-default:
    description: "Standard content card. Used in ValueProps, ProductCard image-less panels, ComplianceSection, ProductFAQ."
    backgroundColor: "{colors.bg}"
    border: "1px solid {colors.bluegray} at 40% opacity"
    rounded: "{shapes.radius.lg}"
    elevation: "{elevation.sm}"
    padding: "1.25rem 1.5rem"        # p-5 / md:p-6

  card-emphasis:
    description: "Featured card for calculator result, hero panels. Heavier border, more elevation."
    backgroundColor: "{colors.bg}"
    border: "2px solid {colors.navy}"
    rounded: "{shapes.radius.lg}"
    elevation: "{elevation.md}"
    padding: "1.5rem 2rem"            # p-6 / md:p-8

  card-on-soft-bg:
    description: "Card sitting on bg-soft section background. Keep contrast with hairline border."
    backgroundColor: "{colors.bg}"
    border: "1px solid {colors.bluegray} at 40% opacity"
    rounded: "{shapes.radius.lg}"
    elevation: "none"

  # ----- ICONOGRAPHY -----
  icon-tile:
    description: "Icon-in-tinted-square pattern. Used in ValueProps, MaterialCalculator section header."
    size: "3rem"                     # h-12 w-12
    backgroundColor: "{colors.navy}"
    iconColor: "{colors.white}"
    rounded: "{shapes.radius.lg}"
    iconStrokeWidth: 1.75            # lucide-react default tuned slightly heavier for legibility

  icon-inline:
    description: "Inline icon inside button text or list item."
    size: "1rem"                     # h-4 w-4
    strokeWidth: 2                   # default
    color: "inherits surrounding text"

  icon-inline-emphasis:
    description: "Inline icon used as the strongest item in a CTA (ArrowRight in primary CTAs)."
    size: "1rem"
    strokeWidth: 2.5
    color: "inherits surrounding text"

  # ----- TYPOGRAPHY DISPLAY ROLES -----
  heading-eyebrow:
    description: "Small uppercase kicker label above a section heading or content block."
    fontFamily: "{typography.fonts.display}"     # Montserrat
    typography: "{typography.sizes.xs} {typography.weights.semibold}"
    textColor: "{colors.steel}"
    letterSpacing: "{typography.letter-spacing.widest-emphasis}"   # 0.18em
    textTransform: "uppercase"

  heading-1:
    description: "Page H1. Always renders text-balanced."
    fontFamily: "{typography.fonts.display}"
    typography:
      mobile: "{typography.sizes.4xl} {typography.weights.bold}"   # 36px bold
      tablet: "{typography.sizes.5xl}"                              # 48px
      desktop: "{typography.sizes.6xl}"                             # 60px (hero only — section h1 caps at 4xl)
    lineHeight: "{typography.line-heights.tight}"
    textColor: "{colors.navy}"                # default on light bg
    textColorOnDark: "{colors.white}"          # hero treatment
    heroTextShadow: "0 2px 8px rgba(4, 35, 61, 0.5)"  # only on hero — required per Round 5 GLM for AA contrast

  heading-2:
    description: "Section H2."
    fontFamily: "{typography.fonts.display}"
    typography:
      mobile: "{typography.sizes.2xl} {typography.weights.bold}"    # 24px bold
      desktop: "{typography.sizes.3xl}"                              # 30px
    lineHeight: "{typography.line-heights.snug}"
    textColor: "{colors.navy}"

  heading-3:
    description: "Card/sub-section H3."
    fontFamily: "{typography.fonts.display}"
    typography: "{typography.sizes.lg} {typography.weights.semibold}"   # 18px semibold
    textColor: "{colors.navy}"

  body-default:
    description: "Default paragraph body."
    fontFamily: "{typography.fonts.sans}"
    typography: "{typography.sizes.base} {typography.weights.regular}"
    lineHeight: "{typography.line-heights.relaxed}"
    textColor: "{colors.ink} at 75-85% opacity (text-ink/75..85)"

  body-small:
    description: "Body small, table cells, secondary copy."
    fontFamily: "{typography.fonts.sans}"
    typography: "{typography.sizes.sm} {typography.weights.regular}"
    textColor: "{colors.ink} at 70-85% opacity"

  body-tiny:
    description: "Captions, legal lines, fine print."
    fontFamily: "{typography.fonts.sans}"
    typography: "{typography.sizes.xs} {typography.weights.regular}"
    textColor: "{colors.ink} at 55-65% opacity (or {colors.white}/55..70 on dark)"

  # ----- SHIPPED COMPOSITE COMPONENTS (Sprint 2 + 3) -----
  Hero:
    description: "Full-bleed hero image + navy gradient overlay + H1 + body + 2 CTAs + cert kicker."
    file: "components/Hero.tsx"
    adr: "ADR-010 (Round 2 VA1, 4/4 unanimous) + Round 5 GLM contrast fix"
    backgroundLayer:
      base: "{colors.navy}"
      image: "fill 100% with object-cover at opacity 0.5"
      overlayGradient: "bg-gradient-to-r from-{colors.navy}/90 via-{colors.navy}/75 to-{colors.navy}/55"
    layout: "max-w-7xl + px-6 lg:px-8 + py-24 lg:py-32 with max-w-3xl text column"
    h1: "{components.heading-1} with textColorOnDark + heroTextShadow"
    subheadColor: "{colors.white} at 90%"
    ctas: "{components.button-primary-on-dark} + {components.button-outline-on-dark}"
    certKicker: "{components.body-tiny} on dark"

  ValueProps:
    description: "3-card grid: in-stock, compliance, bilingual support."
    file: "components/ValueProps.tsx"
    adr: "ADR-023 (Round 6 HC1, 4/4)"
    sectionBackground: "{colors.bg-soft}"
    cardPattern: "{components.card-default}"
    iconPattern: "{components.icon-tile}"
    h2: "{components.heading-2}"

  TrustBar:
    description: "Text-only certification wordmark row. SB-7 compliant (no Plycem logo). Per ADR-043 V3 (Round 10 5-0), one cert can be marked `featured: true` to render with a small steel-filled star glyph and optional inline subtext beneath the wordmark."
    file: "components/TrustBar.tsx"
    adr: "ADR-024 (Round 6 HD2 ordering) + Round 6 F3.R6 text-only mandate + ADR-043 (Round 10 V3 IAPMO ER-360 featured pattern)"
    sectionBackground: "{colors.bg-soft}"
    border: "border-y border-{colors.bluegray}/30"
    eyebrow: "{components.heading-eyebrow}"
    certText: "{typography.fonts.display} {typography.sizes.sm} {typography.weights.semibold} color {colors.navy}"
    featuredCert:
      starIcon: "lucide-react Star, h-3.5 w-3.5, fill-{colors.steel} text-{colors.steel} strokeWidth 1.5"
      subtext: "{typography.sizes.[11px]-custom} {typography.weights.medium} color {colors.steel} margin-top 0.125rem"
      usage: "One cert at a time. Currently IAPMO ER-360 (per ADR-043 + C2 expiration display). Star is aria-labelled 'Featured certification' for screen reader context."
    certListContract:
      - "Position 1: foundational fire-rating classification (currently UL R15140)"
      - "Position 2: featured architect-salience cert (currently IAPMO ER-360 with star + expiration subtext)"
      - "Remaining positions: descending US-architect relevance order"
      - "Total: 6 certs (intentional design choice trading manufacturer ISO certs for US-architect certs vs v0's 7 — documented in TrustBar.tsx header comment + C11 audit)"

  MaterialCalculator:
    description: "Single-screen calculator: SF + construction type + thickness → panels/weight/trucks (no $)."
    file: "components/MaterialCalculator.tsx"
    adr: "ADR-021 (Round 6 HA1, 4/4) + Round 7 F3.R7 a11y + Round 6 F1.R6 validation"
    sectionBackground: "{colors.bg-soft}"
    formCard: "{components.card-default} with shadow-sm and p-6 md:p-8"
    inputs: "{components.input-text}"
    labels: "{components.input-label}"
    resultCard: "{components.card-emphasis}"
    resultNumber: "{typography.fonts.display} {typography.sizes.3xl} {typography.weights.bold} color {colors.navy}"
    submitButton: "{components.button-primary}"
    errorRegion: "background {colors.error-bg} border {colors.error-border}/40 color {colors.error-text}"
    a11y:
      - "fieldset + legend.sr-only for semantic input grouping"
      - "aria-required, aria-invalid, aria-describedby pattern on every required input"
      - "aria-hidden on visual asterisks (steel color)"
      - "aria-live=polite on result region"
      - "WCAG AA contrast pre-validated 2026-05-10"

  ProductCard:
    description: "Photo-first product summary card. Brand placeholder when no photo delivered."
    file: "components/ProductCard.tsx"
    adr: "ADR-013 (Round 2 VB1, user-locked from 2-2 split)"
    container: "{components.card-default} as Link with focus ring"
    image:
      ratio: "{shapes.aspect-ratios.product-card}"
      placeholderBackgroundColor: "{colors.navy}"
      hoverScale: 1.05
    title: "{components.heading-3}"
    body: "{components.body-small} with line-clamp-3"
    variantPills: "{shapes.radius.sm} border-{colors.bluegray}/40 px-2 py-0.5 text-xs"

  StickyCTABar:
    description: "Floating bottom bar: Call (Anna AI) + WhatsApp (Robertson) + Quote."
    file: "components/StickyCTABar.tsx"
    adr: "ADR-025 (Round 6 HE2) + ADR-026 phone strategy + Round 6 F5.R6 keyboard hiding"
    placement: "fixed inset-x-0 bottom-0 z-{elevation.layering.z-floating}"
    container: "{components.card-default} with backgroundColor {colors.navy} shadow-2xl"
    callButton: "{components.button-primary-on-dark}"
    waButton: "{components.button-outline-on-dark}"
    quoteButton: "{components.button-tertiary}"
    safeArea: "env(safe-area-inset-bottom) — respects iOS bottom-sheet"
    behavior:
      - "Hidden until scrollY > 600px"
      - "Hidden when virtual keyboard open (visualViewport.height/window.innerHeight < 0.75)"
      - "Slide-in transform 300ms"

  SiteFooter:
    description: "4-column dark footer: brand · contact · navigation · compliance."
    file: "components/SiteFooter.tsx"
    adr: "Round 7 cleanup + SB-8 copyright compliance"
    backgroundColor: "{colors.navy}"
    textColor: "{colors.white}"
    sectionPadding: "{layout.section-padding-y.standard}"
    eyebrows: "{components.heading-eyebrow} but with color {colors.bluegray}"
    legalLine: "{components.body-tiny} with color {colors.white}/55"
    certBadges: "{shapes.radius.sm} border-{colors.white}/20 px-2 py-1 text-xs text-{colors.white}/85"

  Breadcrumbs:
    description: "Inline breadcrumb trail + BreadcrumbList JSON-LD emit."
    file: "components/Breadcrumbs.tsx"
    adr: "Round 8 F1.R8 (breadcrumb @id #breadcrumb)"
    separator: "lucide-react ChevronRight h-3.5 w-3.5 color {colors.bluegray}"
    linkColor: "{colors.steel} with hover {colors.navy}"
    currentColor: "{colors.navy} font-medium"

  ProductDetailHero:
    description: "Split layout product header: kicker + h1 + body + application pills + 2 CTAs + image."
    file: "components/ProductDetailHero.tsx"
    adr: "ADR-031 (Round 8 PE1 section 1) + ADR-006 PLYCEM text-only attribution"
    grid: "{layout.grids.product-detail-hero}"
    kicker: "{components.heading-eyebrow} reading 'PLYCEM Product · Distributed by JARA International'"
    h1: "{components.heading-1} but constrained to mobile/desktop scales (no 6xl)"
    applicationPills: "{shapes.radius.full} border-{colors.bluegray}/40 bg-{colors.bg} px-3 py-1 text-xs"
    image: "{shapes.aspect-ratios.product-card} in {shapes.radius.lg} container with {colors.navy} placeholder bg"

  VariantTable:
    description: "Product variants flat table with WCAG AA sticky-first-column scrollable region."
    file: "components/VariantTable.tsx"
    adr: "ADR-027 (Round 8 PA1, 4/4) + Round 8 F2.R8 4/4-voter a11y mandate"
    outerWrapper: "{components.card-default}"
    tableContainer:
      tabIndex: 0
      role: "region"
      ariaLabel: "[product name] variant table — scroll horizontally to view all columns"
      focusOutline: "outline-2 outline-offset-2 outline-{colors.steel}"
      border: "1px solid {colors.bluegray} at 30% opacity"
      rounded: "{shapes.radius.md}"
    headerBackground: "{colors.bg-soft}"
    headerText: "{typography.fonts.sans} {typography.weights.semibold} color {colors.navy}"
    stickyColumnShadow: "{elevation.custom.sticky-col-edge}"
    rowZebra: "even rows {colors.bg-soft} at 40% opacity"
    skuColumnFont: "{typography.fonts.mono} {typography.sizes.xs}"

  ProductFAQ:
    description: "Native <details> accordion + FAQPage JSON-LD emit. Zero client JS."
    file: "components/ProductFAQ.tsx"
    adr: "ADR-018 (Round 3 SF2) + ADR-031 (Round 8 PE1 section 4)"
    outerWrapper: "{components.card-default}"
    h2: "{components.heading-3} but text-xl semibold"
    questionRow: "color {colors.navy} font-medium hover {colors.navy-dark}"
    expandIcon: "'+' character at text-xl color {colors.steel} rotates 45deg on group-open"
    answerBody: "{components.body-small}"
    divider: "divide-y divide-{colors.bluegray}/30"

  # ----- COMPONENTS NOT YET BUILT (Sprint 4–5 forward placeholders) -----
  # The Round 10 ballot will lock the form/layout decisions for these.
  # Once built, replace this comment with full token definitions.
  SubmittalForm:
    description: "[Sprint 4 — pending Round 10 R10-B vote.] Multi-step lead form."
    status: "not yet implemented"
    pending_adr: "R10-B (3-step / single-screen / calculator-first)"

  DocumentLibrary:
    description: "[Sprint 4 — pending Round 10 R10-E vote.] Email-request document list."
    status: "stub only"
    pending_adr: "R10-E (verbatim port / slim 4-doc / skip)"

  SectionNav:
    description: "Scroll-spy table of contents for long pages. Sticky sidebar on desktop + horizontal scrolling pill row on mobile, IntersectionObserver-driven active-section tracking with RAF throttle and Safari <16.4 fallback."
    file: "components/SectionNav.tsx"
    adr: "ADR-034 (Round 10 A1, 5-0 unanimous) + Round 10 F2.R10 Safari quirks fix (3/5 voter convergent)"
    desktopSidebar:
      width: "14rem"                                # w-56
      stickyOffset: "5rem"                          # top-20 — pairs with scroll-mt-20 on each section
      backgroundColor: "{colors.bg-soft}"
      padding: "1rem"                               # p-4
      rounded: "{shapes.radius.lg}"
      itemRest:
        textColor: "{colors.ink} at 75% opacity"
        hoverTextColor: "{colors.navy}"
        hoverBackgroundColor: "{colors.white}"
      itemActive:
        backgroundColor: "{colors.white}"
        textColor: "{colors.navy}"
        leftAccent: "3px solid {colors.steel}"      # border-l-[3px] border-steel
        weight: "{typography.weights.semibold}"
    mobilePillRow:
      placement: "sticky top-16 z-30"
      backgroundColor: "{colors.bg}"
      borderBottom: "1px solid {colors.bluegray}/40"
      pillRest:
        backgroundColor: "{colors.bg-soft}"
        textColor: "{colors.ink} at 75% opacity"
        rounded: "{shapes.radius.full}"
        padding: "0.375rem 0.75rem"                  # py-1.5 px-3
      pillActive:
        backgroundColor: "{colors.steel}"
        textColor: "{colors.white}"
    scrollOffset: "80px"                            # SCROLL_OFFSET_PX
    fallbackTimeoutMs: 1500                         # FALLBACK_TIMEOUT_MS — Safari <16.4 catch
    a11y:
      - "Both nav landmarks have aria-label (configurable via ariaLabel prop)"
      - "Active item carries aria-current='true'"
      - "All controls are <button type='button'> with visible focus rings"
      - "Mobile pill row uses role='navigation'"
      - "F2.R10 Gemini fix: observer.disconnect() in useEffect cleanup; rafRef cancelled on unmount; timeout cleared"
      - "F2.R10 GLM fix: 1.5s fallback timer ensures the rail never appears inert on Safari <16.4 (negative rootMargin silent ignore)"
      - "F2.R10 DeepSeek note: Safari 17+ off-by-one with percentage rootMargin under sticky positioning is accepted as cosmetic; fallback path catches the worst case"
    composition_notes:
      - "Sections in the page MUST have matching id='...' on the container AND scroll-mt-20 utility so smooth-scroll offset matches sticky-header allowance"
      - "Hash-link landing supported (visiting /foo#bar smooth-scrolls to #bar with 100ms layout-settle delay)"

  PillarPageLayout:
    description: "[Sprint 5 — pending Round 10 R10-C vote.] Subfloor pillar page composition."
    status: "not yet implemented"
    pending_adr: "R10-C (UL+IBC+CSI cards / + cost narrative / + videos / all)"

motion:
  # Transitions and animations. Keep restrained.
  transitions:
    default: "all 0.2s ease-out"
    color: "color 0.2s ease-out"
    transform: "transform 0.3s ease-out"
    sticky-bar: "transform 300ms cubic-bezier(0.4, 0, 0.2, 1)"

  accordions:
    duration: "200ms"
    timing: "ease-out"
    open: "from { height: 0 } to { height: var(--radix-accordion-content-height) }"
    close: "from { height: var(--radix-accordion-content-height) } to { height: 0 }"

  hover-scale:
    cards: "scale-105 (1.05) on group-hover with duration-300"
    arrows: "translate-x-0.5 on group-hover (subtle nudge, not a slam)"

  reduced-motion:
    rule: "All transitions MUST respect prefers-reduced-motion. Sprint 4+ components must add `motion-reduce:transition-none` where applicable."
    enforcement: "Not yet linted — add to Round 10 R10-Y CI pipeline if Y3/Y4 wins"

accessibility:
  # Pulled out as a top-level concern because every component carries WCAG AA work.
  contrast:
    target: "WCAG 2.1 AA — 4.5:1 for normal text, 3:1 for large text and UI components"
    validated:
      - "Hero gradient overlay + text-shadow: AA at all photo brightnesses (Round 5 GLM finding)"
      - "Calculator: full audit Round 7 F3.R7"
      - "VariantTable: caption + scope + role=region per Round 8 F2.R8"
    pending:
      - "Sprint 4 SubmittalForm (will inherit MaterialCalculator pattern)"
      - "Sprint 5 PillarPageLayout"

  focus:
    pattern: "outline-2 outline-offset-2 outline-{colors.steel} (light bg) | outline-{colors.white} (dark bg) | outline-{colors.navy} (form inputs)"
    rule: "Every interactive element MUST have a visible focus ring. globals.css :focus-visible base provides the default; component-specific overrides only when surface contrast demands it."

  semantics:
    headings: "Strict h1 → h2 → h3 hierarchy. Skip levels only with explicit ARIA escape hatch."
    landmarks: "Every page has main + footer landmarks via root layout. Sections use aria-labelledby."
    text-alternatives: "All decorative images use alt=\"\" + role=\"presentation\". Content images carry meaningful alt that includes 'distributed by JARA International' for brand attribution."
    forms: "fieldset + legend + label + aria-describedby for errors. aria-live='polite' for async result regions."

dark-mode:
  status: "NOT SUPPORTED. Per JARA Brand Strategy §14 + tailwind.config.ts comment 'NO darkMode'."
  rationale: "JARA brand identity is anchored on the navy/white contrast. Dark mode would invert the dominant brand cue. Tabled until a brand strategy revision in Phase 6+."

i18n:
  status: "EN primary + /es Spanish landing (per ADR-008). Bilingual support is a product feature (ValueProps + StickyCTABar lang prop), not a full localization."
  full-rollout: "Phase 6 post-launch"
---

# JARA International — Design System (DESIGN.md)

This file is the **canonical single source of truth for JARA visual design**.
Tokens above (YAML frontmatter) are machine-readable and consumed by:

- `tailwind.config.ts` — color, typography, radius tokens (manual sync today; pending Round 10 R10-Y vote for auto-export)
- `app/globals.css` — CSS variables for `--color-navy`, `--radius`, etc.
- `lib/site.ts` — brand strings (name, tagline, contact)
- Codex (5th voter from Round 10) — implementation-feasibility reasoning against this design layer
- Future CI linting (per R10-Y vote: file-only / +lint / +export / full pipeline)

The prose below explains the **why**, **history**, and **do's-and-don'ts** that
shipping engineers need but the YAML can't carry.

---

## 1. Overview — what JARA's design system is for

JARA's design system serves a **B2B distributor of premium fiber-cement panels
to the United States construction market**. Its audience is architects,
specifiers, structural engineers, general contractors, and procurement
managers. The site's job is to convey **technical credibility, schedule
reliability, and US-based responsiveness** — not to sell on price or chase
consumer aesthetics.

Three architectural pressures shaped the system:

1. **Plycem ship blockers (SB-1..SB-9, MASTER_AUDIT §5).** The site must
   *never* present as Plycem-branded. JARA is a distributor of PLYCEM
   products, not PLYCEM itself. This forces a strict separation: JARA brand
   identity foreground, PLYCEM as a manufacturer reference in body text only.
2. **AI-friendliness (ADR-014, 015).** The site is built for AI crawlers and
   citation systems alongside human readers. This favors semantic HTML,
   FAQPage JSON-LD with visible content parity, and predictable token-based
   theming over decorative one-offs.
3. **Launch-in-days (Round 2 strategic constraint).** No Stitch (ADR-011),
   no dark mode (brand §14), no decorative reuse of the three-panel symbol
   (ADR-012, brand §24). Design space is intentionally narrow.

## 2. Colors — locked palette, no expansion without consensus

The palette in the YAML frontmatter under `colors:` is **locked**. Adding any
color (especially a green, orange, or yellow accent) requires:

1. A consensus round (≥3/5 voters per ADR-032) approving the brand expansion
2. Brand-team review against JARA Brand Strategy Guidelines §12 forbidden list
3. A new entry in `colors.forbidden` if the proposed color is rejected

The semantic mappings (`primary`, `secondary`, `accent`, etc.) exist so that
component code stays brand-agnostic at the call site — components ask for
`{colors.primary}`, not `#062B49`. This keeps any future brand evolution
(post-launch palette adjustment, separate sub-brand palettes for non-PLYCEM
manufacturers, etc.) a one-file change.

Error UI deliberately uses Tailwind's red defaults (red-50/700/900). This
narrow brand-foreign tone prevents users from mistaking error states for
brand UI — a common confusion when brands repurpose their accent color for
errors.

## 3. Typography — Montserrat + Inter via next/font/google

**Two fonts, no exceptions.** Montserrat for display (h1/h2/h3, eyebrow
kickers, button text). Inter for body. Both loaded via `next/font/google`
in `app/layout.tsx` to eliminate CLS and render-blocking — this was a Round 2
GLM single-voter finding that's now enforced everywhere.

The `text-balance` utility is applied to all h1/h2/h3 via globals.css base
layer. Don't strip it without measuring the visual hit; it materially
improves headline ragging on tablet viewports.

Tracking values are spelled out (`tracking-wider`, `tracking-[0.12em]`,
`tracking-[0.18em]`) because letter-spacing is the cheapest way to signal
hierarchy without spending color or weight tokens. Use the widest setting
(0.18em) only for primary eyebrow kickers — overuse muddies the visual rhythm.

## 4. Layout — generous, container-bounded, mobile-first

All top-level sections cap at `max-w-7xl` (1280px). Page padding is
`px-6 lg:px-8` (24px mobile, 32px desktop). The vertical rhythm is the most
opinionated layout choice:

- **Hero** is the only section that gets `py-24 lg:py-32` — a deliberate
  visual exhale at the top.
- **Main sections** (ValueProps, FeaturedProducts, MaterialCalculator,
  FinalCTA) use `py-16 lg:py-24` — the standard rhythm.
- **Compact strips** (TrustBar) use `py-10 lg:py-12` so they read as glue
  between bigger sections.
- **Footer** uses `py-12 lg:py-16` — substantial but not as airy as content.

This rhythm is the most common drift target — new sections will want
"slightly less" or "slightly more" padding. Resist. Pick the existing token.
The visual rhythm only works because it's repeated.

## 5. Elevation — restraint by default

JARA brand is not flashy. Default cards use **border-bluegray/40 + shadow-sm**
— the border does most of the visual work, the shadow is just a hint. Heavier
elevation (`shadow-md`) is for emphasized states (calculator result panel)
and hover. `shadow-2xl` is reserved for floating UI (the Sticky CTA bar) so
that "shadow-2xl" reads to a future reader as a strong signal that this UI
is supposed to feel like it's "above" the page.

The custom shadow on `VariantTable`'s sticky-first-column
(`2px 0 0 0 rgba(11,27,42,0.06)`) is a 2px hairline that hints to the user
"this column is pinned and the rest scrolled." Don't replace with a normal
shadow — the hairline preserves the table grid's visual integrity.

## 6. Shapes — three radius tiers + full pills

- `rounded-sm` (4px) — small tags, variant chips, badges
- `rounded-md` (6px) — buttons, inputs, hairline borders
- `rounded-lg` (8px) — cards, panels, content containers
- `rounded-full` — application pills, icon tiles when round (not navy-square tiles)

Don't add a fourth radius value. If a UI feels like it needs one, it
probably wants different padding instead.

## 7. Components — token-first, never raw colors

Every named component above (`button-primary`, `card-default`, `Hero`, …) is
expressed in terms of the token references. New components MUST follow the
same pattern. Specifically:

- **Don't write a raw hex value in a component.** Use a token: `bg-navy`,
  `text-steel`, `border-bluegray/40`. Tailwind already exposes every
  token from the YAML above via `tailwind.config.ts`.
- **Don't reach across into a different component's "look."** If two
  components share a pattern (icon tile, application pill, eyebrow kicker),
  add a *third* token-defined element above and have both components
  reference it. The current YAML breaks them out (`icon-tile`,
  `heading-eyebrow`, etc.) precisely for this reason.
- **When in doubt, look at MaterialCalculator and ProductDetailHero.** Those
  two components have been through the most consensus review and are the
  cleanest exemplars of the token-first pattern.

## 8. Do's and Don'ts

### DO

- Use the named token references (`{colors.navy}`, `{typography.sizes.base}`,
  `{components.button-primary}`) when adding new UI.
- Update this file **in the same commit** that adds a new component or a new
  token. Per ADR-033 + §8 of MASTER_AUDIT — this is the canonical convention.
- Add WCAG 2.1 AA contrast notes for any new color combination — see the
  `accessibility:` block in the YAML for the existing pattern.
- Use `next/font/google` for any new typeface (will never happen, but the
  rule prevents accidental Google Fonts `<link>` regressions).
- Test new components at 320px, 768px, 1024px, and 1440px before review.
- Respect `prefers-reduced-motion` on any new transition.

### DON'T

- Don't introduce orange, yellow, green, royal blue, or pure black. Listed
  in `colors.forbidden` for a reason (brand guide §12).
- Don't use Space Grotesk — v0 used it; it is replaced by Montserrat.
- Don't reuse the three-panel symbol decoratively. Logo (header) and footer
  logo only (ADR-012 + brand §24).
- Don't add a dark mode. The system is light-only by brand decision
  (brand §14 + tailwind.config.ts comment).
- Don't add a fourth border-radius value. If you feel the need, the right
  fix is usually different padding, not different rounding.
- Don't put price strings, currency symbols, or `$` characters in
  components that render numeric output. The MaterialCalculator's
  `formatEstimate()` helper is the canonical no-currency formatter
  (C3 calculator gate); reuse it in any future numeric display.
- Don't compare JARA/PLYCEM to USG, Structo-Crete, or any named
  competitor in component copy (SB-3).
- Don't write `"Authorized Distributor"` or `"Distribuidor Oficial"` in
  copy without prior written Plycem approval (SB-6).
- Don't use `© The Plycem Company` anywhere. Footer copyright is always
  `© 2026 JARA International Inc.` (SB-8).
- Don't link to `@plycemca.com` email addresses. All email is
  `@jarainternational.com` (SB-9).

---

## 9. Open questions (resolved by Round 10)

The R10-Y ballot item decides **integration depth** of this file with
tooling:

- **Y1** — file-only. DESIGN.md is hand-maintained; `tailwind.config.ts`,
  `globals.css`, and `lib/site.ts` are independently edited and may drift
  from this file. No CI enforcement. **Risk:** drift.
- **Y2** — file + CLI lint in pre-commit hook. Catches WCAG contrast
  violations and structural errors before they reach a PR. Tailwind config
  still hand-maintained. **Recommended floor.**
- **Y3** — Y2 + auto-export of YAML tokens to `tailwind.config.ts` via
  CLI build step. This file becomes the *only* place colors and typography
  are edited. **Tighter, more invasive.**
- **Y4** — Y3 + diff-report bot comments on every PR that touches design
  tokens. **Maximum rigor, maximum overhead.**

This file is structured to work cleanly under any of Y1–Y4. The YAML
syntax matches the Google Labs spec for direct CLI consumption.

## 10. References

- Spec: `https://github.com/google-labs-code/design.md`
- ADR-033 (DESIGN.md adoption): `docs/MASTER_AUDIT.md` §7
- Convention rule: `docs/MASTER_AUDIT.md` §8 (DESIGN.md sync in same commit)
- Brand source: `Jara Brand Guideline/JARA_International_Brand_Strategy_Guidelines.pdf`
- Plycem ship blockers: `docs/MASTER_AUDIT.md` §5 (SB-1..SB-9)
- Round 2 visual locks: `docs/history/consensus/round2_synthesis.md`
- Round 6 home layout locks: `docs/history/consensus/round6_synthesis.md`
- Round 8 product detail locks: `docs/history/consensus/round8_synthesis.md`
