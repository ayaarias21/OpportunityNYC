/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#2D4A3E",
        "forest-dark": "#1F362D",
        accent: "#3D6E96",       // was terracotta orange, now blue
        "accent-dark": "#2E5573",
        cream: "#F7F3EC",
        sand: "#E8DFC8",
        "sage-tint": "#DCE6D6",
        "peach-tint": "#F4DBC6",
        lavender: "#E5DEF0",
        charcoal: "#26241F",
        "warm-gray": "#6E6858",
      },
      fontFamily: {
        serif: ['"Fraunces"', "serif"],
        sans: ['"IBM Plex Sans"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "monospace"],
      },
    },
  },
  plugins: [],
};
