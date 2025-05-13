import { Module } from "@nestjs/common";

import { UserModule } from "../user/user.module.js";
import { WatchModule } from "../watch/watch.module.js";
import { DataLoaderService } from "./data-loader.service.js";
import { HealthController } from "./health.controller.js";
import { LoggingPlugin } from "./logging.plugin.js";

@Module({
  imports: [UserModule, WatchModule],
  controllers: [HealthController],
  providers: [DataLoaderService, LoggingPlugin],
  exports: [DataLoaderService],
})
export class CommonModule {}
