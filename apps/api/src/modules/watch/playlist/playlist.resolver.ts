import { LexoRank } from "lexorank";
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { YoutubeService } from "../../external-clients/youtube.service.js";
import { PlaylistItemService } from "../playlist-item/playlist-item.service.js";

import type { Playlist } from "./playlist.model.js";
import { PlaylistService } from "./playlist.service.js";

@Resolver("Playlist")
export class PlaylistResolver {
  constructor(
    private playlistService: PlaylistService,
    private playlistItemService: PlaylistItemService,
    private youtubeService: YoutubeService,
  ) {}

  @ResolveField()
  async firstItem(@Parent() playlist: Playlist, @Args("shuffleSeed") shuffleSeed?: string) {
    const items = await this.playlistItemService.getFromPlaylist(playlist.id, shuffleSeed, 1);
    return items[0];
  }

  @ResolveField()
  async itemsCount(@Parent() playlist: Playlist) {
    return this.playlistItemService.countFromPlaylist(playlist.id);
  }

  @ResolveField()
  async items(@Parent() playlist: Playlist, @Args("shuffleSeed") shuffleSeed?: string) {
    return this.playlistItemService.getFromPlaylist(playlist.id, shuffleSeed);
  }

  @Query()
  async playlists() {
    return this.playlistService.getAll();
  }

  @Query()
  async playlist(@Args("id") id: number) {
    return this.playlistService.getByID(id);
  }

  @Mutation()
  async createPlaylist(@Args("input") input: { name: string }) {
    return this.playlistService.create(input);
  }

  @Mutation()
  async createPlaylistFromYoutube(@Args("url") url: string) {
    const usp = new URLSearchParams(new URL(url).search);
    const playlistID = usp.get("list");
    if (!playlistID) {
      throw new Error("Invalid YouTube playlist URL");
    }

    const youtubePlaylist = await this.youtubeService.getPlaylist(playlistID);
    if (!youtubePlaylist) {
      throw new Error("Invalid YouTube playlist URL");
    }

    const playlist = await this.playlistService.create({ name: youtubePlaylist.snippet.title });

    let firstCall = true;
    let nextPageToken: string | undefined = undefined;
    let curRank = LexoRank.middle();

    while (firstCall || !!nextPageToken) {
      firstCall = false;

      const playlistItems = await this.youtubeService.getPlaylistItems(playlistID, nextPageToken);
      nextPageToken = playlistItems.nextPageToken;

      const ranks = new Array(playlistItems.items.length).fill(null).map(() => {
        curRank = curRank.genNext();
        return curRank;
      });

      await this.playlistItemService.create(
        playlistItems.items
          // Videos without `publishedAt` have been removed
          .filter((playlistItem) => !!playlistItem.contentDetails.videoPublishedAt)
          .map((playlistItem, idx) => ({
            playlistId: playlist.id,
            rank: ranks[idx]!.toString(),
            kind: "youtube",
            url: "https://www.youtube.com/watch?v=" + playlistItem.contentDetails.videoId,
            rawUrl: "https://www.youtube.com/watch?v=" + playlistItem.contentDetails.videoId,
            title: playlistItem.snippet.title,
            thumbnailUrl: playlistItem.snippet.thumbnails.medium.url,
          })),
      );
    }

    return playlist;
  }

  @Mutation()
  async updatePlaylist(@Args("input") input: { id: number; name: string }) {
    return this.playlistService.update(input);
  }

  @Mutation()
  async deletePlaylist(@Args("id") id: number) {
    return this.playlistService.delete(id);
  }
}
