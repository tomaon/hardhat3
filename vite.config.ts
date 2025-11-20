import vue from '@vitejs/plugin-vue'
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  preview: {
    port: 5173,
  },
  root: "ui",
  server: {
    port: 5173,
  },
  worker: {
    format: "es",
  },
});
