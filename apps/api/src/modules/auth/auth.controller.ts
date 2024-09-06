import type { FastifyRequest } from "fastify";
import { Controller, Get, Request, UseGuards } from "@nestjs/common";

import { AuthService } from "./auth.service.js";
import { GoogleOAuthGuard } from "./google.guard.js";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  @Get("google-redirect")
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req: FastifyRequest) {
    const user = this.authService.googleLogin(req);
    if (user) {
      return this.authService.generateTokens(user);
    }

    return null;
  }
}
