import { sql } from "kysely";
import z from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "../../../database/index.js";
import { publicProcedure } from "../../../trpc.js";
import { getRankBetween } from "../utils/rank.js";
import { parseUserURL } from "../utils/services.js";

export const getPlaylistItem = publicProcedure
  .input(z.number().positive())
  .query(async ({ input }) => {
    return db
      .selectFrom("playlist_item")
      .where("id", "=", input)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new TRPCError({ code: "NOT_FOUND", message: "Video not found" }),
      );
  });

export const getPlaylistItems = publicProcedure
  .input(z.number().positive())
  .query(async ({ input }) => {
    return db
      .selectFrom("playlist_item")
      .where("playlist_id", "=", input)
      .orderBy("rank asc")
      .selectAll()
      .execute();
  });

export const getPlaylistInitialItem = publicProcedure
  .input(
    z.object({
      playlistID: z.number().positive(),
      shuffleSeed: z.string().min(1).optional(),
    }),
  )
  .query(async ({ input }) => {
    const [regular, shuffle] = await Promise.all([
      db
        .selectFrom("playlist_item")
        .where("playlist_id", "=", input.playlistID)
        .orderBy("rank asc")
        .selectAll()
        .executeTakeFirst(),
      db
        .selectFrom("playlist_item")
        .where("playlist_id", "=", input.playlistID)
        .orderBy(sql`md5(id::text || ${input.shuffleSeed ?? ""})`)
        .selectAll()
        .executeTakeFirst(),
    ]);

    return { regular, shuffle };
  });

export const createPlaylistItem = publicProcedure
  .input(
    z.object({
      playlistID: z.number().positive(),
      rawUrl: z.string().trim().url(),
    }),
  )
  .mutation(async ({ input }) => {
    const [urlPayload, playlist, lastItem] = await Promise.all([
      parseUserURL(input.rawUrl),
      db
        .selectFrom("playlist")
        .where("id", "=", input.playlistID)
        .selectAll()
        .executeTakeFirstOrThrow(
          () => new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" }),
        ),
      db
        .selectFrom("playlist_item")
        .where("playlist_id", "=", input.playlistID)
        .orderBy("rank desc")
        .selectAll()
        .executeTakeFirst(),
    ]);

    if (!urlPayload) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid URL" });
    }

    const nextRank = getRankBetween([lastItem, undefined]);

    return db
      .insertInto("playlist_item")
      .values({
        ...urlPayload,
        rank: nextRank.toString(),
        playlist_id: playlist.id,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  });

export const movePlaylistItem = publicProcedure
  .input(
    z.object({
      id: z.number().positive(),
      itemBeforeID: z.number().positive().nullable(),
    }),
  )
  .mutation(async ({ input }) => {
    const playlistItem = await db
      .selectFrom("playlist_item")
      .where("id", "=", input.id)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new TRPCError({ code: "NOT_FOUND", message: "Video not found" }),
      );

    // Assigned to be before the first video in the playlist
    if (input.itemBeforeID === null) {
      const firstVideo = await db
        .selectFrom("playlist_item")
        .where("playlist_id", "=", playlistItem.playlist_id)
        .orderBy("rank asc")
        .selectAll()
        .executeTakeFirstOrThrow(
          () =>
            new TRPCError({
              code: "BAD_REQUEST",
              message: "Can't move to a playlist with no items",
            }),
        );

      await db
        .updateTable("playlist_item")
        .where("id", "=", playlistItem.id)
        .set({
          rank: getRankBetween([undefined, firstVideo]).toString(),
        })
        .execute();
      return;
    }

    const beforeItem = await db
      .selectFrom("playlist_item")
      .where("id", "=", input.itemBeforeID)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new TRPCError({ code: "BAD_REQUEST", message: "Invalid before item ID" }),
      );
    const afterItem = await db
      .selectFrom("playlist_item")
      .where("playlist_id", "=", playlistItem.playlist_id)
      .where("rank", ">", beforeItem.rank)
      .orderBy("rank asc")
      .selectAll()
      .executeTakeFirst();

    await db
      .updateTable("playlist_item")
      .where("id", "=", playlistItem.id)
      .set({
        rank: getRankBetween([beforeItem, afterItem]).toString(),
      })
      .execute();
  });

export const deletePlaylistItem = publicProcedure
  .input(z.number().positive())
  .mutation(async ({ input }) => {
    return db
      .deleteFrom("playlist_item")
      .where("id", "=", input)
      .returningAll()
      .executeTakeFirstOrThrow(
        () => new TRPCError({ code: "NOT_FOUND", message: "Video not found" }),
      );
  });
