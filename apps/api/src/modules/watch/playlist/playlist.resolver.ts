import { UseGuards } from "@nestjs/common";
import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { LexoRank } from "lexorank";

import type { Loaders } from "../../apollo/data-loader.service.js";
import { GqlAuthGuard } from "../../auth/authentication/authentication.guard.js";
import {
  CurrentUser,
  type CurrentUserType,
} from "../../auth/authentication/current-user.decorator.js";
import { ExternalClientsService } from "../external-clients/external-clients.service.js";
import { PlaylistItemService } from "../playlist-item/playlist-item.service.js";
import type { Playlist } from "./playlist.model.js";
import { PlaylistService } from "./playlist.service.js";

@Resolver("Playlist")
export class PlaylistResolver {
  constructor(
    private playlistService: PlaylistService,
    private playlistItemService: PlaylistItemService,
    private externalClientsService: ExternalClientsService,
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
  async itemsKind(@Parent() playlist: Playlist, @Context("loaders") loaders: Loaders) {
    return loaders.playlistItemsKind.load(playlist.id);
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
    input: {
      name: Playlist["name"];
      href: Playlist["href"];
      newItemsPosition?: Playlist["newItemsPosition"];
    },
  ) {
    if (!input.href) {
      return this.playlistService.create({
        name: input.name,
        newItemsPosition: input.newItemsPosition,
        userId: user.userId,
      });
    }

    const data = await this.externalClientsService.getPlaylistFromUrl(input.href);
    if (!data) {
      throw new Error("Invalid playlist URL");
    }

    const playlist = await this.playlistService.create({
      name: input.name || data.name,
      href: input.href,
      newItemsPosition: input.newItemsPosition,
      userId: user.userId,
    });

    let curRank = LexoRank.middle();
    const ranks = Array.from({ length: data.items.length })
      .fill(null)
      .map(() => {
        curRank = curRank.genNext();
        return curRank;
      });

    await this.playlistItemService.create(
      data.items.map((item, idx) => ({
        playlistId: playlist.id,
        rank: ranks[idx]!.toString(),
        ...item,
      })),
    );

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
