/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  important: false,
  // Active dark mode on class basis
  darkMode: "class",
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US"
  },
  theme: {
    fontFamily: {
      roboto: ['"Roboto Flex"'], // Ensure fonts with spaces have " " surrounding it.
      gilroy: ['Gilroy']
    },
    extend: {
      colors: {
        dark: "#141318",
        lightblue: "#18A3DC",
        turquoise: "#21DBD3",
        lightgray: "#D5E6EF",
        darkturquoise: "#19A8A2",
        darkestturq: "#192C2E",
        warning: "#A7652C"
      },
      backgroundImage: theme => ({
        check: "url('/icons/check.svg')",
        landscape: "url('/images/landscape/2.jpg')"
      }),
      dropShadow: 'filter: drop-shadow(0 0 1px #4cf2f8);'
    }
  },
  variants: {
    extend: {
      backgroundColor: ["checked"],
      borderColor: ["checked"],
      inset: ["checked"],
      zIndex: ["hover", "active"]
    }
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
  future: {
    purgeLayersByDefault: true
  }
};
