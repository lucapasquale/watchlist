import { Injectable, Logger } from "@nestjs/common";
import { exec } from "node:child_process";
import { promisify } from "node:util";

import { PlaylistItemData } from "./external-clients.service.js";

const execPromise = promisify(exec);

const EXTRACTOR_MAPS: Record<string, PlaylistItemData["kind"]> = {
  twitter: "x",
  "kick:clips": "kick_clip",
};

@Injectable()
export class YtDlpService {
  private logger = new Logger("YtDlpService");

  urlMatches(url: URL) {
    return url.host.match(/.*x\.com.*/gi) || url.href.match(/.*kick\.com\/.*\/clips\/.*/gi);
  }

  async playlistItemDataFromUrl(url: URL): Promise<PlaylistItemData | null> {
    try {
      return await this.loadDataFromUrl(url);
    } catch {
      return null;
    }
  }

  private async loadDataFromUrl(url: URL): Promise<PlaylistItemData | null> {
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

    const videoInfo = JSON.parse(stdout) as VideoInfo;

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
}

type VideoInfo = {
  extractor: string;
  title: string;
  description: string;
  uploader: string;
  duration: number;
  original_url: string;
  thumbnail: string;
  url: string;
};
