import { Module } from "@nestjs/common";

import { PlaylistResolver } from "./playlist.resolver.js";
import { PlaylistService } from "./playlist.service.js";
import { PlaylistItemResolver } from "./playlist-item.resolver.js";
import { PlaylistItemService } from "./playlist-item.service.js";

@Module({
  imports: [],
  controllers: [],
  providers: [PlaylistResolver, PlaylistService, PlaylistItemResolver, PlaylistItemService],
})
export class PlaylistModule {}
