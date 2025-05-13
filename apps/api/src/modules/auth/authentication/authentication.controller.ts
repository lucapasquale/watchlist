import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Redirect,
  Request,
  UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request as Req } from "express";

import { config } from "../../../config.js";
import { UserService } from "../../user/user.service.js";
import { AuthenticationService } from "./authentication.service.js";
import { GoogleOAuthGuard } from "./google.guard.js";
import { JwtPayload } from "./jwt.strategy.js";

@Controller("auth")
export class AuthenticationController {
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post("refresh")
  @HttpCode(200)
  async refresh(@Body("refreshToken") token: string) {
    const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
    if (!payload) {
      return null;
    }

    const user = await this.userService.getById(payload.sub);
    return this.authenticationService.generateTokens(user);
  }

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

    const { accessToken, refreshToken } = await this.authenticationService.generateTokens(user);

    const url = new URL(config.clientUrl);
    url.pathname = "/auth/google/redirect";

    const usp = new URLSearchParams({ accessToken, refreshToken });
    url.search = usp.toString();

    return { url: url.toString() };
  }
}
