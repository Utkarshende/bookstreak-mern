import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import tailwindcss from '@tailwindcss/vite' // REMOVED

// https://vite.dev/config/
export default defineConfig({
  // Removed the explicit tailwindcss() plugin registration.
  // Vite will automatically detect and use postcss.config.js
  // and tailwind.config.js now.
  plugins: [react()], 
})