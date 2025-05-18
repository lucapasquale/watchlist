import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Logger, Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { AuthModule } from "./modules/auth/auth.module.js";
import { CommonModule } from "./modules/common/common.module.js";
import { DataLoaderService } from "./modules/common/data-loader.service.js";
import { WatchModule } from "./modules/watch/watch.module.js";

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,

      imports: [CommonModule],
      inject: [DataLoaderService],
      useFactory: (dataloaderService: DataLoaderService) => ({
        playground: true,
        typePaths: ["./**/*.graphql"],
        context: () => ({
          loaders: dataloaderService.generateLoaders(),
        }),
        resolvers: {
          PlaylistNewItemsPosition: {
            BOTTOM: "bottom",
            TOP: "top",
          },
          PlaylistItemKind: {
            YOUTUBE: "youtube",
            REDDIT: "reddit",
            TWITCH_CLIP: "twitch_clip",
          },
        },
      }),
    }),

    AuthModule,
    CommonModule,
    WatchModule,
  ],
  controllers: [],
  providers: [Logger],
})
export class AppModule {}
