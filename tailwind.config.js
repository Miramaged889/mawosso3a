/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ivory': '#FDF9F3',
        'dark-gray': '#333333',
        'blue-gray': '#2A3A3F',
        'heritage-gold': '#A68C5D',
        'olive-green': '#3B6E3B',
        'medium-gray': '#6C757D',
        'hover-beige': '#EADAC0',
      },
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
        'amiri': ['Amiri', 'serif'],
        'louguiya': ['Louguiya', 'serif'],
      },
    },
  },
  plugins: [],
}