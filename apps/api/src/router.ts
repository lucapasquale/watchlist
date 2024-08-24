import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import * as playlistProcedures from "./modules/playlist/procedures.js";
import * as videoProcedures from "./modules/video/procedures.js";
import { router } from "./trpc.js";

export const appRouter = router({
  ...playlistProcedures,
  ...videoProcedures,
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
