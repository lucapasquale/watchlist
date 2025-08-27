import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";

import type { PlaylistItem } from "../playlist-item/playlist-item.model.js";
import { RedditService } from "./reddit.service.js";
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
    private youtubeService: YoutubeService,
    private redditService: RedditService,
    private twitchService: TwitchService,
    private ytDlpService: YtDlpService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async getPlaylistFromUrlCached(href: string): Promise<PlaylistData | null> {
    const cacheKey = `playlist:${href}`;
    return this.useCachedMethod(cacheKey, () => this.getPlaylistFromUrl(href));
  }

  async getVideoFromUrlCached(
    href: string,
    options: UrlOptions = {},
  ): Promise<PlaylistItemData | null> {
    const cacheKey = `video:${href}:${JSON.stringify(options)}`;
    return this.useCachedMethod(cacheKey, () => this.getVideoFromUrl(href, options));
  }

  private async getPlaylistFromUrl(href: string): Promise<PlaylistData | null> {
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

  private async getVideoFromUrl(
    href: string,
    options: UrlOptions = {},
  ): Promise<PlaylistItemData | null> {
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
    if (this.ytDlpService.urlMatches(url)) {
      return this.ytDlpService.playlistItemDataFromUrl(url);
    }

    return null;
  }

  private async useCachedMethod<T>(
    cacheKey: string,
    method: () => Promise<T>,
    ttl = 3_600,
  ): Promise<T | null> {
    const cached = await this.cacheManager.get<T>(cacheKey);
    if (cached !== undefined) {
      return cached;
    }

    const result = await method();
    await this.cacheManager.set(cacheKey, result, ttl);

    return result;
  }
}
