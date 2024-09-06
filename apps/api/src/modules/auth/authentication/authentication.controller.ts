import type { FastifyRequest } from "fastify";
import { Controller, Get, Request, UseGuards } from "@nestjs/common";

import { AuthenticationService } from "./authentication.service.js";
import { GoogleOAuthGuard } from "./google.guard.js";

@Controller("auth")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get("google-redirect")
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req: FastifyRequest) {
    const user = this.authenticationService.googleLogin(req);
    if (user) {
      return this.authenticationService.generateTokens(user);
    }

    return null;
  }
}
