/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#87CEFA",
        secondary: "#FF6347",
        accent: "#FFD700",
        white: "#FFFFFF",
        black: "#000000",
        gray: {
          100: "#F8F9FA",
          200: "#E9ECEF",
          300: "#DEE2E6",
          400: "#CED4DA",
          500: "#ADB5BD",
        },
        light: {
          100: "#F0F8FF",
          200: "#E6E6FA",
          300: "#FFF0F5",
          400: "#FFF5EE",
          500: "#FFF8DC",
        },
        dark: {
          100: "#2F4F4F",
          200: "#696969",
          300: "#708090",
          400: "#778899",
          500: "#B0C4DE",
        },
        green: {
          100: "#98FB98",
          200: "#90EE90",
          300: "#32CD32",
          400: "#228B22",
          500: "#006400",
        },
        red: {
          100: "#FF7F7F",
          200: "#FF4500",
          300: "#FF0000",
          400: "#DC143C",
          500: "#B22222",
        },
        blue: {
          100: "#ADD8E6",
          200: "#87CEFA",
          300: "#4682B4",
          400: "#4169E1",
          500: "#0000FF",
        },
      },
    },
  },
  plugins: [],
}