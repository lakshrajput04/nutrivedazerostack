/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Sage green: the single brand accent
        brand: {
          50: '#f3f7f4',
          100: '#e3ede6',
          200: '#c7dbcd',
          300: '#a0c1ab',
          400: '#73a084',
          500: '#528366',
          600: '#3f6a51',
          700: '#345643',
          800: '#2c4638',
          900: '#253b30',
        },
        // Warm neutral grays for text, borders and surfaces
        ink: {
          50: '#fafaf9',
          100: '#f4f4f2',
          200: '#e7e6e2',
          300: '#d4d2cc',
          400: '#a8a59c',
          500: '#78756c',
          600: '#5c5a52',
          700: '#46443e',
          800: '#2f2e2a',
          900: '#1d1c1a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(29, 28, 26, 0.04), 0 1px 3px rgba(29, 28, 26, 0.06)',
      },
    },
  },
  plugins: [],
}
