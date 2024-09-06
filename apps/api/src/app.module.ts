import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { AuthModule } from "./modules/auth/auth.module.js";
import { ExternalClientsModule } from "./modules/external-clients/external-clients.module.js";
import { HealthModule } from "./modules/health/health.module.js";
import { WatchModule } from "./modules/watch/watch.module.js";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      typePaths: ["./**/*.graphql"],
      resolvers: {
        PlaylistItemKind: {
          YOUTUBE: "youtube",
          TWITCH_CLIP: "twitch_clip",
          REDDIT: "reddit",
        },
      },
    }),

    AuthModule,
    ExternalClientsModule,
    HealthModule,
    WatchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
