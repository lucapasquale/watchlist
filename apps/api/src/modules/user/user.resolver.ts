import { Args, Query, Resolver } from "@nestjs/graphql";

// import { AuthService } from "../auth/auth.service.js";
import { UserService } from "./user.service.js";

@Resolver("User")
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query()
  async getUser(@Args("username") username: string) {
    console.log(username, await this.userService.findOne(username));
    return this.userService.findOne(username);
  }
}
