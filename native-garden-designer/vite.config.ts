// import MillionLint from '@million/lint';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
// import path from 'path'
const _plugins = [react(), tsconfigPaths()];
// _plugins.unshift(MillionLint.vite())
export default defineConfig({
  base: "./",
  plugins: _plugins,
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
    sourcemap: true,
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  esbuild: {
    logOverride: {
      "this-is-undefined-in-esm": "silent",
    },
  },
});
