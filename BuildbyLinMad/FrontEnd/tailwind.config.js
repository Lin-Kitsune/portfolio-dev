/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        fondo: '#0D0D0D',
        primario: '#7F00FF',
        hover: '#5A32A3',
        grisCard: '#1A1A1A',
        textoSecundario: '#C2B9FF',
        blancoHueso: '#F4F4F5',
        acento: '#00FFFF',
      }
    },
  },
  plugins: [],
}
