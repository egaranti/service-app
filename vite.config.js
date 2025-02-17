import react from "@vitejs/plugin-react";

import * as path from "path";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  assetsInclude: ["**/*.lottie"],
  build: {
    sourcemap: true,
  },
  server: {
    host: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: "prompt",
      manifest: {
        name: "egaranti",
        short_name: "egaranti",
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 3000000,
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "images",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            urlPattern: /./,
            handler: "NetworkOnly",
          },
        ],
      },
    }),
  ],
  base: "/",
});
