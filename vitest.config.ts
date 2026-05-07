import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(dirname, "."),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    exclude: ["node_modules", ".next", "out", "build", "dist", ".pnpm-store"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary"],
      include: ["lib/**/*.ts"],
      exclude: [
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/*.test.tsx",
        "**/*.spec.tsx",
      ],
      thresholds: {
        lines: 80,
        statements: 80,
        functions: 80,
        branches: 75,        
      },
    },
  },
});
