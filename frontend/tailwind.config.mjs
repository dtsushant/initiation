import scrollbar from 'tailwind-scrollbar';
import sb from 'tailwind-scrollbar-hide';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  important: true,
  content: ["./src/**/*.{ts,tsx}", "./src/styles/**/*.css"],
  plugins: [
    sb(),
    scrollbar()
  ],
  attributify: true,
  theme: {
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }
    },
    extend: {
      backgroundClip: {
        text: "text",
      },
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          light: "var(--color-primary-light)",
          hover: "var(--color-primary-hover)",
          focus: "var(--color-primary-focus)",
          link: "var(--color-primary-link)",
          black: "var(--color-primary-black)",
        },
        // Golden Yellow
        goldenyellow: {
          1: "var(--goldenyellow-1)",
          2: "var(--goldenyellow-2)",
          3: "var(--goldenyellow-3)",
          4: "var(--goldenyellow-4)",
          5: "var(--goldenyellow-5)",
          6: "var(--goldenyellow-6)",
          7: "var(--goldenyellow-7)",
          8: "var(--goldenyellow-8)",
          9: "var(--goldenyellow-9)",
          10: "var(--goldenyellow-10)",
        },
        // Bright Orange
        brightorange: {
          1: "var(--brightorange-1)",
          2: "var(--brightorange-2)",
          3: "var(--brightorange-3)",
          4: "var(--brightorange-4)",
          5: "var(--brightorange-5)",
          6: "var(--brightorange-6)",
          7: "var(--brightorange-7)",
          8: "var(--brightorange-8)",
          9: "var(--brightorange-9)",
          10: "var(--brightorange-10)",
        },
        // Blaze Orange
        blazeorange: {
          1: "var(--blazeorange-1)",
          2: "var(--blazeorange-2)",
          3: "var(--blazeorange-3)",
          4: "var(--blazeorange-4)",
          5: "var(--blazeorange-5)",
          6: "var(--blazeorange-6)",
          7: "var(--blazeorange-7)",
          8: "var(--blazeorange-8)",
          9: "var(--blazeorange-9)",
          10: "var(--blazeorange-10)",
        },
        // Fiery Orange
        fieryorange: {
          1: "var(--fieryorange-1)",
          2: "var(--fieryorange-2)",
          3: "var(--fieryorange-3)",
          4: "var(--fieryorange-4)",
          5: "var(--fieryorange-5)",
          6: "var(--fieryorange-6)",
          7: "var(--fieryorange-7)",
          8: "var(--fieryorange-8)",
          9: "var(--fieryorange-9)",
          10: "var(--fieryorange-10)",
        },
        // Ferrari Red
        ferrarired: {
          1: "var(--ferrarired-1)",
          2: "var(--ferrarired-2)",
          3: "var(--ferrarired-3)",
          4: "var(--ferrarired-4)",
          5: "var(--ferrarired-5)",
          6: "var(--ferrarired-6)",
          7: "var(--ferrarired-7)",
          8: "var(--ferrarired-8)",
          9: "var(--ferrarired-9)",
          10: "var(--ferrarired-10)",
        },
        // Emerald Green
        emeraldgreen: {
          1: "var(--emeraldgreen-1)",
          2: "var(--emeraldgreen-2)",
          3: "var(--emeraldgreen-3)",
          4: "var(--emeraldgreen-4)",
          5: "var(--emeraldgreen-5)",
          6: "var(--emeraldgreen-6)",
          7: "var(--emeraldgreen-7)",
          8: "var(--emeraldgreen-8)",
          9: "var(--emeraldgreen-9)",
          10: "var(--emeraldgreen-10)",
        },
        // Neutral
        neutral: {
          1: "var(--neutral-1)",
          2: "var(--neutral-2)",
          3: "var(--neutral-3)",
          4: "var(--neutral-4)",
          5: "var(--neutral-5)",
          6: "var(--neutral-6)",
          7: "var(--neutral-7)",
          8: "var(--neutral-8)",
          9: "var(--neutral-9)",
          10: "var(--neutral-10)",
          11: "var(--neutral-11)",
          12: "var(--neutral-12)",
          13: "var(--neutral-13)",
        },
        // Blue
        blue: {
          1: "var(--blue-1)",
          2: "var(--blue-2)",
          3: "var(--blue-3)",
          4: "var(--blue-4)",
          5: "var(--blue-5)",
          6: "var(--blue-6)",
          7: "var(--blue-7)",
          8: "var(--blue-8)",
          9: "var(--blue-9)",
          10: "var(--blue-10)",
        },
        // Violet
        violet: {
          1: "var(--violet-1)",
          2: "var(--violet-2)",
          3: "var(--violet-3)",
          4: "var(--violet-4)",
          5: "var(--violet-5)",
          6: "var(--violet-6)",
          7: "var(--violet-7)",
          8: "var(--violet-8)",
          9: "var(--violet-9)",
          10: "var(--violet-10)",
        },
      },
    },
  },
};
