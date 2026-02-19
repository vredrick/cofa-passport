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
        ocean: {
          DEFAULT: '#1B4F72',
          light: '#2471A3',
          dark: '#154360',
        },
        gold: {
          DEFAULT: '#C4952A',
          light: '#D4AC2B',
          dark: '#A67C22',
        },
      },
    },
  },
  plugins: [],
};
export default config;
