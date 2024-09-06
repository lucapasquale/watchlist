import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { GqlAuthGuard } from "../authentication/authentication.guard.js";
import type { AccessTokenResponse } from "../authentication/jwt.strategy.js";
import { CurrentUser } from "../current-user.decorator.js";

import { UserService } from "./user.service.js";

@Resolver("User")
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query()
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: AccessTokenResponse) {
    console.log(user);
    return this.userService.getById(user.userId);
  }
}
