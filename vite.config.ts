import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    proxy: {
      "/api": {
        target: "https://mawso3a.pythonanywhere.com",
        changeOrigin: true,
        secure: false, // Changed to false to handle SSL issues
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {});
        },
      },
    },
  },
});
