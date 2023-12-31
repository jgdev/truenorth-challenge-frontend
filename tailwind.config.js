/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
  safelist: [
    { pattern: /^(fill|bg|text|border)-[^/]+$/ },
    { pattern: /^(min-w|max-w|w)-[^/]+$/ },
  ],
};
