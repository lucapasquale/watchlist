import z from "zod";
import { TRPCError } from "@trpc/server";

import { publicProcedure } from "../../trpc";
import * as playlistDAO from "../playlist/dao";

import { getRankBetween } from "./utils/rank";
import { parseUserURL } from "./utils/services";
import * as videoDAO from "./dao";

export const getPlaylistVideos = publicProcedure
  .input(z.number().positive())
  .query(async ({ input }) => videoDAO.getManyByPlaylistID(input));

export const getPlaylistInitialVideo = publicProcedure
  .input(
    z.object({
      playlistID: z.number().positive(),
      shuffleSeed: z.string().min(1).optional(),
    }),
  )
  .query(async ({ input }) => {
    const [regular, shuffle] = await Promise.all([
      videoDAO.getPlaylistFirst(input.playlistID),
      videoDAO.getPlaylistFirst(input.playlistID, input.shuffleSeed),
    ]);

    return { regular, shuffle };
  });

export const getVideo = publicProcedure
  .input(z.number().positive())
  .query(async ({ input }) => videoDAO.getByID(input));

export const createVideo = publicProcedure
  .input(
    z.object({
      playlistID: z.number().positive(),
      rawUrl: z.string().trim().url(),
    }),
  )
  .mutation(async ({ input }) => {
    const [urlPayload, playlist] = await Promise.all([
      parseUserURL(input.rawUrl),
      playlistDAO.getByID(input.playlistID),
    ]);
    if (!urlPayload) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid URL" });
    }
    if (!playlist) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Playlist not found" });
    }

    return videoDAO.create({ ...urlPayload, playlistID: playlist.id });
  });

export const updateVideo = publicProcedure
  .input(
    z.object({
      id: z.number().positive(),
      rawUrl: z.string().trim().url(),
    }),
  )
  .mutation(async ({ input }) => {
    const [urlPayload, video] = await Promise.all([
      parseUserURL(input.rawUrl),
      videoDAO.getByID(input.id),
    ]);
    if (!urlPayload) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid URL" });
    }
    if (!video) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
    }

    return videoDAO.update(input.id, { ...urlPayload });
  });

export const moveVideo = publicProcedure
  .input(
    z.object({
      id: z.number().positive(),
      videoBeforeID: z.number().positive().nullable(),
    }),
  )
  .mutation(async ({ input }) => {
    const video = await videoDAO.getByID(input.id);
    if (!video) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
    }

    // Assigned to be before the first video in the playlist
    if (input.videoBeforeID === null) {
      const firstVideo = await videoDAO.getPlaylistFirst(video.playlistID);
      if (!firstVideo) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid move" });
      }

      return videoDAO.update(input.id, {
        rank: getRankBetween([undefined, firstVideo]).toString(),
      });
    }

    const beforeVideo = await videoDAO.getByID(input.videoBeforeID);
    if (!beforeVideo || beforeVideo.playlistID !== video.playlistID) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid move" });
    }

    const [, afterVideo] = await videoDAO.getSurrounding(beforeVideo);

    return videoDAO.update(input.id, {
      rank: getRankBetween([beforeVideo, afterVideo]).toString(),
    });
  });

export const deleteVideo = publicProcedure
  .input(z.number().positive())
  .mutation(async ({ input }) => {
    const video = await videoDAO.getByID(input);
    if (!video) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Video not found" });
    }

    await videoDAO.remove(video.id);
  });
