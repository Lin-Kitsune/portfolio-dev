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
          cream: '#FAF9F7',            // alias
          brown: '#9C6F48',            // alias
          beigeDark: '#EBDAC6',        // alias
          greenSoft: '#bfd992',        // alias
          greenDark: '#81977B',         // inventado para el hover
          brownDark: '#3A2A25',
          terracotaOscuro: '#95200b',
          verdesuave: '#A3B899'
      },
      container: {
        center: true, // Centrar contenedor globalmente
        padding: "1rem", // Añadir padding para evitar desbordes en móviles
      },
      
      }
    },
    plugins: [],
  }
  