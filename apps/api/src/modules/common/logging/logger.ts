import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import { WinstonModule } from "nest-winston";
import winston from "winston";

import { config } from "../../../config.js";

export function generateLogger() {
  if (!config.telemetry.logtail.token || !config.telemetry.logtail.endpoint) {
    return WinstonModule.createLogger({
      levels: winston.config.npm.levels,
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      transports: [new winston.transports.Console()],
    });
  }

  const logtail = new Logtail(config.telemetry.logtail.token, {
    endpoint: config.telemetry.logtail.endpoint,
  });

  return WinstonModule.createLogger({
    levels: winston.config.npm.levels,
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [new winston.transports.Console(), new LogtailTransport(logtail)],
  });
}
