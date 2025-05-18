import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { GraphQLInstrumentation } from "@opentelemetry/instrumentation-graphql";
import { NestInstrumentation } from "@opentelemetry/instrumentation-nestjs-core";
import { WinstonInstrumentation } from "@opentelemetry/instrumentation-winston";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

import { config } from "./config.js";

export const tracer = new NodeSDK({
  resource: resourceFromAttributes({ [ATTR_SERVICE_NAME]: "watchlist-api" }),
  traceExporter: new OTLPTraceExporter({ url: config.telemetry.traceExporterUrl }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new NestInstrumentation(),
    new GraphQLInstrumentation(),
    new WinstonInstrumentation({
      logHook: (span, record) => {
        // Add trace context to the log record
        record["trace_id"] = span.spanContext().traceId;
        record["span_id"] = span.spanContext().spanId;
      },
    }),
  ],
});

tracer.start();

// Gracefully shut down the SDK on process exit
process.on("SIGTERM", () => {
  tracer
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
