/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nutri: {
          primary: "#C0A080",
          secondary: "#D4B99D",
          dark: "#1C1917",
          card: "#26221F",
          accent: "#8E7960",
          light: "#FDFBF7",
          border: "#E7E5E4",
        }
      }
    },
  },
  plugins: [],
}
