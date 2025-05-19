import { ApolloServerPlugin, GraphQLRequestContext, GraphQLRequestListener } from "@apollo/server";
import { Plugin } from "@nestjs/apollo";
import { Logger } from "@nestjs/common";
import { inspect } from "node:util";

import { GraphQLContext } from "./gql-config.service.js";

const ALLOWED_ERRORS = ["Unauthorized", "Invalid URL"];

@Plugin()
export class RequestLogPlugin implements ApolloServerPlugin<GraphQLContext> {
  private readonly logger = new Logger("GraphQL");

  async requestDidStart(
    requestContext: GraphQLRequestContext<GraphQLContext>,
  ): Promise<GraphQLRequestListener<GraphQLContext>> {
    const logger = this.logger;

    const operationName = requestContext.request.operationName || "UNKNOWN";
    if (operationName !== "IntrospectionQuery") {
      logger.log("GraphQL request received", {
        operationName,
        requestID: requestContext.contextValue.requestID,
        userID: requestContext.contextValue.userID,
      });
    }

    return {
      didEncounterErrors: async (ctx) => {
        if (ctx.operation?.operation !== "subscription") {
          for (const error of ctx.errors) {
            if (ALLOWED_ERRORS.includes(error.message)) {
              return;
            }

            logger.log("GraphQL request failed", {
              operationName,
              requestID: requestContext.contextValue.requestID,
              userID: requestContext.contextValue.userID,
              error: inspect(error, { depth: 4 }),
            });
          }
        }
      },
      willSendResponse: async () => {
        logger.log("GraphQL request completed", {
          operationName,
          requestID: requestContext.contextValue.requestID,
          userID: requestContext.contextValue.userID,
        });
      },
    };
  }
}
