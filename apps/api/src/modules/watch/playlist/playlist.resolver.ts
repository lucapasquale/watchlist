import { LexoRank } from "lexorank";
import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { GqlAuthGuard } from "../../auth/authentication/authentication.guard.js";
import { CurrentUser, type CurrentUserType } from "../../auth/user/current-user.decorator.js";
import type { Loaders } from "../../common/data-loader.service.js";
import { YoutubeService } from "../external-clients/youtube.service.js";
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
  async itemsCount(@Parent() playlist: Playlist, @Context("loaders") loaders: Loaders) {
    return loaders.playlistItemsCount.load(playlist.id);
  }

  @ResolveField()
  async items(@Parent() playlist: Playlist, @Args("shuffleSeed") shuffleSeed?: string) {
    return this.playlistItemService.getFromPlaylist(playlist.id, shuffleSeed);
  }

  @ResolveField()
  async user(@Parent() playlist: Playlist, @Context("loaders") loaders: Loaders) {
    return loaders.user.load(playlist.userId);
  }

  @Query()
  async playlists() {
    return this.playlistService.getAll();
  }

  @Query()
  async playlist(@Args("id") id: number, @Context("loaders") loaders: Loaders) {
    return loaders.playlist.load(id);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createPlaylist(
    @CurrentUser() user: CurrentUserType,
    @Args("input")
    input: { name: Playlist["name"]; newItemsPosition?: Playlist["newItemsPosition"] },
  ) {
    return this.playlistService.create({
      ...input,
      userId: user.userId,
    });
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createPlaylistFromYoutube(@CurrentUser() user: CurrentUserType, @Args("url") url: string) {
    const usp = new URLSearchParams(new URL(url).search);
    const playlistID = usp.get("list");
    if (!playlistID) {
      throw new Error("Invalid YouTube playlist URL");
    }

    const youtubePlaylist = await this.youtubeService.getPlaylist(playlistID);
    if (!youtubePlaylist) {
      throw new Error("Invalid YouTube playlist URL");
    }

    const playlist = await this.playlistService.create({
      name: youtubePlaylist.snippet.title,
      userId: user.userId,
    });

    let firstCall = true;
    let nextPageToken: string | undefined = undefined;
    let curRank = LexoRank.middle();

    while (firstCall || !!nextPageToken) {
      firstCall = false;

      const playlistItems = await this.youtubeService.getPlaylistItems(playlistID, nextPageToken);
      nextPageToken = playlistItems.nextPageToken;

      const videos = await Promise.all(
        playlistItems.items
          // Videos without `publishedAt` have been removed
          .filter((playlistItem) => !!playlistItem.contentDetails.videoPublishedAt)
          .map((playlistItem) =>
            this.youtubeService.playlistItemData(
              new URL("https://www.youtube.com/watch?v=" + playlistItem.contentDetails.videoId),
            ),
          ),
      );

      const ranks = Array.from({ length: videos.length })
        .fill(null)
        .map(() => {
          curRank = curRank.genNext();
          return curRank;
        });

      await this.playlistItemService.create(
        videos.flatMap((video, idx) => {
          if (!video) {
            return [];
          }

          return {
            playlistId: playlist.id,
            rank: ranks[idx]!.toString(),
            ...video,
          };
        }),
      );
    }

    return playlist;
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async updatePlaylist(
    @CurrentUser() user: CurrentUserType,
    @Args("input")
    input: { id: number; name: Playlist["name"]; newItemsPosition?: Playlist["newItemsPosition"] },
  ) {
    const playlist = await this.playlistService.getById(input.id);
    if (playlist.userId !== user.userId) {
      throw new Error("Playlist not found");
    }

    return this.playlistService.update(input);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async deletePlaylist(@CurrentUser() user: CurrentUserType, @Args("id") id: number) {
    const playlist = await this.playlistService.getById(id);
    if (playlist.userId !== user.userId) {
      throw new Error("Playlist not found");
    }

    return this.playlistService.delete(id);
  }
}
