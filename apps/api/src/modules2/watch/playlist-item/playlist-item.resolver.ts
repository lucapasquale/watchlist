import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import type { PlaylistItem } from "../../../modules/playlist/models.js";
import { getRankBetween } from "../../../modules/playlist/utils/rank.js";
import { parseUserURL } from "../../../modules/playlist/utils/services.js";
import { PlaylistService } from "../playlist/playlist.service.js";

import { PlaylistItemService } from "./playlist-item.service.js";

@Resolver("PlaylistItem")
export class PlaylistItemResolver {
  constructor(
    private playlistService: PlaylistService,
    private playlistItemService: PlaylistItemService,
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
    const [playlist, lastItem, urlPayload] = await Promise.all([
      this.playlistService.getByID(input.playlistID),
      this.playlistItemService.getLastFromPlaylist(input.playlistID),
      parseUserURL(input.rawUrl),
    ]);

    if (!urlPayload) {
      throw new Error("Invalid URL");
    }

    const nextRank = getRankBetween([lastItem, undefined]);

    return this.playlistItemService.create({
      ...urlPayload,
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
        rank: getRankBetween([undefined, firstItem]).toString(),
      });
    }

    const beforeItem = await this.playlistItemService.getByID(input.beforeID);
    if (beforeItem.playlistId !== item.playlistId) {
      throw new Error("Invalid beforeID");
    }

    const afterItem = await this.playlistItemService.getNextFromPlaylist(beforeItem);

    return this.playlistItemService.update({
      id: item.id,
      rank: getRankBetween([beforeItem, afterItem]).toString(),
    });
  }

  @Mutation()
  async deletePlaylistItem(@Args("id") id: number) {
    await this.playlistItemService.delete(id);
    return true;
  }
}
