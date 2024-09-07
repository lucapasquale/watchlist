import { LexoRank } from "lexorank";
import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { GqlAuthGuard } from "../../auth/authentication/authentication.guard.js";
import { CurrentUser, type CurrentUserType } from "../../auth/current-user.decorator.js";
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

  @ResolveField()
  async nextItem(@Parent() playlistItem: PlaylistItem, @Args("shuffleSeed") shuffleSeed?: string) {
    return this.playlistItemService.getNextFromPlaylist(playlistItem, shuffleSeed);
  }

  @Query()
  async urlInformation(@Args("url") url: string) {
    return this.parseUrlInformation(url);
  }

  @Query()
  async playlistItem(@Args("id") id: number) {
    return this.playlistItemService.getByID(id);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createPlaylistItem(
    @CurrentUser() user: CurrentUserType,
    @Args("input") input: { playlistID: number; rawUrl: string },
  ) {
    const [playlist, lastItem, urlInformation] = await Promise.all([
      this.playlistService.getByID(input.playlistID),
      this.playlistItemService.getLastFromPlaylist(input.playlistID),
      this.parseUrlInformation(input.rawUrl),
    ]);

    if (playlist.userId !== user.userId) {
      throw new Error("Playlist not found");
    }
    if (!urlInformation) {
      throw new Error("Invalid URL");
    }

    const nextRank = this.getRankBetween([lastItem, undefined]);

    return this.playlistItemService.create({
      ...urlInformation,
      rank: nextRank.toString(),
      playlistId: playlist.id,
    });
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async movePlaylistItem(
    @CurrentUser() user: CurrentUserType,
    @Args("input") input: { id: number; beforeID?: number },
  ) {
    const item = await this.playlistItemService.getByID(input.id);

    const playlist = await this.playlistService.getByID(item.playlistId);
    if (playlist.userId !== user.userId) {
      throw new Error("Playlist not found");
    }

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
  @UseGuards(GqlAuthGuard)
  async deletePlaylistItem(@CurrentUser() user: CurrentUserType, @Args("id") id: number) {
    const item = await this.playlistItemService.getByID(id);

    const playlist = await this.playlistService.getByID(item.playlistId);
    if (playlist.userId !== user.userId) {
      throw new Error("Playlist not found");
    }

    return this.playlistItemService.delete(id);
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

  private async parseUrlInformation(
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
