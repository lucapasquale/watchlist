import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "http://localhost:3000/graphql",
  documents: "src/**/*.graphql",
  generates: {
    "./src/graphql/types.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
    },
  },
  overwrite: true,
  ignoreNoDocuments: true,
};

export default config;
