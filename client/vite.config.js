// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // -----------------------------------------------------------------
  // CRITICAL FIX: Ensure the base path is correct for production.
  // Using './' or '' (empty string) often fixes resource loading 404s
  // when deploying to relative paths or static sites.
  // -----------------------------------------------------------------
  base: './', 
});