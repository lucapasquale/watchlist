import { NestFactory } from "@nestjs/core";

import { db } from "./database/index.js";
import { migrateToLatest } from "./database/migrator.js";
import { AppModule } from "./app.module.js";
import { config } from "./config.js";

async function bootstrap() {
  await migrateToLatest(db);

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(config.port, config.host);
}
bootstrap();
