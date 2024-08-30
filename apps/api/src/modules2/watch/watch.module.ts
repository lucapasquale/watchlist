import { Module } from "@nestjs/common";

import { PlaylistResolver } from "./playlist/playlist.resolver.js";
import { PlaylistService } from "./playlist/playlist.service.js";
import { PlaylistItemResolver } from "./playlist-item/playlist-item.resolver.js";
import { PlaylistItemService } from "./playlist-item/playlist-item.service.js";

@Module({
  imports: [],
  controllers: [],
  providers: [PlaylistResolver, PlaylistService, PlaylistItemResolver, PlaylistItemService],
})
export class PlaylistModule {}
