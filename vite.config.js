import react from "@vitejs/plugin-react";

import * as path from "path";
import { defineConfig } from "vite";
//import { VitePWA } from "vite-plugin-pwa";
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
  plugins: [react(), svgr()],
  base: "/",
});
