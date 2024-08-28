/* eslint-disable turbo/no-undeclared-env-vars */
import "dotenv/config";
import fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";

import { db } from "./database/index.js";
import { migrateToLatest } from "./database/migrator.js";
import { createContext } from "./context.js";
import { type AppRouter, appRouter } from "./router.js";

const server = fastify({ maxParamLength: 5000 });

main();

async function main() {
  try {
    await migrateToLatest(db);

    await startServer();
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

async function startServer() {
  server.register(fastifyTRPCPlugin, {
    prefix: "/trpc",
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error);
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
  });

  await server.register(cors, {
    origin: "*",
  });

  const port = Number(process.env.PORT!);
  await server.listen({ port, host: "0.0.0.0" });

  console.info(`Server listening at http://0.0.0.0:${port}`);
}
