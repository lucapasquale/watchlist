import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { SimpleLogRecordProcessor } from "@opentelemetry/sdk-logs";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

import { config } from "./config.js";

const tracer = new NodeSDK({
  resource: resourceFromAttributes({
    [ATTR_SERVICE_NAME]: "watchlist-api",
    "deployment.environment": config.environment,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-winston": {
        logHook: (span, record) => {
          record["trace_id"] = span.spanContext().traceId;
          record["span_id"] = span.spanContext().spanId;
        },
      },
    }),
  ],

  traceExporter: new OTLPTraceExporter({ url: config.otlp.url + "/v1/traces" }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({ url: config.otlp.url + "/v1/metrics" }),
  }),
  logRecordProcessors: [
    new SimpleLogRecordProcessor(new OTLPLogExporter({ url: config.otlp.url + "/v1/logs" })),
  ],
});

tracer.start();

process.on("SIGTERM", () => {
  tracer
    .shutdown()
    .then(() => console.log("Tracing terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
