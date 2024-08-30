import { Args, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import type { Playlist } from "../../modules/playlist/models.js";

import { PlaylistService } from "./playlist.service.js";
import { PlaylistItemService } from "./playlist-item.service.js";

@Resolver("Playlist")
export class PlaylistResolver {
  constructor(
    private playlistService: PlaylistService,
    private playlistItemService: PlaylistItemService,
  ) {}

  @ResolveField()
  async firstItem(@Parent() playlist: Playlist, @Args("shuffleSeed") shuffleSeed?: string) {
    const items = await this.playlistItemService.getForPlaylist(playlist.id, shuffleSeed, 1);
    return items[0];
  }

  @ResolveField()
  async itemsCount(@Parent() playlist: Playlist) {
    return this.playlistItemService.countForPlaylist(playlist.id);
  }

  @ResolveField()
  async items(@Parent() playlist: Playlist, @Args("shuffleSeed") shuffleSeed?: string) {
    return this.playlistItemService.getForPlaylist(playlist.id, shuffleSeed);
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
  async updatePlaylist(@Args("input") input: { id: number; name: string }) {
    return this.playlistService.update(input);
  }

  @Mutation()
  async deletePlaylist(@Args("id") id: number) {
    return this.playlistService.delete(id);
  }
}
