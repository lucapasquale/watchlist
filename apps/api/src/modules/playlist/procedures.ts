import { LexoRank } from "lexorank";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { publicProcedure } from "../../trpc.js";
import * as Youtube from "../services/youtube.js";
import * as videoDAO from "../video/dao.js";

import * as playlistDAO from "./dao.js";

export const getPlaylist = publicProcedure.input(z.number().positive()).query(async ({ input }) => {
  const playlist = await playlistDAO.getByID(input);
  if (!playlist) {
    throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" });
  }

  return playlist;
});

export const getPlaylistMetadata = publicProcedure
  .input(
    z.object({
      videoID: z.number().positive(),
      shuffle: z.boolean().optional(),
    }),
  )
  .query(async ({ input }) => {
    const video = await videoDAO.getByID(input.videoID);
    if (!video) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
    }

    if (input.shuffle) {
      const [previousVideo, nextVideo] = await videoDAO.getManyRandom(video, 2);

      return {
        previousVideoID: previousVideo?.id ?? null,
        nextVideoID: nextVideo?.id ?? null,
      };
    }

    const [previousVideo, nextVideo] = await videoDAO.getSurrounding(video);

    return {
      previousVideoID: previousVideo?.id ?? null,
      nextVideoID: nextVideo?.id ?? null,
    };
  });

export const getPlaylistQueue = publicProcedure
  .input(
    z.object({
      playlistID: z.number().positive(),
      currentVideoID: z.number().positive(),
      shuffleSeed: z.string().min(1).optional(),
    }),
  )
  .query(async ({ input }) => {
    const video = await videoDAO.getByID(input.currentVideoID);

    return videoDAO.getQueue({ ...input, after: video! }, 5);
  });

export const createPlaylist = publicProcedure
  .input(
    z.object({
      name: z.string().trim().min(1).max(100),
    }),
  )
  .mutation(async ({ input }) => {
    // TODO: implement
    console.log(input);
  });

// https://www.youtube.com/playlist?list=PL2gDVp_0vZOQjqMex201dYpUiu1mcGX96

export const createPlaylistFromYoutube = publicProcedure
  .input(z.object({ url: z.string().url() }))
  .mutation(async ({ input }) => {
    const url = new URL(input.url);
    const usp = new URLSearchParams(url.search);
    const playlistID = usp.get("list");
    if (!playlistID) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid YouTube playlist URL" });
    }

    const youtubePlaylist = await Youtube.getPlaylist(playlistID);
    if (!youtubePlaylist) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid YouTube playlist URL" });
    }

    const playlist = await playlistDAO.create({ name: youtubePlaylist.snippet.title });

    let firstCall = true;
    let nextPageToken: string | undefined = undefined;
    let curRank = LexoRank.middle();

    while (firstCall || !!nextPageToken) {
      firstCall = false;

      const playlistItems = await Youtube.getPlaylistItems(playlistID, nextPageToken);
      nextPageToken = playlistItems.nextPageToken;

      for await (const playlistItem of playlistItems.items) {
        // Video no longer available
        if (!playlistItem.contentDetails.videoPublishedAt) {
          continue;
        }

        await videoDAO.insert({
          playlistID: playlist.id,
          rank: curRank.toString(),
          kind: "youtube",
          url: "https://www.youtube.com/watch?v=" + playlistItem.contentDetails.videoId,
          rawUrl: "https://www.youtube.com/watch?v=" + playlistItem.contentDetails.videoId,
          title: playlistItem.snippet.title,
          thumbnail_url: playlistItem.snippet.thumbnails.medium.url,
        });

        curRank = curRank.genPrev();
      }
    }

    return playlist;
  });

export const updatePlaylist = publicProcedure
  .input(
    z.object({
      id: z.number().positive(),
      name: z.string().trim().min(1).max(100),
    }),
  )
  .mutation(async ({ input }) => {
    const playlist = await playlistDAO.getByID(input.id);
    if (!playlist) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" });
    }

    return playlistDAO.update(input.id, { name: input.name });
  });
