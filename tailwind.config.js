/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#FDF9F3",
        "dark-gray": "#333333",
        "blue-gray": "#2A3A3F",
        "heritage-gold": "#A68C5D",
        "heritage-gold-dark": "#6B5436", // Much darker for WCAG AA compliance (4.5:1)
        "olive-green": "#3B6E3B",
        "medium-gray": "#6C757D",
        "hover-beige": "#EADAC0",
      },
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        amiri: ["Amiri", "serif"],
        louguiya: ["Louguiya", "serif"],
      },
      fontSize: {
        // Override default sizes to fix H1UserAgentFontSizeInSection warning
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem",
        "6xl": "3.75rem",
      },
    },
  },
  plugins: [
    function ({ addBase }) {
      addBase({
        h1: { fontSize: "2.25rem", lineHeight: "2.5rem" },
        h2: { fontSize: "1.875rem", lineHeight: "2.25rem" },
        h3: { fontSize: "1.5rem", lineHeight: "2rem" },
        h4: { fontSize: "1.25rem", lineHeight: "1.75rem" },
        h5: { fontSize: "1.125rem", lineHeight: "1.75rem" },
        h6: { fontSize: "1rem", lineHeight: "1.5rem" },
      });
    },
  ],
};
