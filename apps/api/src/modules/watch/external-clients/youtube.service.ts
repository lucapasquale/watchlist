import { Injectable } from "@nestjs/common";
import { parseDuration } from "@workspace/helpers/duration";
import axios, { AxiosInstance } from "axios";

import { config } from "../../../config.js";
import { PlaylistData, PlaylistItemData, UrlOptions } from "./external-clients.service.js";

@Injectable()
export class YoutubeService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://www.googleapis.com/youtube/v3",
      params: { key: config.youtube.apiKey },
    });
  }

  urlMatches(url: URL) {
    return url.host.match(/youtube.com/gi) || url.host.match(/youtu.be/gi);
  }

  async playlistDataFromUrl(url: URL): Promise<PlaylistData | null> {
    const playlistID = new URLSearchParams(url.search).get("list");
    if (!playlistID) {
      throw new Error("Invalid YouTube playlist URL");
    }

    const ytPlaylist = await this.getPlaylist(playlistID);
    if (!ytPlaylist) {
      throw new Error("Invalid YouTube playlist URL");
    }

    let firstCall = true;
    let nextPageToken: string | undefined = undefined;
    const items: PlaylistItemData[] = [];

    while (firstCall || !!nextPageToken) {
      firstCall = false;

      const ytPlaylistItems = await this.getPlaylistItems(playlistID, nextPageToken);
      nextPageToken = ytPlaylistItems.nextPageToken;

      const videos = await Promise.all(
        ytPlaylistItems.items
          // Videos without `publishedAt` have been removed
          .filter((playlistItem) => !!playlistItem.contentDetails.videoPublishedAt)
          .map((playlistItem) =>
            this.playlistItemDataFromUrl(
              new URL("https://www.youtube.com/watch?v=" + playlistItem.contentDetails.videoId),
            ),
          ),
      );

      const newItems = videos.filter(Boolean) as PlaylistItemData[];
      items.push(...newItems);
    }

    return {
      name: ytPlaylist.snippet.title,
      items,
    };
  }

  async playlistItemDataFromUrl(
    url: URL,
    options: UrlOptions = {},
  ): Promise<PlaylistItemData | null> {
    const video = await this.loadUrlVideo(url);
    if (!video) {
      return null;
    }

    const embedUrl = new URL(`https://www.youtube.com/embed/${video.id}`);
    if (options.startTimeSeconds) {
      embedUrl.searchParams.set("start", String(options.startTimeSeconds));
    }
    if (options.endTimeSeconds) {
      embedUrl.searchParams.set("end", String(options.endTimeSeconds));
    }

    return {
      kind: "youtube",
      href: url.toString(),
      embedUrl: embedUrl.toString(),
      originalPosterName: video.snippet.channelTitle,
      title: video.snippet.title,
      thumbnailUrl: video.snippet.thumbnails.medium.url,
      durationSeconds: parseDuration(video.contentDetails.duration.replace("PT", "")),
    };
  }

  private async loadUrlVideo(url: URL) {
    if (url.host === "youtu.be") {
      const videoID = url.pathname.replace("/", "");
      return this.getVideo(videoID);
    }

    if (url.host.replace("www.", "") === "youtube.com") {
      const videoID = new URLSearchParams(url.search).get("v");
      if (videoID) {
        return this.getVideo(videoID);
      }
    }

    if (url.pathname.startsWith("/shorts/")) {
      const videoID = url.pathname.replace("/shorts/", "");
      return this.getVideo(videoID);
    }

    return null;
  }

  private async getPlaylist(playlistID: string) {
    const { data } = await this.client.get<ApiResponse<Playlist>>("/playlists", {
      params: { id: playlistID, part: "snippet" },
    });

    return data.items[0];
  }

  private async getPlaylistItems(playlistID: string, pageToken?: string) {
    const { data } = await this.client.get<ApiResponse<PlaylistItem>>("/playlistItems", {
      params: {
        playlistId: playlistID,
        part: "contentDetails",
        maxResults: 50,
        pageToken,
      },
    });

    return data;
  }

  private async getVideo(videoID: string) {
    const { data } = await this.client.get<ApiResponse<Video>>("/videos", {
      params: { id: videoID, part: "snippet,contentDetails" },
    });

    return data.items[0];
  }
}

type ApiResponse<T> = {
  kind: string;
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: Array<
    T & {
      kind: string;
      etag: string;
      id: string;
    }
  >;
  nextPageToken?: string;
};
type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

type Video = {
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: Thumbnail;
      medium: Thumbnail;
      high: Thumbnail;
      standard: Thumbnail;
      maxres: Thumbnail;
    };
    channelTitle: string;
    categoryId: string;
    liveBroadcastContent: string;
    localized: {
      title: string;
      description: string;
    };
  };
  contentDetails: {
    duration: string;
    dimension: string;
    definition: string;
    caption: string;
    licensedContent: boolean;
    contentRating: object;
    projection: string;
  };
};

type Playlist = {
  snippet: {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
      default: Thumbnail;
      medium: Thumbnail;
      high: Thumbnail;
      standard: Thumbnail;
      maxres: Thumbnail;
    };
    channelTitle: string;
  };
};

type PlaylistItem = {
  contentDetails: {
    videoId: string;
    videoPublishedAt?: string;
  };
};
