import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F172A', // Bleu Nuit
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#84CC16', // Vert Lime
          foreground: '#FFFFFF',
          hover: '#65A30D',
        },
        background: '#F8FAFC',
        foreground: '#0F172A',
      },
    },
  },
  plugins: [],
};
export default config;