import { LexoRank } from "lexorank";
import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { GqlAuthGuard } from "../../auth/authentication/authentication.guard.js";
import { CurrentUser, type CurrentUserType } from "../../auth/user/current-user.decorator.js";
import type { Loaders } from "../../common/data-loader.service.js";
import { RedditService } from "../external-clients/reddit.service.js";
import { TwitchService } from "../external-clients/twitch.service.js";
import { YoutubeService } from "../external-clients/youtube.service.js";
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
  async playlist(@Parent() playlistItem: PlaylistItem, @Context("loaders") loaders: Loaders) {
    return loaders.playlist.load(playlistItem.playlistId);
  }

  @ResolveField()
  async nextItem(@Parent() playlistItem: PlaylistItem, @Args("shuffleSeed") shuffleSeed?: string) {
    return this.playlistItemService.getNextFromPlaylist(playlistItem, shuffleSeed);
  }

  @Query()
  async urlInformation(
    @Args("input") input: { rawUrl: string; startTimeSeconds?: number; endTimeSeconds?: number },
  ) {
    return this.getItemInputData(input);
  }

  @Query()
  async playlistItem(@Args("id") id: number, @Context("loaders") loaders: Loaders) {
    return loaders.playlistItem.load(id);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createPlaylistItem(
    @CurrentUser() user: CurrentUserType,
    @Args("input")
    input: {
      playlistID: number;
      rawUrl: string;
      startTimeSeconds?: number;
      endTimeSeconds?: number;
    },
  ) {
    const [playlist, lastItem, urlInformation] = await Promise.all([
      this.playlistService.getById(input.playlistID),
      this.playlistItemService.getLastFromPlaylist(input.playlistID),
      this.getItemInputData(input),
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

    const playlist = await this.playlistService.getById(item.playlistId);
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

    const playlist = await this.playlistService.getById(item.playlistId);
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

  private async getItemInputData(input: {
    rawUrl: string;
    startTimeSeconds?: number;
    endTimeSeconds?: number;
  }): Promise<Omit<PlaylistItemInsert, "rank" | "playlistId"> | null> {
    const url = new URL(input.rawUrl);

    if (this.youtubeService.urlMatches(url)) {
      return this.youtubeService.playlistItemData(input);
    }

    if (this.twitchService.urlMatches(url)) {
      return this.twitchService.playlistItemDataFromUrl(url);
    }

    if (this.redditService.urlMatches(url)) {
      return this.redditService.playlistItemDataFromUrl(url);
    }

    return null;
  }
}
