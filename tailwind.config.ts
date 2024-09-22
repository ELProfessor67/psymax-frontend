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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "black": "#0E0E0E",
        "gray": {
          "200": "#EEEEEE",
          "700": "#3C3C3C",
          "400": "#707070"
        },
        "red": {
          "600": "#E30C40"
        },
        "blue": {
          "500":"#2B86FC",
        }
      },
    },
  },
  plugins: [],
};
export default config;
