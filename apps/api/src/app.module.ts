import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";

import { PlaylistModule } from "./modules2/playlist/playlist.module.js";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false,
      typePaths: ["./**/*.graphql"],
    }),

    PlaylistModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
