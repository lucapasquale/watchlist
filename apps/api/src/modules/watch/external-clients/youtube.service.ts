import axios, { AxiosInstance } from "axios";
import { Injectable } from "@nestjs/common";

import { config } from "../../../config.js";

import { UrlOptions } from "./external-clients.service.js";

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
    return url.href.match(/youtube.com\/watch/gi);
  }

  async playlistItemData(url: URL, options: UrlOptions = {}) {
    const usp = new URLSearchParams(url.search);
    const videoID = usp.get("v");
    if (!videoID) {
      return null;
    }

    const video = await this.getVideo(videoID);
    if (!video) {
      return null;
    }

    const videoUrl = new URL(`https://www.youtube.com/embed/${videoID}`);
    if (options.startTimeSeconds) {
      videoUrl.searchParams.set("start", String(options.startTimeSeconds));
    }
    if (options.endTimeSeconds) {
      videoUrl.searchParams.set("end", String(options.endTimeSeconds));
    }

    return {
      kind: "youtube" as const,
      rawUrl: url.toString(),
      url: videoUrl.toString(),
      title: video.snippet.title,
      thumbnailUrl: video.snippet.thumbnails.medium.url,
      durationSeconds: this.getVideoDuration(video.contentDetails.duration),
    };
  }

  async getVideo(videoID: string) {
    const { data } = await this.client.get<ApiResponse<Video>>("/videos", {
      params: { id: videoID, part: "snippet,contentDetails" },
    });

    return data.items[0];
  }

  async getPlaylist(playlistID: string) {
    const { data } = await this.client.get<ApiResponse<Playlist>>("/playlists", {
      params: { id: playlistID, part: "snippet" },
    });

    return data.items[0];
  }

  async getPlaylistItems(playlistID: string, pageToken?: string) {
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

  private getVideoDuration(durationCode: string) {
    const matches = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/.exec(durationCode);
    if (!matches) {
      console.error("Invalid duration code", durationCode);
      throw new Error("Invalid duration code");
    }

    const hours = parseInt(matches[1] || "0");
    const minutes = parseInt(matches[2] || "0");
    const seconds = parseInt(matches[3] || "0");

    return hours * 3600 + minutes * 60 + seconds;
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
