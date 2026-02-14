/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // <--- C'EST CETTE LIGNE QUI EST IMPORTANTE
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}