/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        verdeSalvia: '#A8BBA1',
        beigeMadera: '#EBDAC6',
        marronTierra: '#9C6F48',
        blancoAlgodon: '#FAF9F7',
        mostazaSuave: '#D5A253',
        cream: '#FAF9F7',
        brown: '#9C6F48',
        beigeDark: '#EBDAC6',
        greenSoft: '#bfd992',
        greenDark: '#81977B',
        brownDark: '#3A2A25',
        terracotaOscuro: '#95200b',
        verdesuave: '#A3B899',
        Cafe: '#3A2A25',
        verdeoscuro: '#6C7859',
      },
      container: {
        center: true,
        padding: "1rem",
      },
      keyframes: {
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-down': 'fade-in-down 0.6s ease-out',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
      },
      safelist: [
        'object-[47%]',
        'object-[48%]',
        'object-[49%]',
        'object-[50%]'
      ]      
    }
  },
  plugins: [],
}
