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
        background: "#FDFBF7",
        foreground: "#333333",
        accent: "#4A5D4E",
        "accent-light": "#6B8272",
        "accent-dark": "#3A4D3E",
      },
      fontFamily: {
        serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
