import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import vercel from "vite-plugin-vercel";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vercel()],
  server: {
    port: process.env.PORT as unknown as number,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
