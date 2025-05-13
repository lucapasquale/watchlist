import { Module, forwardRef } from "@nestjs/common";

import { WatchModule } from "../watch/watch.module.js";
import { MeResolver } from "./me.resolver.js";
import { UserResolver } from "./user.resolver.js";
import { UserService } from "./user.service.js";

@Module({
  imports: [forwardRef(() => WatchModule)],
  providers: [UserService, MeResolver, UserResolver],
  exports: [UserService],
})
export class UserModule {}
