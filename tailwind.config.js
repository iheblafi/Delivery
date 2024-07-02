/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: "#161622",
          secondary: {
            DEFAULT: "#3da58a",
            100: "#3da58a",
            200: "#3da58a",
          },
          black: {
            DEFAULT: "#000",
            100: "#1E1E2D",
            200: "#232533",
          },
          greenesh: '#3da58a',
  
          gfe: '#fffeee',
  
          gray: {
            100: "#CDCDE0",
          },
        },
        fontFamily: {
          pthin: ["Poppins-Thin", "sans-serif"],
          pextralight: ["Poppins-ExtraLight", "sans-serif"],
          plight: ["Poppins-Light", "sans-serif"],
          pregular: ["Poppins-Regular", "sans-serif"],
          pmedium: ["Poppins-Medium", "sans-serif"],
          psemibold: ["Poppins-SemiBold", "sans-serif"],
          pbold: ["Poppins-Bold", "sans-serif"],
          pextrabold: ["Poppins-ExtraBold", "sans-serif"],
          pblack: ["Poppins-Black", "sans-serif"],
        },
      },
    },
    plugins: [],
  };