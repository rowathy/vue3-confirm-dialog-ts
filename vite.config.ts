import { resolve } from "path"
import { defineConfig } from "vite";
import createVuePlugin from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/main.ts"),
      name: "vue3-confirm-dialog",
      fileName: "vue3-confirm-dialog",
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        globals: {
          vue: "Vue",
        }
      }
    }
  },
  plugins: [createVuePlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})