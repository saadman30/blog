import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      reporter: ["text", "html"],
      provider: "v8"
    }
  },
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "src/components"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@store": path.resolve(__dirname, "src/store"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "\\.(scss|sass)$": path.resolve(__dirname, "scripts/vitest-scss-mock.cjs")
    }
  }
});

