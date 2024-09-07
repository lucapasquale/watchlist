import { Parent, ResolveField, Resolver } from "@nestjs/graphql";

import { type User } from "./user.model.js";

@Resolver("User")
export class UserResolver {
  constructor() {}

  @ResolveField()
  initials(@Parent() user: User) {
    return user.name
      .split(" ")
      .map((str) => str[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
}
