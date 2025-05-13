import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request as Req } from "express";

import { User } from "../../user/user.model.js";

@Injectable()
export class AuthenticationService {
  constructor(private jwtService: JwtService) {}

  googleLogin(req: Req) {
    if (!req.user) {
      return null;
    }

    return req.user as User;
  }

  async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
