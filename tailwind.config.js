/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  darkMode: ["media"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        "Pinyon-Script": ["Pinyon Script"],
      },
      screens: {
        sm: "480px",
        md: "768px",
        lg: "976px",
        xl: "1440px",
      },
      colors: {
        appColors: {
          primary: "#6B079C",
          primaryLight: "#A855F7",
          primaryVeryLight: "#FAE8FF",
          primaryTransparent: "#8712c00d",
          success: "#22c55E",
          lightSuccess: "#73dc77",
          gray: "#71717A",
          darkGray: "#18181B",
          lightGray: "#A1A1AA",
          veryLightGray: "#D4D4D8",
          veryVeryLightGray: "#f4f4f5",
          info: "#0284C7",
          warning: "#EA580C",
          error: "#DC2626",
          rose: "#F87171",
          lightRose: "#FECDD3",
        },

        brandColor: {
          50: "#FAF5FF",
          100: "#FAE8FF",
          200: "#E9D5FF",
          300: "#D8B4FE",
          400: "#C084FC",
          500: "#A855F7",
          600: "#6B079C",
          700: "#520578",
          800: "#520578",
          900: "#520578",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("tailwindcss-animate")],
};
