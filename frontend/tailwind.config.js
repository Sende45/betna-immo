/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Toujours essentiel pour scanner tes composants
  ],
  theme: {
    extend: {
      // On ajoute des arrondis plus "smooth" typiques des apps modernes
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      // On peut définir des animations personnalisées ici si besoin
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Ajoute ce plugin pour les effets d'apparition
  ],
}