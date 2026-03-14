import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig } from "vite-plus";
import svgr from "vite-plugin-svgr";
import baseConfig from "../../vite.config.js";

export default mergeConfig(
  baseConfig,
  defineConfig({
    plugins: [react(), svgr(), tailwindcss(), tanstackRouter()],
    resolve: {
      tsconfigPaths: true,
    },
    lint: {
      plugins: ["typescript", "unicorn", "oxc", "react", "react-perf", "promise", "vitest"],
      rules: {
        "no-floating-promises": "allow",
      },
    },
    fmt: {
      ignorePatterns: ["src/routeTree.gen.ts"],
    },
  }),
);
