import { defineConfig } from "vite-plus";

export default defineConfig({
  lint: {
    rules: {
      "no-console": "error",
    },
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
  fmt: {
    parser: "typescript",
    printWidth: 100,
    trailingComma: "all",
    bracketSpacing: true,
    importOrder: [
      "<THIRD_PARTY_MODULES>",
      "^@(helpers|ui)/(.*)$",
      "^~.*$",
      "^@server/(.*)$",
      "^[./]",
    ],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
    sortTailwindcss: {},
    ignorePatterns: ["**/*.graphql"],
  },
  test: {
    projects: ["apps/*", "libs/*"],
  },
});
