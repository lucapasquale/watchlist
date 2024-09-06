import type { FastifyRequest } from "fastify";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import { User } from "../user/user.model.js";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  googleLogin(req: FastifyRequest & { user?: User }) {
    if (!req.user) {
      return null;
    }

    return req.user;
  }

  async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
