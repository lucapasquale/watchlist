import { eq } from "drizzle-orm";

import { db } from "../../database/index.js";

import { type Playlist, PlaylistInsert, playlists as playlistSchema } from "./schema.js";

export async function getByID(id: number) {
  return db.query.playlists.findFirst({
    where: eq(playlistSchema.id, id),
  });
}

export async function create(value: PlaylistInsert) {
  const inserted = await db
    .insert(playlistSchema)
    .values(value)
    .returning({ id: playlistSchema.id });

  const createdVideo = await db.query.playlists.findFirst({
    where: eq(playlistSchema.id, inserted[0]!.id),
  });
  return createdVideo!;
}

export async function update(id: number, value: Partial<Playlist>) {
  await db.update(playlistSchema).set(value).where(eq(playlistSchema.id, id));

  const updatedVideo = await db.query.playlists.findFirst({
    where: eq(playlistSchema.id, id),
  });
  return updatedVideo!;
}
