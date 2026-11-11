import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Sends /api and /uploads requests to the Express backend
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "http://localhost:5000",
      "/uploads": "http://localhost:5000",
    },
  },
});
