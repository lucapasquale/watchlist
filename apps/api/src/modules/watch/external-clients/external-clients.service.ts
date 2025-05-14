import { Injectable } from "@nestjs/common";

import type { PlaylistItem } from "../playlist-item/playlist-item.model.js";
import { RedditService } from "./reddit.service.js";
import { YoutubeService } from "./youtube.service.js";

export type UrlOptions = {
  startTimeSeconds?: number;
  endTimeSeconds?: number;
};

export type PlaylistData = {
  name: string;
  items: PlaylistItemData[];
};

export type PlaylistItemData = Pick<
  PlaylistItem,
  "kind" | "rawUrl" | "url" | "title" | "thumbnailUrl" | "durationSeconds"
>;

@Injectable()
export class ExternalClientsService {
  constructor(
    private youtubeService: YoutubeService,
    private redditService: RedditService,
  ) {}

  async getPlaylistFromUrl(rawUrl: string): Promise<PlaylistData | null> {
    const url = new URL(rawUrl);

    if (this.youtubeService.urlMatches(url)) {
      return this.youtubeService.playlistDataFromUrl(url);
    }
    if (this.redditService.urlMatches(url)) {
      return this.redditService.playlistDataFromUrl(url);
    }

    return null;
  }

  async getVideoFromUrl(
    rawUrl: string,
    options: UrlOptions = {},
  ): Promise<PlaylistItemData | null> {
    const url = new URL(rawUrl);

    if (this.youtubeService.urlMatches(url)) {
      return this.youtubeService.playlistItemDataFromUrl(url, options);
    }

    if (this.redditService.urlMatches(url)) {
      return this.redditService.playlistItemDataFromUrl(url);
    }

    return null;
  }
}
