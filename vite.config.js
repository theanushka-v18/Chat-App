import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@layouts": path.resolve(__dirname, "./src/layouts"),
      "@routes": path.resolve(__dirname, "./src/routes"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@modules": path.resolve(__dirname, "./src/modules"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@redux": path.resolve(__dirname, "./src/redux"),
      "@middlewares": path.resolve(__dirname, "./src/middlewares"),
      "@assets": path.resolve(__dirname, "./src/assets"),
    },
  },
});
