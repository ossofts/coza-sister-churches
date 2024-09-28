/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import path, { resolve } from "path";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugIn = {
  registerType: "autoUpdate",
  includeAssests: [
    "COZA-Logo-white.png",
    "COZA-Logo-white.png",
    "COZA-Logo-black.png",
  ],
  manifest: {
    name: "CGLS",
    short_name: "CGLS",
    dir: "ltr",
    lang: "en-US",
    orientation: "portrait",
    start_url: "/",
    scope: "/",
    background_color: "#000000",
    theme_color: "#6B079C",
    display: "standalone",
    description: "COZA Global Leadership Summit App",
    icons: [
      {
        src: "/CGLS-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/CGLS-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/CGLS-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/CGLS-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
} as Partial<VitePWAOptions>;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), VitePWA(manifestForPlugIn)],
  build: {
    outDir: "./dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        "firebase-messaging-sw": resolve(
          __dirname,
          "./public/firebase-messaging-sw.js"
        ),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    loader: "tsx",
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
        ".ts": "tsx",
      },
    },
  },

  server: {
    headers: {
      "Service-Worker-Allowed": "/",
    },
  },

  ...{
    test: {
      environment: "jsdom",
      setupFiles: ["./tests/setup.ts"],
      testMatch: ["./tests/**/*.test.tsx", "./tests/**/*.test.jsx"],
      globals: true,
    },
  },
});
