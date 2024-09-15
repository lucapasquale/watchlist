import axios, { AxiosInstance } from "axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class YoutubeService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://www.googleapis.com/youtube/v3",
      params: { key: process.env.YOUTUBE_API_KEY },
    });
  }

  urlMatches(url: URL) {
    return url.href.match(/youtube.com\/watch/gi);
  }

  async playlistItemData(input: {
    rawUrl: string;
    startTimeSeconds?: number;
    endTimeSeconds?: number;
  }) {
    const url = new URL(input.rawUrl);

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
    if (input.startTimeSeconds) {
      videoUrl.searchParams.set("start", String(input.startTimeSeconds));
    }
    if (input.endTimeSeconds) {
      videoUrl.searchParams.set("end", String(input.endTimeSeconds));
    }

    return {
      kind: "youtube" as const,
      rawUrl: input.rawUrl,
      url: videoUrl.toString(),
      title: video.snippet.title,
      thumbnailUrl: video.snippet.thumbnails.medium.url,
    };
  }

  async getVideo(videoID: string) {
    const { data } = await this.client.get<ApiResponse<Video>>("/videos", {
      params: { id: videoID, part: "snippet" },
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
        part: "snippet,contentDetails",
        maxResults: 50,
        pageToken,
      },
    });

    return data;
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
    playlistId: string;
    position: 0;
    resourceId: {
      kind: string;
      videoId: string;
    };
    videoOwnerChannelTitle: string;
    videoOwnerChannelId: string;
  };
  contentDetails: {
    videoId: string;
    videoPublishedAt?: string;
  };
};
