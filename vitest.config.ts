/// <reference types="vitest" />
import * as path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@effect-ts/file-watcher": path.resolve(__dirname, "./packages/file-watcher/build/esm"),
      "@effect-ts-tests/file-watcher": path.resolve(__dirname, "./packages/file-watcher/build/tests")
    }
  },
  test: {
    include: ["packages/*/build/tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"]
  }
});
