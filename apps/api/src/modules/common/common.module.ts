import { Logger, Module } from "@nestjs/common";

import { UserModule } from "../user/user.module.js";
import { WatchModule } from "../watch/watch.module.js";
import { HealthController } from "./health.controller.js";

@Module({
  imports: [UserModule, WatchModule],
  controllers: [HealthController],
  providers: [Logger],
  exports: [],
})
export class CommonModule {}
