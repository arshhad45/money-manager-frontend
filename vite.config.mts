import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy only for local development when VITE_API_URL is not set
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
      }
    }
  }
});

