import z from "zod";

import { publicProcedure, router } from "./trpc.js";

export const appRouter = router({
  getList: publicProcedure.input(z.string()).query(async () => {
    console.log(2);
    return {
      id: "PL2gDVp_0vZOQjqMex201dYpUiu1mcGX96",
    };
  }),
});

export type AppRouter = typeof appRouter;
