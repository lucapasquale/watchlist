import { Module, forwardRef } from "@nestjs/common";

import { UserModule } from "../user/user.module.js";
import { ExternalClientsResolver } from "./external-clients/external-clients.resolver.js";
import { ExternalClientsService } from "./external-clients/external-clients.service.js";
import { RedditService } from "./external-clients/reddit.service.js";
import { YoutubeService } from "./external-clients/youtube.service.js";
import { PlaylistItemResolver } from "./playlist-item/playlist-item.resolver.js";
import { PlaylistItemService } from "./playlist-item/playlist-item.service.js";
import { PlaylistController } from "./playlist/playlist.controller.js";
import { PlaylistResolver } from "./playlist/playlist.resolver.js";
import { PlaylistService } from "./playlist/playlist.service.js";

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [PlaylistController],
  providers: [
    ExternalClientsResolver,
    ExternalClientsService,
    RedditService,
    YoutubeService,
    PlaylistResolver,
    PlaylistService,
    PlaylistItemResolver,
    PlaylistItemService,
  ],
  exports: [PlaylistService, PlaylistItemService],
})
export class WatchModule {}
