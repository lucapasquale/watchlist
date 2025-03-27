import { Args, Query, Resolver } from "@nestjs/graphql";

import { ExternalClientsService } from "./external-clients.service.js";

@Resolver()
export class ExternalClientsResolver {
  constructor(private externalClientsService: ExternalClientsService) {}

  @Query()
  async urlInformation(
    @Args("input") input: { rawUrl: string; startTimeSeconds?: number; endTimeSeconds?: number },
  ) {
    return this.externalClientsService.getUrlVideoData(input.rawUrl, {
      startTimeSeconds: input.startTimeSeconds,
      endTimeSeconds: input.endTimeSeconds,
    });
  }
}
