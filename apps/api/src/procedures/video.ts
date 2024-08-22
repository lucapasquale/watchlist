import { and, between, count, eq, not } from "drizzle-orm";
import z from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "../database/index.js";
import * as schema from "../database/schema.js";
import { Video } from "../database/schema.js";
import { getClip } from "../services/twitch.js";
import { publicProcedure } from "../trpc.js";

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

  const videosCount = await db
    .select({ value: count() })
    .from(schema.videos)
    .where(eq(schema.videos.playlistID, input.playlistID));

  const createPayload = await parseURL(input.rawUrl);
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

  const updatePayload = await parseURL(input.rawUrl);
  await db.update(schema.videos).set(updatePayload).where(eq(schema.videos.id, input.id));

  return db.query.videos.findFirst({
    where: eq(schema.videos.id, input.id),
  });
});

async function parseURL(userUrl: string): Promise<Pick<Video, "kind" | "rawUrl" | "url">> {
  const rawUrl = new URL(userUrl);

  // https://www.twitch.tv/mogulmoves/clip/ProtectiveIgnorantHippoHotPokket-58un43BmWmGiLbJC?filter=clips&range=7d&sort=time
  if (rawUrl.href.match(/twitch.tv\/.+\/clip/gi)) {
    const clipID = rawUrl.pathname.split("/").pop();
    if (!clipID) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid Twitch clip URL" });
    }

    const clip = await getClip(clipID);

    return {
      kind: "twitch_clip" as const,
      rawUrl: userUrl,
      url: clip.thumbnail_url.replace(/-preview-.+x.+\..*/gi, ".mp4"),
    };
  }

  if (rawUrl.href.match(/youtube.com\/watch/gi)) {
    const usp = new URLSearchParams(rawUrl.search);
    const v = usp.get("v");
    if (!v) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid YouTube URL" });
    }

    return {
      kind: "youtube" as const,
      rawUrl: userUrl,
      url: `https://www.youtube.com/embed/${v}`,
    };
  }

  throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid URL" });
}
