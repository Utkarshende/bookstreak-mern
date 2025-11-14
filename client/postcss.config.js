// CRITICAL FIX: Importing the dedicated PostCSS package for Tailwind
import tailwindcss from '@tailwindcss/postcss' 
import autoprefixer from 'autoprefixer'

export default {
  // By using the explicit plugin import above, this configuration is now
  // much more robust and should resolve the "unknown at rule" error.
  plugins: [
    tailwindcss(),
    autoprefixer,
  ],
}