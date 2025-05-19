import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";
import { config } from "./config.js";
import { db } from "./database/index.js";
import { migrateToLatest } from "./database/migrator.js";
import { generateLogger } from "./modules/common/logger.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: generateLogger(),
  });

  await migrateToLatest(db);
  await app.listen(config.port, config.host);

  const logger = new Logger("NestApplication");
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
