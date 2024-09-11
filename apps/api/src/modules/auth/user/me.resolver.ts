import { UseGuards } from "@nestjs/common";
import { Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";

import { GqlAuthGuard } from "../authentication/authentication.guard.js";
import { CurrentUser, type CurrentUserType } from "./current-user.decorator.js";

import { type User } from "./user.model.js";
import { UserService } from "./user.service.js";

@Resolver("Me")
export class MeResolver {
  constructor(private userService: UserService) {}

  @ResolveField()
  initials(@Parent() user: User) {
    return user.name
      .split(" ")
      .map((str) => str[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: CurrentUserType) {
    if (!user) {
      return null;
    }

    return this.userService.getById(user.userId);
  }
}
