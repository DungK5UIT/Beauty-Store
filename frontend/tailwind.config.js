/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
     "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        pink: {
          600: '#db2777',
          700: '#be185d'
        }
      }
    },
  },
  plugins: [],
}

export default withUt(config);