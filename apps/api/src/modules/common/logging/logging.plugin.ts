import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestListener,
} from "@apollo/server";
import { Plugin } from "@nestjs/apollo";
import { Logger } from "@nestjs/common";
import { inspect } from "node:util";

const ALLOWED_ERRORS = ["Unauthorized", "Invalid URL"];

@Plugin()
export class LoggingPlugin implements ApolloServerPlugin<BaseContext> {
  private readonly logger = new Logger("GraphQL");

  async requestDidStart(
    requestContext: GraphQLRequestContext<BaseContext>,
  ): Promise<GraphQLRequestListener<BaseContext>> {
    const logger = this.logger;

    if (requestContext.request.operationName !== "IntrospectionQuery") {
      logger.log(`Request received: ${requestContext.request.operationName || "undefined"}`);
    }

    return {
      didEncounterErrors: async (ctx) => {
        if (ctx.operation?.operation !== "subscription") {
          for (const error of ctx.errors) {
            if (ALLOWED_ERRORS.includes(error.message)) {
              return;
            }

            logger.error(`error: ${inspect(error, { depth: 4 })}`);
          }
        }

        logger.log(`Request OK: ${requestContext.request.operationName || "undefined"}`);
      },
      willSendResponse: async () => {
        logger.log(`Request OK: ${requestContext.request.operationName || "undefined"}`);
      },
    };
  }
}
