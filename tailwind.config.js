/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fbf5ef',
          100: '#f4e6d2',
          200: '#e9caa3',
          300: '#dba970',
          400: '#cb8744',
          500: '#b56b2b',
          600: '#965220',
          700: '#7a3f19',
          800: '#603115',
          900: '#4c2610',
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
        page: '#f8f6f3',
        /* Vert sauge — sold items */
        success: {
          50:  '#f2f7f0',
          100: '#e2eede',
          200: '#c4ddbf',
          300: '#99c491',
          400: '#69a660',
          500: '#4a8742',
          600: '#396c33',
          700: '#2d5528',
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
        card:  '0 1px 0 0 rgb(0 0 0 / 0.03), 0 1px 3px 0 rgb(0 0 0 / 0.04)',
        float: '0 8px 32px -8px rgb(15 15 13 / 0.18), 0 2px 6px rgb(15 15 13 / 0.06)',
      },
    },
  },
  plugins: [],
};
