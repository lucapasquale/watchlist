import type { Request as Req } from "express";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "../user/user.model.js";

@Injectable()
export class AuthenticationService {
  constructor(private jwtService: JwtService) {}

  googleLogin(req: Req) {
    console.log("req.user", req.user);
    if (!req.user) {
      return null;
    }

    return req.user as User;
  }

  async generateTokens(user: User) {
    console.log("generateTokens", user);
    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
