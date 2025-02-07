/** @type {import('tailwindcss').Config} */
module.exports = {
  //import "@egaranti/components/dist/index.css";
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@egaranti/components/**/*.js",
  ],
  theme: {
    extend: {
      shadow: {
        custom: "0 0 10px 0 rgba(0, 0, 0, 0.2)",
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
  plugins: [require("tailwindcss-animate")],
};
