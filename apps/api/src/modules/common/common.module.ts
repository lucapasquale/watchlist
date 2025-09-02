import { Logger, Module } from "@nestjs/common";

import { CacheService } from "./cache.service.js";
import { HealthController } from "./health.controller.js";

@Module({
  imports: [],
  controllers: [HealthController],
  providers: [Logger, CacheService],
  exports: [CacheService],
})
export class CommonModule {}
