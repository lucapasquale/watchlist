import { Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module.js";
import { WatchModule } from "../watch/watch.module.js";

import { DataLoaderService } from "./data-loader.service.js";
import { HealthController } from "./health.controller.js";

@Module({
  imports: [AuthModule, WatchModule],
  controllers: [HealthController],
  providers: [DataLoaderService],
  exports: [DataLoaderService],
})
export class CommonModule {}
