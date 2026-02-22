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
          deep: '#0B2136',
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
        sans: ['var(--font-sans)', '"Public Sans"', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', '"DM Serif Display"', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', '"Space Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        hard: '4px 4px 0 #1B4F72',
        'hard-sm': '2px 2px 0 #1B4F72',
        card: '0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(27,79,114,0.06)',
        'card-hover': '0 4px 16px rgba(27,79,114,0.12)',
        premium: '0 20px 40px -15px rgba(27, 79, 114, 0.25)',
        'premium-hover': '0 30px 60px -15px rgba(27, 79, 114, 0.4)',
        'glow-ocean': '0 0 40px -10px rgba(36, 113, 163, 0.5)',
        smooth: '0 20px 40px -10px rgba(0,0,0,0.15)',
      },
      borderWidth: {
        '3': '3px',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'step-enter': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 4s ease-in-out infinite',
        'spin-slow': 'spin-slow 12s linear infinite',
        'step-enter': 'step-enter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
    },
  },
  plugins: [],
};
export default config;
