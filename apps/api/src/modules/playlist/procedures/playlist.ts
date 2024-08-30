import { sql } from "kysely";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { db } from "../../../database/index.js";
import { publicProcedure } from "../../../trpc.js";

export const getPlaylist = publicProcedure.input(z.number().positive()).query(async ({ input }) => {
  return db
    .selectFrom("playlist")
    .where("id", "=", input)
    .selectAll()
    .executeTakeFirstOrThrow(
      () => new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" }),
    );
});

export const getAllPlaylists = publicProcedure.query(async () => {
  return db.selectFrom("playlist").selectAll().execute();
});

export const getPlaylistQueue = publicProcedure
  .input(
    z.object({
      currentItemID: z.number().positive(),
      shuffleSeed: z.string().min(1).optional(),
    }),
  )
  .query(async ({ input }) => {
    const playlistItem = await db
      .selectFrom("playlist_item")
      .where("id", "=", input.currentItemID)
      .selectAll()
      .executeTakeFirstOrThrow(
        () => new TRPCError({ code: "NOT_FOUND", message: "Video not found" }),
      );

    let query = db
      .selectFrom("playlist_item")
      .where("playlist_id", "=", playlistItem.playlist_id)
      .selectAll()
      .limit(5);

    if (input.shuffleSeed) {
      query = query
        .where(
          sql`md5(id::text || ${input.shuffleSeed})`,
          ">",
          sql`md5(${playlistItem.id}::text || ${input.shuffleSeed})`,
        )
        .orderBy(sql`md5(id::text || ${input.shuffleSeed}) asc`);
    } else {
      query = query.where("rank", ">", playlistItem.rank).orderBy("rank asc");
    }

    return query.execute();
  });

export const createPlaylist = publicProcedure
  .input(z.object({ name: z.string().min(1) }))
  .mutation(async ({ input }) => {
    return db
      .insertInto("playlist")
      .values({ name: input.name })
      .returningAll()
      .executeTakeFirstOrThrow();
  });

export const createPlaylistFromYoutube = publicProcedure
  .input(z.object({ url: z.string().url() }))
  .mutation(async ({ input }) => {
    console.log(input);
    // const url = new URL(input.url);
    // const usp = new URLSearchParams(url.search);
    // const playlistID = usp.get("list");
    // if (!playlistID) {
    //   throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid YouTube playlist URL" });
    // }

    // const youtubePlaylist = await Youtube.getPlaylist(playlistID);
    // if (!youtubePlaylist) {
    //   throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid YouTube playlist URL" });
    // }

    // const playlist = await playlistDAO.create({ name: youtubePlaylist.snippet.title });

    // let firstCall = true;
    // let nextPageToken: string | undefined = undefined;
    // let curRank = LexoRank.middle();

    // while (firstCall || !!nextPageToken) {
    //   firstCall = false;

    //   const playlistItems = await Youtube.getPlaylistItems(playlistID, nextPageToken);
    //   nextPageToken = playlistItems.nextPageToken;

    //   for await (const playlistItem of playlistItems.items) {
    //     // Video no longer available
    //     if (!playlistItem.contentDetails.videoPublishedAt) {
    //       continue;
    //     }

    //     await videoDAO.insert({
    //       playlistID: playlist.id,
    //       rank: curRank.toString(),
    //       kind: "youtube",
    //       url: "https://www.youtube.com/watch?v=" + playlistItem.contentDetails.videoId,
    //       rawUrl: "https://www.youtube.com/watch?v=" + playlistItem.contentDetails.videoId,
    //       title: playlistItem.snippet.title,
    //       thumbnail_url: playlistItem.snippet.thumbnails.medium.url,
    //     });

    //     curRank = curRank.genPrev();
    //   }
    // }

    // return playlist;
  });

export const updatePlaylist = publicProcedure
  .input(
    z.object({
      id: z.number().positive(),
      name: z.string().trim().min(1).max(100),
    }),
  )
  .mutation(async ({ input }) => {
    return db
      .updateTable("playlist")
      .where("id", "=", input.id)
      .set({
        name: input.name,
      })
      .returningAll()
      .executeTakeFirstOrThrow(
        () => new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" }),
      );
  });
