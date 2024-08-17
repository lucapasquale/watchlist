import z from "zod";

import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getList: publicProcedure.input(z.string()).query(async () => {
    return {
      id: "PL2gDVp_0vZOQjqMex201dYpUiu1mcGX96",
    };
  }),
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
