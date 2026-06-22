import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/ceyart-simulator/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["app-icon.svg", "app-icon-192.png", "app-icon-512.png"],
      manifest: {
        name: "Ceyart Simulator",
        short_name: "Ceyart",
        description: "Offline masa yerlesim simulatoru",
        theme_color: "#f3f4f6",
        background_color: "#f3f4f6",
        display: "standalone",
        orientation: "portrait",
        scope: "/ceyart-simulator/",
        start_url: "/ceyart-simulator/",
        icons: [
          {
            src: "/ceyart-simulator/app-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/ceyart-simulator/app-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/ceyart-simulator/app-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
        navigateFallback: "/ceyart-simulator/index.html",
      },
    }),
  ],
});
