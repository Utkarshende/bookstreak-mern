
/** @type {import('tailwindcss').Config} */
// Note: This file is now using the .cjs extension to resolve the "module is not defined" error.
module.exports = {
  // CRITICAL: This content array must point to all your source files.
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // The path remains correct
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}