import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Plain Vite + React SPA. No SSR and no server entry — `vite build` emits a
// fully static bundle into dist/ that any static host (Vercel) can serve.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Resolves the "@/*" alias from tsconfig.json (native in Vite 8).
  resolve: { tsconfigPaths: true },
  server: {
    host: true,
    port: 8080,
  },
  preview: {
    host: true,
    port: 8080,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});
