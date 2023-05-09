const defaultTheme = require('tailwindcss/defaultTheme');

// -delete colors['bg-primaryOrange'];
// -delete colors['primaryOrange'];

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    extend: {
      spacing: {
        128: '32rem',
      },
      colors: {
        black: '#111111',
        brand: {
          //   https://javisperez.github.io/tailwindcolorshades
          50: '#fff9f2',
          100: '#fff3e6',
          200: '#ffe2bf',
          300: '#ffd199',
          400: '#ffae4d',
          500: '#ff8b00',
          600: '#e67d00',
          700: '#bf6800',
          800: '#995300',
          900: '#7d4400',
          DEFAULT: '#FF8B00',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        neutral: {
          50: '#F8F8F8',
          100: '#F5F5F5',
          200: '#E1E1E1',
          300: '#CFCFCF',
          400: '#ACACAC',
          500: '#888888',
          600: '#494949',
          700: '#3E3E3E',
          800: '#313131',
          900: '#292929',
        },
        primary: {
          50: '#F4F4F4',
          100: '#E8E8E8',
          200: '#C6C6C6',
          300: '#A3A3A3',
          400: '#5F5F5F',
          500: '#1A1A1A',
          600: '#171717',
          700: '#141414',
          800: '#101010',
          900: '#0D0D0D',
        },
        secondary: {
          50: '#F5F8F7',
          100: '#EBF0F0',
          200: '#CDDAD9',
          300: '#AEC4C2',
          400: '#729894',
          500: '#356C66',
          600: '#30615C',
          700: '#28514D',
          800: '#20413D',
          900: '#223B41',
        },
        red: {
          50: '#FFF5F5',
          100: '#FFE3E2',
          200: '#FFC9C9',
          300: '#FEA8A8',
          400: '#FF8787',
          500: '#FF6B6B',
          600: '#FA5352',
          700: '#F03E3F',
          800: '#E03130',
          900: '#C92B2B',
        },
        orange: {
          50: '#FFF4E5',
          100: '#FFE8CC',
          200: '#FFD8A8',
          300: '#FFBF78',
          400: '#FFA94E',
          500: '#FF922B',
          600: '#FD7E14',
          700: '#F76706',
          800: '#E8580C',
          900: '#D94810',
        },
        green: {
          50: '#EBFCEE',
          100: '#D2F9D9',
          200: '#B1F2BA',
          300: '#8CE99A',
          400: '#69DB7C',
          500: '#51CF66',
          600: '#40C057',
          700: '#36B24D',
          800: '#2F9E44',
          900: '#2B8A3E',
        },
        blue: {
          50: '#E7F5FF',
          100: '#D0EBFF',
          200: '#A4D8FF',
          300: '#74C0FC',
          400: '#4DABF7',
          500: '#339AF0',
          600: '#238BE6',
          700: '#1C7ED7',
          800: '#1971C2',
          900: '#1763AB',
        },
        darkgray: {
          50: '#101010',
          100: '#1c1c1c',
          200: '#2b2b2b',
          300: '#444444',
          400: '#575757',
          500: '#767676',
          600: '#a5a5a5',
          700: '#d6d6d6',
          800: '#e8e8e8',
          900: '#f3f4f6',
        },
      },
      keyframes: {
        'fade-in-up': {
          '0%': {
            opacity: 0.75,
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        enterFromRight: {
          from: { opacity: 0, transform: 'translateX(200px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        enterFromLeft: {
          from: { opacity: 0, transform: 'translateX(-200px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
        exitToRight: {
          from: { opacity: 1, transform: 'translateX(0)' },
          to: { opacity: 0, transform: 'translateX(200px)' },
        },
        exitToLeft: {
          from: { opacity: 1, transform: 'translateX(0)' },
          to: { opacity: 0, transform: 'translateX(-200px)' },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'rotateX(-10deg) scale(0.9)' },
          to: { opacity: 1, transform: 'rotateX(0deg) scale(1)' },
        },
        scaleOut: {
          from: { opacity: 1, transform: 'rotateX(0deg) scale(1)' },
          to: { opacity: 0, transform: 'rotateX(-10deg) scale(0.95)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fadeOut: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
      },
      screens: {
        pwa: { raw: '(display-mode: standalone)' },
      },
      animation: {
        scaleIn: 'scaleIn 200ms ease',
        scaleOut: 'scaleOut 200ms ease',
        fadeIn: 'fadeIn 200ms ease',
        fadeOut: 'fadeOut 200ms ease',
        enterFromLeft: 'enterFromLeft 250ms ease',
        enterFromRight: 'enterFromRight 250ms ease',
        exitToLeft: 'exitToLeft 250ms ease',
        exitToRight: 'exitToRight 250ms ease',
        'fade-in-up': 'fade-in-up 0.35s cubic-bezier(.21,1.02,.73,1)',
      },
      boxShadow: {
        dropdown: '0px 2px 6px -1px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        mono: ['Roboto Mono', 'monospace'],
        sans: ['"Inter var"', 'sans-serif'],
      },
      maxHeight: (theme) => ({
        0: '0',
        97: '25rem',
        ...theme('spacing'),
        full: '100%',
        screen: '100vh',
      }),
      minHeight: (theme) => ({
        0: '0',
        ...theme('spacing'),
        full: '100%',
        screen: '100vh',
      }),
      minWidth: (theme) => ({
        0: '0',
        ...theme('spacing'),
        full: '100%',
        screen: '100vw',
      }),
      maxWidth: (theme, { breakpoints }) => ({
        0: '0',
        ...theme('spacing'),
        ...breakpoints(theme('screens')),
        full: '100%',
        screen: '100vw',
      }),
      backgroundImage: {
        'gradient-primary':
          'radial-gradient(162.05% 170% at 109.58% 35%, #667593 0%, #E3E3E3 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar'),
    require('tailwindcss-radix')(),
  ],
};
