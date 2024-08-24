import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import * as videoProcedures from "./modules/video/procedures.js";
import * as playlistProcedures from "./procedures/playlist.js";
import { router } from "./trpc.js";

export const appRouter = router({
  ...playlistProcedures,
  ...videoProcedures,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
