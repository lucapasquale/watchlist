import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module.js";
import { UserModule } from "../user/user.module.js";
import { WatchModule } from "../watch/watch.module.js";
import { DataLoaderService } from "./data-loader.service.js";
import { GqlConfigService } from "./gql-config.service.js";
import { RequestLogPlugin } from "./request-log.plugin.js";

@Module({
  imports: [AuthModule, WatchModule, UserModule],
  providers: [GqlConfigService, RequestLogPlugin, DataLoaderService],
  controllers: [],
  exports: [DataLoaderService],
})
export class ApolloModule {}
