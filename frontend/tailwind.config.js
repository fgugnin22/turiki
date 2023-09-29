/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  important: true,
  // Active dark mode on class basis
  darkMode: "class",
  i18n: {
    locales: ["en-US"],
    defaultLocale: "en-US"
  },
  theme: {
    fontFamily: {
      roboto: ['"Roboto Flex"'] // Ensure fonts with spaces have " " surrounding it.
    },
    extend: {
      backgroundImage: theme => ({
        check: "url('/icons/check.svg')",
        landscape: "url('/images/landscape/2.jpg')"
      })
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
