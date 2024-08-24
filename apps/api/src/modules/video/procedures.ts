import { and, asc, desc, eq, gt, lt } from "drizzle-orm";
import { LexoRank } from "lexorank";
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
      orderBy: [schema.videos.rank],
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

  const [prevVideo, nextVideo] = await Promise.all([
    db.query.videos.findFirst({
      where: and(
        eq(schema.videos.playlistID, video.playlistID),
        lt(schema.videos.rank, video.rank),
      ),
      orderBy: [desc(schema.videos.rank)],
    }),
    db.query.videos.findFirst({
      where: and(
        eq(schema.videos.playlistID, video.playlistID),
        gt(schema.videos.rank, video.rank),
      ),
      orderBy: [asc(schema.videos.rank)],
    }),
  ]);

  return {
    video,
    playlist,
    metadata: {
      previousVideoID: prevVideo?.id ?? null,
      nextVideoID: nextVideo?.id ?? null,
    },
  };
});

const createInput = z.object({
  playlistID: z.number().positive(),
  rawUrl: z.string().trim().url(),
});
export const createVideo = publicProcedure.input(createInput).mutation(async ({ input }) => {
  const [urlPayload, playlist, lastVideo] = await Promise.all([
    parseUserURL(input.rawUrl),
    db.query.playlists.findFirst({
      where: eq(schema.playlists.id, input.playlistID),
    }),
    db.query.videos.findFirst({
      where: eq(schema.videos.playlistID, input.playlistID),
      orderBy: [desc(schema.videos.rank)],
    }),
  ]);
  if (!playlist) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" });
  }
  if (!urlPayload) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid URL" });
  }

  const inserted = await db
    .insert(schema.videos)
    .values([
      {
        ...urlPayload,
        playlistID: playlist.id,
        rank: lastVideo
          ? LexoRank.parse(lastVideo.rank).genNext().toString()
          : LexoRank.middle().toString(),
      },
    ])
    .returning({ id: schema.videos.id });

  const video = await db.query.videos.findFirst({
    where: eq(schema.videos.id, inserted[0].id),
  });
  return video!;
});

const updateInput = z.object({
  id: z.number().positive(),
  rawUrl: z.string().trim().url(),
});
export const updateVideo = publicProcedure.input(updateInput).mutation(async ({ input }) => {
  const [urlPayload, video] = await Promise.all([
    parseUserURL(input.rawUrl),
    db.query.videos.findFirst({
      where: eq(schema.videos.id, input.id),
    }),
  ]);
  if (!video) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
  }
  if (!urlPayload) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid URL" });
  }

  await db.update(schema.videos).set(urlPayload).where(eq(schema.videos.id, input.id));

  const updatedVideo = await db.query.videos.findFirst({
    where: eq(schema.videos.id, input.id),
  });
  return updatedVideo!;
});

const moveInput = z.object({
  id: z.number().positive(),
  videoBeforeID: z.number().positive().nullable(),
});
export const moveVideo = publicProcedure.input(moveInput).mutation(async ({ input }) => {
  const video = await db.query.videos.findFirst({
    where: eq(schema.videos.id, input.id),
  });
  if (!video) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
  }

  const updatedRank = await getMoveRank(video, input.videoBeforeID);

  await db
    .update(schema.videos)
    .set({ rank: updatedRank.toString() })
    .where(eq(schema.videos.id, input.id));

  const updatedVideo = await db.query.videos.findFirst({
    where: eq(schema.videos.id, input.id),
  });
  return updatedVideo!;
});

async function getMoveRank(video: schema.Video, beforeID: number | null) {
  if (beforeID === null) {
    const firstVideo = await db.query.videos.findFirst({
      where: eq(schema.videos.playlistID, video.playlistID),
      orderBy: [asc(schema.videos.rank)],
    });
    if (!firstVideo) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid move 1" });
    }

    const lexoRank = LexoRank.parse(firstVideo.rank);
    return lexoRank.genPrev();
  }

  const beforeVideo = await db.query.videos.findFirst({
    where: and(eq(schema.videos.playlistID, video.playlistID), eq(schema.videos.id, beforeID)),
  });
  if (!beforeVideo) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid move 2" });
  }

  const afterVideo = await db.query.videos.findFirst({
    where: and(
      eq(schema.videos.playlistID, beforeVideo.playlistID),
      gt(schema.videos.rank, beforeVideo.rank),
    ),
    orderBy: [asc(schema.videos.rank)],
  });

  const beforeRank = LexoRank.parse(beforeVideo.rank);
  return afterVideo ? beforeRank.between(LexoRank.parse(afterVideo.rank)) : beforeRank.genNext();
}
