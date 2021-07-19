import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import styleImport from "vite-plugin-style-import";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: "element-plus",
          esModule: true,
          ensureStyleFile: true,
          resolveStyle: (name) => {
            name = name.slice(3);
            return `element-plus/packages/theme-chalk/src/${name}.scss`;
          },
          resolveComponent: (name) => `element-plus/lib/${name}`,
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      page: path.resolve(__dirname, "src/page"),
      comps: path.resolve(__dirname, "src/components"),
      utils: path.resolve(__dirname, "src/utils"),
      api: path.resolve(__dirname, "src/api"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://sslguala.ce04.com",
        changeOrigin: true,
        rewrite: (_path) => _path.replace(/^\/api/, ""),
      },
    },
  },
});
