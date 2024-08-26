import { z } from "zod";
import { TRPCError } from "@trpc/server";

import { publicProcedure } from "../../trpc.js";
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

    return videoDAO.getQueue({ ...input, after: video }, 5);
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
