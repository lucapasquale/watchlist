import fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";

import { db } from "./database/index.js";
import { migrateToLatest } from "./database/migrator.js";
import { config } from "./config.js";
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
  server.get("/health", function (_req, reply) {
    reply.send("OK");
  });

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

  await server.listen({ port: config.port, host: config.host });

  console.info(`Server listening at http://${config.host}:${config.port}`);
}
