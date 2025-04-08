import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/main.js"),
        ui: resolve(__dirname, "src/ui.js")
      },
      output: {
        entryFileNames: "[name].js"
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: {
      origin: "https://www.owlbear.rodeo",
      methods: ["GET", "POST", "PUT"],
      allowedHeaders: ["*"]
    },
    fs: {
      allow: ["./public", "./src"]
    },
    proxy: {
      "/v1": {
        target: "http://localhost:3333",
        changeOrigin: true,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            if (!proxyReq.getHeader("Content-Length")) {
              proxyReq.removeHeader("Content-Type"); // Strip if no body
            }
            console.log("Proxying:", proxyReq.path, proxyReq.getHeaders());
          });
          proxy.on("proxyRes", (proxyRes) => console.log("Proxy response:", proxyRes.statusCode));
          proxy.on("error", (err) => console.error("Proxy error:", err));
        }
      }
    }
  }
});