/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ['"Bebas Neue"', "Impact", "sans-serif"],
      },
      colors: {
        court: {
          950: "#070b17",
          900: "#0b1224",
          800: "#121b34",
          700: "#1b2747",
        },
        hardwood: "#f0a04b",
      },
    },
  },
  plugins: [],
};
