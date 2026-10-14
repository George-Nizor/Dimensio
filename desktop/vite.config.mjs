import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Two pages: index.html is the course app (React, src/course/), workshop.html is the Workshop
// (Forge3D's renderer, src/renderer/). Both are served to the window from dimensio-app://app.
//
// Under `vite dev` React's refresh preamble is an inline script and the dev server talks over a
// websocket, so the pages' content policies are loosened there and only there. A build keeps them
// exactly as written.
const devPolicy = {
  name: "dimensio-dev-policy",
  apply: "serve",
  transformIndexHtml: (html) => html
    .replace("script-src 'self'", "script-src 'self' 'unsafe-inline'")
    .replace("connect-src 'self'", "connect-src 'self' ws://127.0.0.1:* ws://localhost:*"),
};

export default defineConfig({
  base: "./",
  plugins: [react(), devPolicy],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    sourcemap: false,
    target: "es2022",
    assetsInlineLimit: 0,
    rollupOptions: {
      input: { index: "index.html", workshop: "workshop.html" },
    },
  },
  test: {
    environment: "node",
    include: ["test/course/**/*.test.ts"],
    setupFiles: ["test/course/setup.ts"],
  },
});
