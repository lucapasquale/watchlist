import { and, between, eq, not } from "drizzle-orm";
import z from "zod";
import { inferRouterInputs, inferRouterOutputs, TRPCError } from "@trpc/server";

import { db } from "./database/index.js";
import * as schema from "./database/schema.js";
import { publicProcedure, router } from "./trpc.js";

export const appRouter = router({
  getPlaylist: publicProcedure.input(z.number().positive()).query(async ({ input }) => {
    const playlist = await db.query.playlists.findFirst({
      where: eq(schema.playlists.id, input),
    });
    if (!playlist) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" });
    }

    return playlist;
  }),

  getVideos: publicProcedure.input(z.number().positive()).query(async ({ input }) => {
    const playlistVideos = await db.query.videos.findMany({
      where: eq(schema.videos.playlistID, input),
      orderBy: [schema.videos.sortOrder],
    });

    return playlistVideos;
  }),
  getVideo: publicProcedure.input(z.number().positive()).query(async ({ input }) => {
    const rows = await db
      .select()
      .from(schema.videos)
      .innerJoin(schema.playlists, eq(schema.playlists.id, schema.videos.playlistID))
      .where(eq(schema.videos.id, input))
      .limit(1);
    if (!rows[0]) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
    }

    const { videos: video, playlists: playlist } = rows[0];

    const surroundingVideos = await db
      .select({ id: schema.videos.id, sortOrder: schema.videos.sortOrder })
      .from(schema.videos)
      .where(
        and(
          eq(schema.videos.playlistID, video.playlistID),
          between(schema.videos.sortOrder, video.sortOrder - 1, video.sortOrder + 1),
          not(eq(schema.videos.id, video.id)),
        ),
      )
      .limit(2)
      .orderBy(schema.videos.sortOrder);

    return {
      video,
      playlist,
      metadata: {
        previousVideoID: surroundingVideos.find((v) => v.sortOrder < video.sortOrder)?.id ?? null,
        nextVideoID: surroundingVideos.find((v) => v.sortOrder > video.sortOrder)?.id ?? null,
      },
    };
  }),
});

export type AppRouter = typeof appRouter;

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
