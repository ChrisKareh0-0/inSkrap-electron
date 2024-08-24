import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
console.log("vite.config.js is running")

const config = defineConfig({
    
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3001, // Set the port here
  },
  root: './src/renderer', // This sets the root directory to ./src
});

console.log("Vite is serving files from:", config.root || process.cwd());

export default config;
