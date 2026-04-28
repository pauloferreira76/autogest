import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Mono', 'monospace'],
      },
      colors: {
        ink:  { DEFAULT: '#0c0e1a', 2: '#374151', 3: '#6b7280', 4: '#9ca3af' },
        surf: { DEFAULT: '#ffffff', 2: '#f8f9fd', 3: '#eef1f8' },
        bdr:  { DEFAULT: '#e2e7f2', 2: '#ccd3e5' },
        brand: {
          DEFAULT: '#1a56db', dark: '#1647c1', light: '#3b7ef8',
          bg: '#eff6ff', bd: '#bdd3ff', text: '#1035a0',
        },
        em: {
          DEFAULT: '#059669', dark: '#047857',
          bg: '#ecfdf5', bd: '#6ee7b7', text: '#065f46',
        },
        vi: {
          DEFAULT: '#7c3aed', dark: '#6d28d9',
          bg: '#f5f3ff', bd: '#c4b5fd', text: '#4c1d95',
        },
        am: {
          DEFAULT: '#d97706',
          bg: '#fffbeb', bd: '#fcd34d', text: '#92400e',
        },
        ro: {
          DEFAULT: '#e11d48',
          bg: '#fff1f2', bd: '#fda4af', text: '#9f1239',
        },
      },
      borderRadius: {
        xs: '6px', sm: '8px', DEFAULT: '10px',
        md: '12px', lg: '14px', xl: '20px',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
        xs:    ['0.75rem',   { lineHeight: '1.125rem' }],
        sm:    ['0.8125rem', { lineHeight: '1.25rem' }],
        base:  ['0.875rem',  { lineHeight: '1.375rem' }],
        md:    ['0.9375rem', { lineHeight: '1.5rem' }],
      },
    },
  },
  plugins: [],
}

export default config
