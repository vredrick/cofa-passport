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
          focus: '#FFD700',
        },
        surface: '#F0F4F8',
        ink: '#102A43',
        muted: '#486581',
        error: '#D64545',
      },
      fontFamily: {
        display: ['"Public Sans"', 'system-ui', 'sans-serif'],
        body: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        hard: '4px 4px 0 #1B4F72',
        'hard-sm': '2px 2px 0 #1B4F72',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
};
export default config;
