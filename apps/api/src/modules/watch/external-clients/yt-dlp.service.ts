import { Injectable, Logger } from "@nestjs/common";
import { exec } from "node:child_process";
import { promisify } from "node:util";

import { PlaylistItemData } from "./external-clients.service.js";

const execPromise = promisify(exec);

const EXTRACTOR_MAPS: Record<string, PlaylistItemData["kind"]> = {
  twitter: "x",
  "kick:clips": "kick_clip",
  "twitch:clips": "twitch_clip",
  Instagram: "instagram_reel",
};

@Injectable()
export class YtDlpService {
  private logger = new Logger(YtDlpService.name);

  urlMatches(url: URL) {
    return (
      url.host.match(/.*x\.com.*/gi) ||
      url.href.match(/.*kick\.com\/.*\/clips\/.*/gi) ||
      url.href.match(/.*twitch\.tv\/.*\/clip\/.*/gi) ||
      url.href.match(/.*instagram\.com\/.*/gi)
    );
  }

  async playlistItemDataFromUrl(url: URL): Promise<PlaylistItemData | null> {
    const videoInfo = await this.extractVideoInfo(url);
    if (!videoInfo) {
      return null;
    }

    console.log(videoInfo);

    const kind = EXTRACTOR_MAPS[videoInfo.extractor];
    if (!kind) {
      return null;
    }

    return {
      kind,
      title: videoInfo.description ?? videoInfo.title,
      href: videoInfo.original_url,
      originalPosterName: videoInfo.uploader,
      embedUrl: videoInfo.url,
      thumbnailUrl: videoInfo.thumbnail,
      durationSeconds: Math.floor(videoInfo.duration),
    };
  }

  async extractVideoInfo(url: URL): Promise<VideoInfo | null> {
    try {
      const { stderr, stdout } = await execPromise(
        `yt-dlp -f "best[ext=mp4]" -j "${url.toString()}"`,
      );

      if (stderr && !stderr.includes("attempting impersonation")) {
        this.logger.warn("Failed to load video info", {
          url: url.toString(),
          stderr,
        });

        return null;
      }

      return JSON.parse(stdout) as VideoInfo;
    } catch {
      return null;
    }
  }
}

type VideoInfo = {
  extractor: string;
  title: string;
  description?: string;
  uploader: string;
  duration: number;
  original_url: string;
  thumbnail: string;
  url: string;
};
