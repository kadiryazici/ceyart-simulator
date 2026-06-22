import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/meeplio/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["app-icon.svg", "app-icon-192.png", "app-icon-512.png"],
      manifest: {
        name: "Meeplio",
        short_name: "Meeplio",
        description: "Offline masa yerlesim simulatoru",
        theme_color: "#f3f4f6",
        background_color: "#f3f4f6",
        display: "standalone",
        orientation: "portrait",
        scope: "/meeplio/",
        start_url: "/meeplio/",
        icons: [
          {
            src: "/meeplio/app-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/meeplio/app-icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/meeplio/app-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ["**/*.{js,css,html,svg,png,ico,webmanifest}"],
        navigateFallback: "/meeplio/index.html",
      },
    }),
  ],
});
