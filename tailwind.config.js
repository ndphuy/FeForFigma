/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F1FAF6',
          100: '#DDF3EA',
          200: '#B2E2D0',
          300: '#7BCCAF',
          400: '#3EAF89',
          500: '#0F9D76', // Primary token
          600: '#0B7A5C', // Primary deep
          700: '#096048',
          800: '#074837',
          900: '#053327',
        },
        primary: {
          DEFAULT: '#0F9D76',
          deep: '#0B7A5C',
          hover: '#0B8A66',
          soft: '#DDF3EA',
          tint: '#F1FAF6',
        },
        highlight: {
          DEFAULT: '#EE7A22',
          hover: '#D96A16',
          light: '#FFF1E4',
          dark: '#B45812',
        },
        accent: {
          DEFAULT: '#EE7A22',
          light: '#FFF1E4',
          subtle: '#FFF4E9',
          border: '#F7D9B8',
          dark: '#8A4A0B',
        },
        danger: {
          DEFAULT: '#C22B35',
          hover: '#A8232C',
          light: '#FCEBEB',
        },
        info: {
          DEFAULT: '#0A6E7A',
          soft: '#DDF1F4',
        },
        canvas: '#F4F7F5',
        background: '#F4F7F5',
        surface: '#FFFFFF',
        card: '#FFFFFF',
        border: {
          DEFAULT: '#E4EAE7',
          subtle: '#EEF2F0',
          line: '#DFE7E3',
        },
        textPrimary: '#101B17',
        textSecondary: '#4B5A54',
        textTertiary: '#8A9993',
      },
      fontFamily: {
        sans: ['"Be Vietnam Pro"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(16, 27, 23, 0.05)',
        elevated: '0 8px 24px rgba(16, 27, 23, 0.07)',
        bezel: '0 24px 60px rgba(16, 27, 23, 0.20)',
        button: '0 8px 22px rgba(15, 157, 118, 0.30)',
        orangeButton: '0 8px 22px rgba(238, 122, 34, 0.30)',
        dangerButton: '0 8px 22px rgba(194, 43, 53, 0.36)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
        'card': '24px',
        'modal': '28px',
      }
    },
  },
  plugins: [],
}
