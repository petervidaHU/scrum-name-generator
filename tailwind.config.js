/** @type {import('tailwindcss').Config} */
module.exports = {
  /*important: '#__next',*/
  content: [
    "./pages/**/*.{ts,tsx}",
    "./node_modules/flowbite/**/*.js",
    "./node_modules/flowbite-react/**/*.js",
   "./app/components/**/*.{ts, tsx}",
   "./app/*.{ts, tsx}",
   "./public/**/*.html",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // require("flowbite/plugin"),
  ],
}

