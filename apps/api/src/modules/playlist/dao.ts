import { eq } from "drizzle-orm";

import { db } from "../../database";

import { type Playlist, playlists as playlistSchema } from "./schema";

export async function getByID(id: number) {
  return db.query.playlists.findFirst({
    where: eq(playlistSchema.id, id),
  });
}

export async function update(id: number, value: Partial<Playlist>) {
  await db.update(playlistSchema).set(value).where(eq(playlistSchema.id, id));

  const updatedVideo = await db.query.playlists.findFirst({
    where: eq(playlistSchema.id, id),
  });
  return updatedVideo!;
}
