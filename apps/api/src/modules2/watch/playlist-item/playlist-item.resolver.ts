import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import type { PlaylistItem } from "../../../modules/playlist/models.js";
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

  // TODO: Add mutations
}
