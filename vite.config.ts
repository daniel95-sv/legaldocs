import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2022",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          jspdf: ["jspdf"],
          zod: ["zod"],
        },
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  // @ts-expect-error vitest configuration in vite.config.ts
  test: {
    globals: true,
    environment: "node",
  },
});
