import { and, between, count, eq, not } from "drizzle-orm";
import z from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "../../database";
import * as schema from "../../database/schema";
import { publicProcedure } from "../../trpc";

import { parseUserURL } from "./utils";

export const getPlaylistVideos = publicProcedure
  .input(z.number().positive())
  .query(async ({ input }) => {
    const playlistVideos = await db.query.videos.findMany({
      where: eq(schema.videos.playlistID, input),
      orderBy: [schema.videos.sortOrder],
    });

    return playlistVideos;
  });

export const getVideo = publicProcedure.input(z.number().positive()).query(async ({ input }) => {
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
});

const createInput = z.object({
  playlistID: z.number().positive(),
  rawUrl: z.string().trim().url(),
});
export const createVideo = publicProcedure.input(createInput).mutation(async ({ input }) => {
  const playlist = await db.query.playlists.findFirst({
    where: eq(schema.playlists.id, input.playlistID),
  });
  if (!playlist) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" });
  }

  const createPayload = await parseUserURL(input.rawUrl);
  if (!createPayload) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid URL" });
  }

  const videosCount = await db
    .select({ value: count() })
    .from(schema.videos)
    .where(eq(schema.videos.playlistID, input.playlistID));

  const inserted = await db
    .insert(schema.videos)
    .values([
      {
        ...createPayload,
        playlistID: playlist.id,
        sortOrder: (videosCount[0]?.value ?? 0) + 1,
      },
    ])
    .returning({ id: schema.videos.id });

  if (!inserted[0]) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Error" });
  }

  const video = await db.query.videos.findFirst({
    where: eq(schema.videos.id, inserted[0].id),
  });
  if (!video) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
  }

  return video;
});

const updateInput = z.object({
  id: z.number().positive(),
  rawUrl: z.string().trim().url(),
});
export const updateVideo = publicProcedure.input(updateInput).mutation(async ({ input }) => {
  const video = await db.query.videos.findFirst({
    where: eq(schema.videos.id, input.id),
  });
  if (!video) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
  }

  const updatePayload = await parseUserURL(input.rawUrl);
  if (!updatePayload) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid URL" });
  }

  await db.update(schema.videos).set(updatePayload).where(eq(schema.videos.id, input.id));

  return db.query.videos.findFirst({
    where: eq(schema.videos.id, input.id),
  });
});
