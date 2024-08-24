import { eq } from "drizzle-orm";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "../../database/index.js";
import * as schema from "../../database/schema.js";
import { publicProcedure } from "../../trpc.js";

export const getPlaylist = publicProcedure.input(z.number().positive()).query(async ({ input }) => {
  const playlist = await db.query.playlists.findFirst({
    where: eq(schema.playlists.id, input),
  });
  if (!playlist) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" });
  }

  return playlist;
});

const createInput = z.object({
  name: z.string().trim().min(1).max(100),
});

export const createPlaylist = publicProcedure.input(createInput).mutation(async ({ input }) => {
  console.log(input);
});

const updateInput = z.object({
  id: z.number().positive(),
  name: z.string().trim().min(1).max(100),
});

export const updatePlaylist = publicProcedure.input(updateInput).mutation(async ({ input }) => {
  const playlist = await db.query.playlists.findFirst({
    where: eq(schema.playlists.id, input.id),
  });
  if (!playlist) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" });
  }

  await db
    .update(schema.playlists)
    .set({ name: input.name })
    .where(eq(schema.playlists.id, input.id));

  return db.query.playlists.findFirst({
    where: eq(schema.playlists.id, input.id),
  });
});
