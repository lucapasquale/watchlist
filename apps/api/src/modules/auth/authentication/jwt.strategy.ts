import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { config } from "../../../config.js";

type JwtPayload = {
  /** Subject */
  sub: number;
  /** Issued at time */
  iat: number;
  /** Expiration time */
  exp: number;

  email: string;
};

export type AccessTokenResponse = {
  userId: number;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKey: config.auth.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload): Promise<AccessTokenResponse> {
    return { userId: payload.sub, email: payload.email };
  }
}
