import { eq } from "drizzle-orm";
import z from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "./database/index.js";
import { playlists, videos } from "./database/schema.js";
import { publicProcedure, router } from "./trpc.js";

export const appRouter = router({
  getPlaylist: publicProcedure.input(z.number().positive()).query(async ({ input }) => {
    const playlist = await db.query.playlists.findFirst({
      where: eq(playlists.id, input),
    });

    if (!playlist) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Playlist not found",
      });
    }

    return playlist;
  }),

  getVideo: publicProcedure.input(z.number().positive()).query(async ({ input }) => {
    const video = await db.query.videos.findFirst({
      where: eq(videos.id, input),
    });

    if (!video) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Video not found",
      });
    }

    return video;
  }),
});

export type AppRouter = typeof appRouter;
