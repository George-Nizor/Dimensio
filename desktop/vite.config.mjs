import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
  },
  // The course app's pure parts (src/course/engine, store) are tested with vitest; the node:test
  // files in test/*.test.cjs run under `node --test`.
  test: {
    environment: "node",
    include: ["test/course/**/*.test.ts"],
    setupFiles: ["test/course/setup.ts"],
  },
});
