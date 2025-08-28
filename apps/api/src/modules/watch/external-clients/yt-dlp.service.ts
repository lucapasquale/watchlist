import { Injectable } from "@nestjs/common";
// import { exec } from "node:child_process";
import fs from "node:fs";
// import { promisify } from "node:util";
import { Cookie } from "playwright";

// import { PlaylistItem } from "../playlist-item/playlist-item.model.js";
import { PlaylistItemData } from "./external-clients.service.js";

// const execPromise = promisify(exec);

// const EXTRACTOR_MAPS: Record<string, PlaylistItem["kind"]> = {
//   twitter: "x",
//   "kick:clips": "kick_clip",
//   TikTok: "tiktok",
// };

@Injectable()
export class YtDlpService {
  // private logger = new Logger(YtDlpService.name);

  urlMatches(url: URL) {
    return (
      url.host.match(/.*x\.com.*/gi) ||
      url.href.match(/.*kick\.com\/.*\/clips\/.*/gi) ||
      url.host.match(/.*tiktok\.com.*/gi)
    );
  }

  async playlistItemDataFromUrl(url: URL): Promise<PlaylistItemData | null> {
    return this.loadDataFromUrl(url);
  }

  async queryDataFromHref(_href: string, cookies: Cookie[] = []) {
    try {
      const addCookies = cookies.length > 0;
      if (addCookies) {
        await this.storeCookies(cookies);
      }

      // const { stderr, stdout } = await execPromise(
      //   [
      //     "yt-dlp",
      //     '-f "best[ext=mp4]"',
      //     addCookies ? "--cookies cookies.txt" : "",
      //     `-j "${href}"`,
      //   ].join(" "),
      // );

      // console.log(stderr);
      // console.log(stdout);
      // // fs.rmSync("cookies.txt");

      // if (stderr && !stderr.includes("attempting impersonation")) {
      //   this.logger.warn("Failed to load video info", {
      //     href,
      //     stderr,
      //   });

      //   return null;
      // }

      // return JSON.parse(stdout) as VideoInfo;
      return null;
    } catch {
      return null;
    }
  }

  private async storeCookies(cookies: Cookie[]) {
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

  private async loadDataFromUrl(url: URL): Promise<PlaylistItemData | null> {
    return url.toString() === "" ? null : null;
    // const videoInfo = await this.queryDataFromHref(url.toString());
    // if (!videoInfo) {
    //   return null;
    // }

    // const kind = EXTRACTOR_MAPS[videoInfo.extractor];
    // if (!kind) {
    //   return null;
    // }

    // return {
    //   kind,
    //   title: videoInfo.description ?? videoInfo.title,
    //   href: videoInfo.original_url,
    //   originalPosterName: videoInfo.uploader,
    //   embedUrl: videoInfo.url,
    //   thumbnailUrl: videoInfo.thumbnail,
    //   durationSeconds: Math.floor(videoInfo.duration),
    // };
  }
}

// type VideoInfo = {
//   extractor: string;
//   title: string;
//   description: string;
//   uploader: string;
//   duration: number;
//   original_url: string;
//   thumbnail: string;
//   url: string;
// };
