import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FBF6F7",
          dark: "#F3E7EB",
        },
        ink: {
          DEFAULT: "#241B22",
          soft: "#6B5A63",
        },
        forest: {
          DEFAULT: "#0E5C52",
          dark: "#093F38",
        },
        gold: {
          DEFAULT: "#B23A6B",
          light: "#E091B4",
        },
        rule: "#E3D3DA",
        blush: "#E091B4",
        white: "#FFFDFB",
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
