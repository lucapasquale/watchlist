import { Args, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { PlaylistService } from "../../watch/playlist/playlist.service.js";

import { type User } from "./user.model.js";
import { UserService } from "./user.service.js";

@Resolver("User")
export class UserResolver {
  constructor(
    private userService: UserService,
    private playlistService: PlaylistService,
  ) {}

  @ResolveField()
  initials(@Parent() user: User) {
    return user.name
      .split(" ")
      .map((str) => str[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  @ResolveField()
  async playlists(@Parent() user: User) {
    return this.playlistService.getAllByUser(user.id);
  }

  @Query()
  async user(@Args("id") id: number) {
    return this.userService.getById(id);
  }
}
