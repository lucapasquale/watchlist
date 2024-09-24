import axios, { AxiosInstance } from "axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RedditService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create();
  }

  urlMatches(url: URL) {
    return url.href.match(/.*reddit\.com.*/gi) || url.href.match(/.*v\.redd\.it.*/gi);
  }

  async playlistItemDataFromUrl(url: URL) {
    const postUrl = await this.getPostUrl(url.toString());
    if (!postUrl) {
      return null;
    }

    const post = await this.getPost(postUrl);
    if (!post) {
      return null;
    }

    return {
      kind: "reddit" as const,
      rawUrl: url.toString(),
      url: post.media.reddit_video.hls_url.split("?")[0]!,
      title: post.title,
      thumbnailUrl: post.thumbnail,
      durationSeconds: post.media.reddit_video.duration,
    };
  }

  private async getPostUrl(rawUrl: string) {
    if (rawUrl.includes("/r/")) {
      return rawUrl;
    }

    let postUrl = null;

    await axios.get(rawUrl, {
      beforeRedirect: (config) => {
        console.log(config.host);
        if (config.host === "www.reddit.com") {
          postUrl = config.href;
        }
      },
    });

    if (!postUrl) {
      return null;
    }

    const url = new URL(postUrl);
    url.search = "";

    return url.toString();
  }

  async getPost(url: string) {
    const { data } = await this.client.get<ApiResponse<Post>>(url + ".json");
    return data?.[0]?.data?.children?.[0]?.data ?? null;
  }
}

type ApiResponse<T> = [
  {
    kind: string;
    data: {
      after: string | null;
      dist: number;
      modhash: string;
      geo_filter: string;
      children: Array<{
        kind: string;
        data: T;
      }>;
      before: string | null;
    };
  },
];

type Post = {
  title: string;
  thumbnail: string;
  media: {
    reddit_video: {
      bitrate_kbps: number;
      fallback_url: string;
      has_audio: boolean;
      height: number;
      width: number;
      scrubber_media_url: string;
      dash_url: string;
      duration: number;
      hls_url: string;
      is_gif: string;
      transcoding_status: string;
    };
  };
};
