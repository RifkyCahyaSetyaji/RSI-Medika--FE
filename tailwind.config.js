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
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        dr: {
          grade0: '#10b981', // green - No DR
          grade1: '#f59e0b', // yellow/amber - Mild NPDR
          grade2: '#f97316', // orange - Moderate NPDR (Referable)
          grade3: '#ef4444', // red - Severe NPDR (Urgent Referable)
          grade4: '#b91c1c', // deep red/maroon - Proliferative DR (Emergency)
        }
      },
    },
  },
  plugins: [],
}
