import { forwardRef, Module } from "@nestjs/common";

import { AuthModule } from "../auth/auth.module.js";

import { ExternalClientsService } from "./external-clients/external-clients.service.js";
import { RedditService } from "./external-clients/reddit.service.js";
import { TwitchService } from "./external-clients/twitch.service.js";
import { YoutubeService } from "./external-clients/youtube.service.js";
import { PlaylistController } from "./playlist/playlist.controller.js";
import { PlaylistResolver } from "./playlist/playlist.resolver.js";
import { PlaylistService } from "./playlist/playlist.service.js";
import { PlaylistItemResolver } from "./playlist-item/playlist-item.resolver.js";
import { PlaylistItemService } from "./playlist-item/playlist-item.service.js";

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [PlaylistController],
  providers: [
    ExternalClientsService,
    RedditService,
    TwitchService,
    YoutubeService,
    PlaylistResolver,
    PlaylistService,
    PlaylistItemResolver,
    PlaylistItemService,
  ],
  exports: [PlaylistService, PlaylistItemService],
})
export class WatchModule {}
