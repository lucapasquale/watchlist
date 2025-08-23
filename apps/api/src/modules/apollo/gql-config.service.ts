import { ApolloDriverConfig } from "@nestjs/apollo";
import { Injectable } from "@nestjs/common";
import { GqlOptionsFactory } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { randomUUID } from "node:crypto";

import { JwtPayload } from "../auth/authentication/jwt.strategy.js";
import { DataLoaderService, Loaders } from "./data-loader.service.js";

export type GraphQLContext = {
  requestID: string;
  userID: number | undefined;
  loaders: Loaders;
};

@Injectable()
export class GqlConfigService implements GqlOptionsFactory {
  constructor(
    private readonly dataloaderService: DataLoaderService,
    private readonly jwtService: JwtService,
  ) {}

  async createGqlOptions(): Promise<ApolloDriverConfig> {
    return {
      typePaths: ["./**/*.graphql"],
      context: this.buildContext.bind(this),
      resolvers: {
        PlaylistNewItemsPosition: {
          BOTTOM: "bottom",
          TOP: "top",
        },
        PlaylistItemKind: {
          YOUTUBE: "youtube",
          REDDIT: "reddit",
          TWITCH_CLIP: "twitch_clip",
          KICK_CLIP: "kick_clip",
          X: "x",
        },
      },
    };
  }

  private buildContext({ req }: { req: Request }): GraphQLContext {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    let jwtPayload = null;

    try {
      jwtPayload = this.jwtService.verify<JwtPayload>(token);
    } catch {}

    return {
      userID: jwtPayload?.sub,
      requestID: randomUUID(),
      loaders: this.dataloaderService.generateLoaders(),
    };
  }
}
