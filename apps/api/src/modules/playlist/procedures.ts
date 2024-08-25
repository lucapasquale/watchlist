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
  .input(z.number().positive())
  .query(async ({ input }) => {
    const video = await videoDAO.getByID(input);
    if (!video) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
    }

    const [previousVideo, nextVideo] = await Promise.all([
      videoDAO.getPrevious(video),
      videoDAO.getNext(video),
    ]);

    return {
      previousVideoID: previousVideo?.id ?? null,
      nextVideoID: nextVideo?.id ?? null,
    };
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
