import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { ExternalClientsModule } from "./modules/external-clients/external-clients.module.js";
import { PlaylistModule } from "./modules/watch/watch.module.js";

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

    PlaylistModule,
    ExternalClientsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
