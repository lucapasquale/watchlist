import type { Request as Req } from "express";
import { Controller, Get, Redirect, Request, UseGuards } from "@nestjs/common";

import { config } from "../../../config.js";

import { AuthenticationService } from "./authentication.service.js";
import { GoogleOAuthGuard } from "./google.guard.js";

@Controller("auth")
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Get("google")
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get("google-redirect")
  @UseGuards(GoogleOAuthGuard)
  @Redirect()
  async googleAuthRedirect(@Request() req: Req) {
    const user = this.authenticationService.googleLogin(req);
    if (!user) {
      return null;
    }

    const { accessToken } = await this.authenticationService.generateTokens(user);

    const url = new URL(config.clientUrl);
    url.pathname = "/auth/google/redirect";

    const usp = new URLSearchParams({ accessToken });
    url.search = usp.toString();

    return { url: url.toString() };
  }
}
