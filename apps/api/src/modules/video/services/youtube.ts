/* eslint-disable turbo/no-undeclared-env-vars */
import axios from "axios";

const client = axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    key: process.env.YOUTUBE_API_KEY,
  },
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
      default: {
        url: string;
        width: number;
        height: number;
      };
      medium: {
        url: string;
        width: number;
        height: number;
      };
      high: {
        url: string;
        width: number;
        height: number;
      };
      standard: {
        url: string;
        width: number;
        height: number;
      };
      maxres: {
        url: string;
        width: number;
        height: number;
      };
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
  const { data } = await client.get("/videos", {
    params: { id: videoID, part: "snippet" },
  });

  return data.items[0] as Video;
}
