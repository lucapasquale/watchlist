import axios from "axios";

import { config } from "../../config.js";

type ApiResponse<T> = {
  kind: string;
  etag: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
  items: T[];
  nextPageToken?: string;
};
type Thumbnail = {
  url: string;
  width: number;
  height: number;
};

const client = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: { key: config.youtube.apiKey },
});

type Video = {
  kind: string;
  etag: string;
  id: string;
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
export async function getVideo(videoID: string) {
  const { data } = await client.get<ApiResponse<Video>>("/videos", {
    params: { id: videoID, part: "snippet" },
  });

  return data.items[0];
}

type Playlist = {
  kind: string;
  etag: string;
  id: string;
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
export async function getPlaylist(playlistID: string) {
  const { data } = await client.get<ApiResponse<Playlist>>("/playlists", {
    params: { id: playlistID, part: "snippet" },
  });

  return data.items[0];
}

type PlaylistItem = {
  kind: string;
  etag: string;
  id: string;
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
export async function getPlaylistItems(playlistID: string, pageToken?: string) {
  const { data } = await client.get<ApiResponse<PlaylistItem>>("/playlistItems", {
    params: {
      playlistId: playlistID,
      part: "snippet,contentDetails",
      maxResults: 50,
      pageToken,
    },
  });

  return data;
}
