import { OpenTelemetryTransportV3 } from "@opentelemetry/winston-transport";
import { WinstonModule } from "nest-winston";
import winston from "winston";

import { config } from "../../config.js";

export function generateLogger() {
  if (config.environment !== "production") {
    return WinstonModule.createLogger({
      levels: winston.config.npm.levels,
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      transports: [new winston.transports.Console()],
    });
  }

  return WinstonModule.createLogger({
    levels: winston.config.npm.levels,
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [new winston.transports.Console(), new OpenTelemetryTransportV3()],
  });
}
