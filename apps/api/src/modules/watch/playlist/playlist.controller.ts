import { Controller, Post, Req, UnauthorizedException } from "@nestjs/common";
import type { Request } from "express";

import { config } from "../../../config.js";
import { ExternalClientsService } from "../external-clients/external-clients.service.js";
import { PlaylistItemService } from "../playlist-item/playlist-item.service.js";
import { Playlist } from "./playlist.model.js";
import { PlaylistService } from "./playlist.service.js";

@Controller("playlists")
export class PlaylistController {
  constructor(
    private playlistService: PlaylistService,
    private playlistItemService: PlaylistItemService,
    private externalClientsService: ExternalClientsService,
  ) {}

  @Post("sync-all")
  async syncAll(@Req() req: Request) {
    if (req.headers["admin-token"] !== config.adminToken) {
      throw new UnauthorizedException();
    }

    console.log("Syncing all playlists...");
    const playlists = await this.playlistService.getAll();
    await Promise.all(playlists.map((playlist) => this.syncPlaylist(playlist)));

    return { success: true, playlistsCount: playlists.length };
  }

  private async syncPlaylist(playlist: Playlist) {
    const items = await this.playlistItemService.getFromPlaylist(playlist.id);

    console.log("Syncing playlist", playlist.id, "with", items.length, "items");

    items
      .filter((i) => !i.durationSeconds)
      .forEach(async (item) => {
        try {
          const data = await this.externalClientsService.getVideoFromUrl(item.rawUrl);
          if (!data) {
            return;
          }

          await this.playlistItemService.update({
            id: item.id,
            title: data.title,
            thumbnailUrl: data.thumbnailUrl,
            durationSeconds: data.durationSeconds ?? undefined,
          });
        } catch (err) {
          console.error(
            "Error syncing playlist item",
            item.id,
            err instanceof Error ? err.message : err,
          );
        }
      });
  }
}
