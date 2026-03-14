import { defineConfig, mergeConfig } from "vite-plus";
import baseConfig from "../../vite.config.js";

export default mergeConfig(
  baseConfig,
  defineConfig({
    lint: {
      plugins: ["typescript", "unicorn", "oxc", "react", "react-perf", "promise", "vitest"],
    },
  }),
);
