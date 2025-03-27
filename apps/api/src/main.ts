import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { db } from "./database/index.js";
import { migrateToLatest } from "./database/migrator.js";
import { AppModule } from "./app.module.js";
import { config } from "./config.js";

async function bootstrap() {
  await migrateToLatest(db);

  const app = await NestFactory.create(AppModule, {
    logger: ["log", "warn", "error", "fatal"],
  });

  app.enableCors();
  await app.listen(config.port, config.host);

  const logger = new Logger("NestApplication");
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
