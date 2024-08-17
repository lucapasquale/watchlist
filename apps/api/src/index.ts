import fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin, FastifyTRPCPluginOptions } from "@trpc/server/adapters/fastify";

import { createContext } from "./context.js";
import { type AppRouter, appRouter } from "./router.js";

const server = fastify({
  maxParamLength: 5000,
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

(async () => {
  try {
    await server.register(cors);

    await server.listen({ port: 3000 });
    console.log("Server listening at http://localhost:3000");
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
