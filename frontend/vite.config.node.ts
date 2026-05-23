// Vite config for VPS / Node.js deployment (Hostinger, WebSpaceKit, etc.)
// Uses the same Lovable wrapper but disables the Cloudflare plugin so
// TanStack Start + Nitro builds a standard Node.js server instead.
//
// Usage:  npx vite build --config vite.config.node.ts
// Or via: npm run build:node

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Disable Cloudflare Workers — build for Node.js instead
  cloudflare: false,

  tanstackStart: {
    server: { entry: "server.node" },
  },

  vite: {
    build: {
      outDir: "dist",
    },
  },
});
