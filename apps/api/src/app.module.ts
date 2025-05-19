import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";

import { ApolloModule } from "./modules/apollo/apollo.module.js";
import { DataLoaderService } from "./modules/apollo/data-loader.service.js";
import { GqlConfigService } from "./modules/apollo/gql-config.service.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { CommonModule } from "./modules/common/common.module.js";
import { WatchModule } from "./modules/watch/watch.module.js";

@Module({
  imports: [
    ApolloModule,
    AuthModule,
    CommonModule,
    WatchModule,

    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ApolloModule, AuthModule],
      inject: [DataLoaderService, JwtService],
      useClass: GqlConfigService,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
