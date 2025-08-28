import { Injectable } from "@nestjs/common";
import { chromium } from "playwright";

import { config } from "../../../config.js";
import { PlaylistItemData } from "./external-clients.service.js";
import { YtDlpService } from "./yt-dlp.service.js";

@Injectable()
export class TiktokService {
  constructor(private ytDlpService: YtDlpService) {}

  urlMatches(url: URL) {
    return url.host.match(/.*tiktok\.com.*/gi);
  }

  async playlistItemDataFromUrl(url: URL): Promise<PlaylistItemData | null> {
    const cookies = await this.getTikTokCookies();
    console.log(cookies);

    const videoInfo = await this.ytDlpService.queryDataFromHref(url.toString(), cookies);
    console.log(videoInfo);
    return null;
    // if (!videoInfo) {
    //   return null;
    // }

    // return {
    //   kind: "tiktok",
    //   title: videoInfo.description ?? videoInfo.title,
    //   href: videoInfo.original_url,
    //   originalPosterName: videoInfo.uploader,
    //   embedUrl: videoInfo.url,
    //   thumbnailUrl: videoInfo.thumbnail,
    //   durationSeconds: Math.floor(videoInfo.duration),
    // };
  }

  private async getTikTokCookies() {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto("https://www.tiktok.com/login/phone-or-email/email");

    await page.locator('input[name="username"]').fill(config.tiktok.username);
    await page.locator('input[type="password"]').fill(config.tiktok.password);
    await page.locator('button[type="submit"]').click();

    await page.waitForTimeout(3_000);
    await page.goto("https://www.tiktok.com/@not.even.emily/video/7409042460661370154?lang=en");
    await page.waitForTimeout(3_000);

    const cookies = await page.context().cookies();

    await browser.close();
    return cookies;
  }
}
