/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eefcfb',
          100: '#d4f7f4',
          200: '#abeee9',
          300: '#74dfd9',
          400: '#3cc7c2',
          500: '#1faaa6',
          600: '#168a88',
          700: '#136f6e',
          800: '#125858',
          900: '#114a4a',
        },
        ink: {
          50:  '#f7f7f6',
          100: '#eeeeec',
          200: '#dededb',
          300: '#bdbdb8',
          400: '#8b8b85',
          500: '#5d5d57',
          600: '#3f3f3a',
          700: '#2a2a26',
          800: '#1c1c19',
          900: '#0f0f0d',
        },
        page: '#f5f5f3',
        success: {
          50:  '#ecfdf3',
          100: '#d1fadf',
          500: '#16a34a',
          600: '#15803d',
          700: '#166534',
        },
        danger: {
          50:  '#fef2f2',
          500: '#dc2626',
          600: '#b91c1c',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgb(0 0 0 / 0.03), 0 1px 3px 0 rgb(0 0 0 / 0.04)',
        float: '0 8px 32px -8px rgb(15 15 13 / 0.18), 0 2px 6px rgb(15 15 13 / 0.06)',
      },
    },
  },
  plugins: [],
};
