/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-quicksand)", "sans-serif"],
        heading: ["var(--font-mochiy)", "sans-serif"],
      },
    },
  },
  plugins: [],
}


