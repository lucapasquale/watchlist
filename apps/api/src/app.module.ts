import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { AuthModule } from "./modules/auth/auth.module.js";
import { CommonModule } from "./modules/common/common.module.js";
import { DataLoaderService } from "./modules/common/data-loader.service.js";
import { ExternalClientsModule } from "./modules/external-clients/external-clients.module.js";
import { WatchModule } from "./modules/watch/watch.module.js";

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,

      imports: [CommonModule],
      inject: [DataLoaderService],
      useFactory: (dataloaderService: DataLoaderService) => {
        return {
          playground: false,
          typePaths: ["./**/*.graphql"],
          context: () => ({
            loaders: dataloaderService.generateLoaders(),
          }),
          resolvers: {
            PlaylistItemKind: {
              YOUTUBE: "youtube",
              TWITCH_CLIP: "twitch_clip",
              REDDIT: "reddit",
            },
          },
        };
      },
    }),

    AuthModule,
    ExternalClientsModule,
    CommonModule,
    WatchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
