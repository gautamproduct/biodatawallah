import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build works on gautamproduct.github.io/biodatawallah/ and on biodatawallah.com.
export default defineConfig({
  base: './',
  plugins: [react()],
});
