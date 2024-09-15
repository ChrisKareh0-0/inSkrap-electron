import { defineConfig } from "electron-vite";
import path from "path";

export default defineConfig({
  main: {
    build: {
      outDir: "dist/main",
      rollupOptions: {
        input: path.resolve("./src/main/main.js"),
      },
    },
  },
  preload: {
    build: {
      outDir: "dist/preload",
      rollupOptions: {
        input: path.resolve("./src/main/preload.js"),
        output: {
          entryFileNames: "preload.js",
          format: "cjs",
        },
      },
    },
  },
  renderer: {
    build: {
      outDir: "dist/renderer",
      rollupOptions: {
        input: path.resolve("./src/renderer/index.html"),
      },
    },
  },
});
