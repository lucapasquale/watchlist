import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import * as playlistItemsProcedures from "./modules/playlist/procedures/items.js";
import * as playlistProcedures from "./modules/playlist/procedures/playlist.js";
import { router } from "./trpc.js";

export const appRouter = router({
  ...playlistProcedures,
  ...playlistItemsProcedures,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
