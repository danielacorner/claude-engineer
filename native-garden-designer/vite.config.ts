import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
// import path from 'path'

export default defineConfig({
  base: "./",
  plugins: [react(), tsconfigPaths()],
  resolve: {
    // alias: {
    //   '@': path.resolve(__dirname, './src'),
    // },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": "http://localhost:8080",
    },
  },
  build: {
    outDir: "build",
    sourcemap: false,
    minify: false,
    // terserOptions: {
    //   compress: {
    //     drop_console: true,
    //     drop_debugger: true,
    //   },
    // },
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
