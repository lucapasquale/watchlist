import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module.js";
import { WatchModule } from "../watch/watch.module.js";

import { DataLoaderService } from "./data-loader.service.js";
import { HealthController } from "./health.controller.js";
import { LoggingPlugin } from "./logging.plugin.js";

@Module({
  imports: [AuthModule, WatchModule],
  controllers: [HealthController],
  providers: [DataLoaderService, LoggingPlugin],
  exports: [DataLoaderService],
})
export class CommonModule {}
