import { Injectable } from "@nestjs/common";

import type { PlaylistItem } from "../playlist-item/playlist-item.model.js";
import { KickService } from "./kick.service.js";
import { RedditService } from "./reddit.service.js";
import { TwitchService } from "./twitch.service.js";
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
  "kind" | "href" | "embedUrl" | "title" | "thumbnailUrl" | "durationSeconds" | "originalPosterName"
>;

@Injectable()
export class ExternalClientsService {
  constructor(
    private youtubeService: YoutubeService,
    private redditService: RedditService,
    private twitchService: TwitchService,
    private kickService: KickService,
  ) {}

  async getPlaylistFromUrl(href: string): Promise<PlaylistData | null> {
    const url = new URL(href);

    if (this.youtubeService.urlMatches(url)) {
      return this.youtubeService.playlistDataFromUrl(url);
    }
    if (this.redditService.urlMatches(url)) {
      return this.redditService.playlistDataFromUrl(url);
    }
    if (this.twitchService.urlMatches(url)) {
      return this.twitchService.playlistDataFromUrl(url);
    }

    return null;
  }

  async getVideoFromUrl(href: string, options: UrlOptions = {}): Promise<PlaylistItemData | null> {
    const url = new URL(href);

    if (this.youtubeService.urlMatches(url)) {
      return this.youtubeService.playlistItemDataFromUrl(url, options);
    }
    if (this.redditService.urlMatches(url)) {
      return this.redditService.playlistItemDataFromUrl(url);
    }
    if (this.twitchService.urlMatches(url)) {
      return this.twitchService.playlistItemDataFromUrl(url);
    }
    if (this.kickService.urlMatches(url)) {
      return this.kickService.playlistItemDataFromUrl(url);
    }

    return null;
  }
}
