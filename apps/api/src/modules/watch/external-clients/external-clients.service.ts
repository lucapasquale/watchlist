import { Injectable } from "@nestjs/common";

import { CacheService } from "../../common/cache.service.js";
import type { PlaylistItem } from "../playlist-item/playlist-item.model.js";
import { RedditService } from "./reddit.service.js";
import { TiktokService } from "./tiktok.service.js";
import { TwitchService } from "./twitch.service.js";
import { YoutubeService } from "./youtube.service.js";
import { YtDlpService } from "./yt-dlp.service.js";

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
    private cacheService: CacheService,
    private youtubeService: YoutubeService,
    private redditService: RedditService,
    private twitchService: TwitchService,
    private ytDlpService: YtDlpService,
    private tiktokService: TiktokService,
  ) {}

  async getPlaylistFromUrlCached(href: string): Promise<PlaylistData | null> {
    const cacheKey = `playlist:${href}`;

    return this.cacheService.useCachedCall(cacheKey, async () => {
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
    });
  }

  async getVideoFromUrlCached(
    href: string,
    options: UrlOptions = {},
  ): Promise<PlaylistItemData | null> {
    const cacheKey = `video:${href}:${JSON.stringify(options)}`;

    return this.cacheService.useCachedCall(cacheKey, async () => {
      const url = new URL(href);

      if (this.youtubeService.urlMatches(url)) {
        return this.youtubeService.playlistItemDataFromUrl(url, options);
      }
      if (this.redditService.urlMatches(url)) {
        return this.redditService.playlistItemDataFromUrl(url);
      }
      if (this.tiktokService.urlMatches(url)) {
        return this.tiktokService.playlistItemDataFromUrl(url);
      }
      if (this.ytDlpService.urlMatches(url)) {
        return this.ytDlpService.playlistItemDataFromUrl(url);
      }

      return null;
    });
  }
}
