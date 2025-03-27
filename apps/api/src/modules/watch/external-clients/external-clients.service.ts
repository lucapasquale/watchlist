import { Injectable } from "@nestjs/common";

import type { PlaylistItemInsert } from "../playlist-item/playlist-item.model.js";

import { RedditService } from "./reddit.service.js";
import { YoutubeService } from "./youtube.service.js";

export type UrlOptions = {
  startTimeSeconds?: number;
  endTimeSeconds?: number;
};

@Injectable()
export class ExternalClientsService {
  constructor(
    private youtubeService: YoutubeService,
    private redditService: RedditService,
  ) {}

  async getUrlVideoData(
    rawUrl: string,
    options: UrlOptions = {},
  ): Promise<Omit<PlaylistItemInsert, "rank" | "playlistId"> | null> {
    const url = new URL(rawUrl);

    if (this.youtubeService.urlMatches(url)) {
      return this.youtubeService.playlistItemData(url, options);
    }

    if (this.redditService.urlMatches(url)) {
      return this.redditService.playlistItemDataFromUrl(url);
    }

    return null;
  }
}
