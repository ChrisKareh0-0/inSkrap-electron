import { defineConfig } from 'electron-vite';
import path from 'path';

export default defineConfig({
  main: {
    build: {
      outDir: 'dist/main',
      rollupOptions: {
        input: path.resolve('./src/main/main.js'), // Use absolute path for better consistency
      }
    }
  },
  preload: {
    build: {
      outDir: 'dist/preload',
      rollupOptions: {
        input: path.resolve('./src/main/preload.js'), // Ensure this path is correct
      }
    }
  },
  renderer: {
    build: {
      outDir: 'dist/renderer',
      rollupOptions: {
        input: path.resolve('./src/renderer/index.html'), // Ensure this path is correct
      }
    }
  }
});
