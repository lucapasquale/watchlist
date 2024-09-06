import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

import { db } from "./database/index.js";
import { migrateToLatest } from "./database/migrator.js";
import { AppModule } from "./app.module.js";
import { config } from "./config.js";

async function bootstrap() {
  await migrateToLatest(db);

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  app.enableCors();
  app
    .getHttpAdapter()
    .getInstance()
    .addHook("onRequest", (request, reply, done) => {
      (reply as any).setHeader = function (key: string, value: string) {
        return this.raw.setHeader(key, value);
      };
      (reply as any).end = function () {
        this.raw.end();
      };
      (request as any).res = reply;
      done();
    });

  await app.listen(config.port, config.host);
}
bootstrap();
