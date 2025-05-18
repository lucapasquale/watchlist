// sort-imports-ignore
import { tracer } from "./tracing.js";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";
import { config } from "./config.js";
import { db } from "./database/index.js";
import { migrateToLatest } from "./database/migrator.js";
import winston from "winston";
import { WinstonModule } from "nest-winston";

async function bootstrap() {
  tracer.start();

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      levels: winston.config.npm.levels,
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      transports: [new winston.transports.Console()],
    }),
  });
  app.enableCors();

  await migrateToLatest(db);
  await app.listen(config.port, config.host);

  const logger = new Logger("NestApplication");
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
