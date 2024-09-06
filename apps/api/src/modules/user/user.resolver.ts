import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { GqlAuthGuard } from "../auth/auth.guard.js";
import { CurrentUser } from "../auth/current-user.decorator.js";
import type { AccessTokenResponse } from "../auth/jwt.strategy.js";

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
