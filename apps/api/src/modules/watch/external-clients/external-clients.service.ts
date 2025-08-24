import { Injectable } from "@nestjs/common";
import fs from "node:fs";
import { Browser, Cookie, chromium } from "playwright";

import { config } from "../../../config.js";
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
  ) {}

  // TODO: Move this to a worker in a queue
  static async loadCookies() {
    const browser = await chromium.launch();
    const cookies = await this.getTikTokCookies(browser);

    await this.storeCookies(cookies);

    await browser.close();
  }

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
    // TODO: Enable Kick when clips are working
    // if (this.kickService.urlMatches(url)) {
    //   return this.kickService.playlistItemDataFromUrl(url);
    // }
    if (this.ytDlpService.urlMatches(url)) {
      return this.ytDlpService.playlistItemDataFromUrl(url);
    }

    return null;
  }

  private static async getTikTokCookies(browser: Browser) {
    const page = await browser.newPage();

    await page.goto("https://www.tiktok.com/login/phone-or-email/email");

    await page.locator('input[name="username"]').fill(config.tiktok.username);
    await page.locator('input[type="password"]').fill(config.tiktok.password);
    await page.locator('button[type="submit"]').click();

    return await page.context().cookies();
  }

  private static async storeCookies(cookies: Cookie[]) {
    const rows = cookies.map(({ domain, expires, path, secure, name, value }) => {
      const includeSubDomain = !!domain?.startsWith(".");
      const expiry = expires > 0 ? expires.toFixed() : "0";
      const arr = [domain, includeSubDomain, path, secure, expiry, name, value];

      return arr.map((v) => (typeof v === "boolean" ? v.toString().toUpperCase() : v)).join("\t");
    });

    const fileData = [
      "# Netscape HTTP Cookie File",
      "# http://curl.haxx.se/rfc/cookie_spec.html",
      "# This is a generated file!  Do not edit.",
      "",
      ...rows,
      "", // Add a new line at the end
    ].join("\n");

    fs.writeFileSync("cookies.txt", fileData);
  }
}
