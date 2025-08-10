const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js",
    ".flowbite-react\\class-list.json"
  ],
  theme: {
    extend: {
      animation: {
        'gradient-move-dark': 'gradient-move-dark 8s ease-in-out infinite',
        'gradient-move-light': 'gradient-move-light 8s ease-in-out infinite',
      }
    },
  },
  plugins: [require('flowbite/plugin'), flowbiteReact],
}
