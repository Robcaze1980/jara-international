import type { Config } from 'tailwindcss'

// ADR locked: NO darkMode (JARA brand is light-only per brand guide §14)
const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // JARA Brand palette — locked per JARA Brand Strategy §10-11
        // FORBIDDEN per §12: bright royal blue, orange, red, green, yellow, pure black
        navy: {
          DEFAULT: '#062B49', // Primary Navy
          dark: '#04233D',    // Dark Navy alternative
        },
        steel: {
          DEFAULT: '#5F7894', // Medium Steel Blue
        },
        bluegray: {
          DEFAULT: '#B8C7D6', // Light Blue-Gray
        },
        bg: {
          DEFAULT: '#FFFFFF',
          soft: '#F4F6F8',    // Soft Background Gray
        },
        ink: {
          DEFAULT: '#1F2933', // Body Text Charcoal (NOT pure black per §12)
        },
        // Semantic mappings (used throughout components)
        background: '#FFFFFF',
        foreground: '#1F2933',
        primary: {
          DEFAULT: '#062B49',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F4F6F8',
          foreground: '#062B49',
        },
        muted: {
          DEFAULT: '#F4F6F8',
          foreground: '#5F7894',
        },
        accent: {
          DEFAULT: '#5F7894',
          foreground: '#FFFFFF',
        },
        border: '#B8C7D6',
        input: '#B8C7D6',
        ring: '#5F7894',
      },
      fontFamily: {
        // ADR Phase 2: next/font/google for Montserrat + Inter (no CLS, no render-block)
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['var(--font-montserrat)', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
