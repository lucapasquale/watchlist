import { and, asc, desc, eq, gt, lt, not, sql } from "drizzle-orm";

import { db } from "../../database";

import { getRankBetween } from "./utils/rank";
import { type Video, type VideoInsert, videos as videoSchema } from "./schema";

export async function getByID(id: number) {
  return db.query.videos.findFirst({
    where: eq(videoSchema.id, id),
    orderBy: [videoSchema.rank],
  });
}

export async function getSurrounding(video: Video) {
  return Promise.all([
    db.query.videos.findFirst({
      where: and(eq(videoSchema.playlistID, video.playlistID), lt(videoSchema.rank, video.rank)),
      orderBy: [desc(videoSchema.rank)],
    }),
    db.query.videos.findFirst({
      where: and(eq(videoSchema.playlistID, video.playlistID), gt(videoSchema.rank, video.rank)),
      orderBy: [asc(videoSchema.rank)],
    }),
  ]);
}

export async function getManyRandom(video: Video, limit = 1) {
  return db.query.videos.findMany({
    where: and(eq(videoSchema.playlistID, video.playlistID), not(eq(videoSchema.id, video.id))),
    limit,
    orderBy: sql`random()`,
  });
}

export async function getPlaylistFirst(playlistID: number) {
  return db.query.videos.findFirst({
    where: eq(videoSchema.playlistID, playlistID),
    orderBy: [videoSchema.rank],
  });
}
export async function getManyByPlaylistID(playlistID: number) {
  return db.query.videos.findMany({
    where: eq(videoSchema.playlistID, playlistID),
    orderBy: [videoSchema.rank],
  });
}

export async function create(value: Omit<VideoInsert, "rank">) {
  const lastVideo = await db.query.videos.findFirst({
    where: eq(videoSchema.playlistID, value.playlistID),
    orderBy: [desc(videoSchema.rank)],
  });

  const nextRank = getRankBetween([lastVideo, undefined]);

  const inserted = await db
    .insert(videoSchema)
    .values({ ...value, rank: nextRank.toString() })
    .returning({ id: videoSchema.id });

  const video = await db.query.videos.findFirst({
    where: eq(videoSchema.id, inserted[0].id),
  });
  return video!;
}

export async function update(id: number, value: Partial<Video>) {
  const updated = await db
    .update(videoSchema)
    .set(value)
    .where(eq(videoSchema.id, id))
    .returning({ id: videoSchema.id });

  const updatedVideo = await db.query.videos.findFirst({
    where: eq(videoSchema.id, updated[0].id),
  });
  return updatedVideo!;
}

export async function remove(id: number) {
  return db.delete(videoSchema).where(eq(videoSchema.id, id));
}
