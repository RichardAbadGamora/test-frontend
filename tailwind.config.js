/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',

  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],

  safelist: [
    'font-semibold',
    'text-typo'
  ],

  blocklist: [
    'text-xs',
    'text-sm',
    'text-base',
    'text-lg',
    'text-xl',
    'text-2xl',
    'text-3xl',
    'text-4xl',
    'text-5xl',
    'text-6xl',
    'text-7xl',
    'text-8xl',
    'text-9xl',
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          950: 'var(--color-primary-950)',
          DEFAULT: 'var(--color-primary)',
          rgb: 'var(--color-primary-rgb)',
          contrast: 'var(--color-primary-contrast)',
          'contrast-rgb': 'var(--color-primary-contrast-rgb)',
          shade: 'var(--color-primary-shade)',
          tint: 'var(--color-primary-tint)',
          disabled: 'var(--color-primary-disabled)',
        },

        typo: {
          DEFAULT: 'var(--color-typo)',
          50: 'var(--color-typo-50)',
          100: 'var(--color-typo-100)',
          200: 'var(--color-typo-200)',
          300: 'var(--color-typo-300)',
          400: 'var(--color-typo-400)',
          500: 'var(--color-typo-500)',
          600: 'var(--color-typo-600)',
          700: 'var(--color-typo-700)',
          800: 'var(--color-typo-800)',
          900: 'var(--color-typo-900)',
          950: 'var(--color-typo-950)',
        },
      },

      fontSize: {
        'app-3xs': ['var(--font-3xs)', '0.7rem'],
        'app-2xs': ['var(--font-2xs)', '0.85rem'],
        'app-xs': ['var(--font-xs)', '1rem'],
        'app-sm': ['var(--font-sm)', '1.25rem'],
        'app-base': ['var(--font-base)', '1.5rem'],
        'app-lg': ['var(--font-lg)', '1.75rem'],
        'app-xl': ['var(--font-xl)', '1.75rem'],
        'app-2xl': ['var(--font-2xl)', '2rem'],
        'app-3xl': ['var(--font-3xl)', '2.25rem'],
        'app-4xl': ['var(--font-4xl)', '2.5rem'],
        'app-5xl': ['var(--font-5xl)', '1'],
        'app-6xl': ['var(--font-6xl)', '1'],
        'app-7xl': ['var(--font-7xl)', '1'],
        'app-8xl': ['var(--font-8xl)', '1'],
        'app-9xl': ['var(--font-9xl)', '1'],
      },

      screens: {
        '3xl': '1792px',
        '4xl': '2048px',
        '5xl': '2304px',
        '6xl': '2560px',
        '7xl': '2816px',
        '8xl': '3072px',
        '9xl': '3328px',
      }
    },
  },

  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
  ],
}
