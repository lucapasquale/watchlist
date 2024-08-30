import { LexoRank } from "lexorank";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { RedditService } from "../../external-clients/reddit.service.js";
import { TwitchService } from "../../external-clients/twitch.service.js";
import { YoutubeService } from "../../external-clients/youtube.service.js";
import { PlaylistService } from "../playlist/playlist.service.js";

import type { PlaylistItem, PlaylistItemInsert } from "./playlist-item.model.js";
import { PlaylistItemService } from "./playlist-item.service.js";

@Resolver("PlaylistItem")
export class PlaylistItemResolver {
  constructor(
    private playlistService: PlaylistService,
    private playlistItemService: PlaylistItemService,
    private youtubeService: YoutubeService,
    private twitchService: TwitchService,
    private redditService: RedditService,
  ) {}

  @ResolveField()
  async playlist(@Parent() playlistItem: PlaylistItem) {
    return this.playlistService.getByID(playlistItem.playlistId);
  }

  @Query()
  async playlistItem(@Args("id") id: number) {
    return this.playlistItemService.getByID(id);
  }

  @Mutation()
  async createPlaylistItem(@Args("input") input: { playlistID: number; rawUrl: string }) {
    const [playlist, lastItem, itemPayload] = await Promise.all([
      this.playlistService.getByID(input.playlistID),
      this.playlistItemService.getLastFromPlaylist(input.playlistID),
      this.itemFromRawUrl(input.rawUrl),
    ]);

    if (!itemPayload) {
      throw new Error("Invalid URL");
    }

    const nextRank = this.getRankBetween([lastItem, undefined]);

    return this.playlistItemService.create({
      ...itemPayload,
      rank: nextRank.toString(),
      playlistId: playlist.id,
    });
  }

  @Mutation()
  async movePlaylistItem(@Args("input") input: { id: number; beforeID?: number }) {
    const item = await this.playlistItemService.getByID(input.id);

    // Assigned to be before the first video in the playlist
    if (!input.beforeID) {
      const [firstItem] = await this.playlistItemService.getFromPlaylist(
        item.playlistId,
        undefined,
        1,
      );
      if (!firstItem) {
        throw new Error("Can't move in empty playlist");
      }

      return this.playlistItemService.update({
        id: item.id,
        rank: this.getRankBetween([undefined, firstItem]).toString(),
      });
    }

    const beforeItem = await this.playlistItemService.getByID(input.beforeID);
    if (beforeItem.playlistId !== item.playlistId) {
      throw new Error("Invalid beforeID");
    }

    const afterItem = await this.playlistItemService.getNextFromPlaylist(beforeItem);

    return this.playlistItemService.update({
      id: item.id,
      rank: this.getRankBetween([beforeItem, afterItem]).toString(),
    });
  }

  @Mutation()
  async deletePlaylistItem(@Args("id") id: number) {
    await this.playlistItemService.delete(id);
    return true;
  }

  private getRankBetween([beforeVideo, afterVideo]: [
    PlaylistItem | undefined,
    PlaylistItem | undefined,
  ]) {
    if (beforeVideo && afterVideo) {
      return LexoRank.parse(beforeVideo.rank).between(LexoRank.parse(afterVideo.rank));
    }

    if (beforeVideo) {
      return LexoRank.parse(beforeVideo.rank).genNext();
    }

    if (afterVideo) {
      return LexoRank.parse(afterVideo.rank).genPrev();
    }

    return LexoRank.middle();
  }

  private async itemFromRawUrl(
    rawUrl: string,
  ): Promise<Omit<PlaylistItemInsert, "rank" | "playlistId"> | null> {
    const url = new URL(rawUrl);

    switch (this.getUrlKind(url)) {
      case "youtube": {
        const usp = new URLSearchParams(url.search);
        const videoID = usp.get("v");
        if (!videoID) {
          return null;
        }

        const video = await this.youtubeService.getVideo(videoID);
        if (!video) {
          return null;
        }

        return {
          kind: "youtube",
          rawUrl: rawUrl,
          url: `https://www.youtube.com/embed/${videoID}`,
          title: video.snippet.title,
          thumbnailUrl: video.snippet.thumbnails.medium.url,
        };
      }

      case "twitch_clip": {
        const clipID = url.pathname.split("/").pop();
        if (!clipID) {
          return null;
        }

        const clip = await this.twitchService.getClip(clipID);

        return {
          kind: "twitch_clip",
          rawUrl: rawUrl,
          url: clip.thumbnail_url.replace(/-preview-.+x.+\..*/gi, ".mp4"),
          title: clip.title,
          thumbnailUrl: clip.thumbnail_url,
        };
      }

      case "reddit": {
        const post = await this.redditService.getPost(rawUrl);
        if (!post) {
          return null;
        }

        return {
          kind: "reddit",
          rawUrl: rawUrl,
          url: post.media.reddit_video.hls_url.split("?")[0]!,
          title: post.title,
          thumbnailUrl: post.thumbnail,
        };
      }

      default: {
        return null;
      }
    }
  }

  private getUrlKind(url: URL): PlaylistItem["kind"] | null {
    if (url.href.match(/.*reddit\.com.*/gi)) {
      return "reddit";
    }

    if (url.href.match(/twitch.tv\/.+\/clip/gi)) {
      return "twitch_clip";
    }

    if (url.href.match(/youtube.com\/watch/gi)) {
      return "youtube";
    }

    return null;
  }
}
