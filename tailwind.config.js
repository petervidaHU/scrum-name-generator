/** @type {import('tailwindcss').Config} */
module.exports = {
  important: '#__next',
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{ts,tsx}",
    "./app/components/**/*.{ts, tsx}",
    "./app/*.{ts, tsx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin")
  ],
}

