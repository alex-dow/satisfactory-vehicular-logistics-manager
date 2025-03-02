/** @type {import('tailwindcss').Config} */
import primeui from "tailwindcss-primeui";

//const primeui = require("tailwindcss-primeui");
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  plugins: [primeui],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#AD6840",
        secondary: "white",
      },
      fontFamily: {
        serif: ["serif"],
      },
      fontSize: {
        // "2xl": ["12.5rem"],
      },
    },
  },
};
