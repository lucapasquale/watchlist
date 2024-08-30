import { Module } from "@nestjs/common";

import { RedditService } from "./reddit.service.js";
import { TwitchService } from "./twitch.service.js";
import { YoutubeService } from "./youtube.service.js";

@Module({
  imports: [],
  controllers: [],
  providers: [YoutubeService, TwitchService, RedditService],
  exports: [YoutubeService, TwitchService, RedditService],
})
export class ExternalClientsModule {}
