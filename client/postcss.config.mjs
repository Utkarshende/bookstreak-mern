// CRITICAL FIX: Use 'import' and 'export default' for ES module compatibility.
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss(), // Call the imported function
    autoprefixer,
  ],
}