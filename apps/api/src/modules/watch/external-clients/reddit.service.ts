import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

import { PlaylistData, PlaylistItemData } from "./external-clients.service.js";

@Injectable()
export class RedditService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create();
  }

  urlMatches(url: URL) {
    return url.href.match(/.*reddit\.com.*/gi) || url.href.match(/.*v\.redd\.it.*/gi);
  }

  async playlistDataFromUrl(url: URL): Promise<PlaylistData | null> {
    console.log(url.toString());
    const postUrl = await this.getRootUrl(url.toString());
    if (!postUrl) {
      return null;
    }

    const posts = await this.getListingData(postUrl);
    console.log(posts[1]);

    const items = posts.map(this.postToPlaylistItemData).filter((post) => post !== null);
    if (!items.length) {
      return null;
    }

    return {
      name: posts[0]!.subreddit_name_prefixed,
      items,
    };
  }

  async playlistItemDataFromUrl(url: URL): Promise<PlaylistItemData | null> {
    const postUrl = await this.getRootUrl(url.toString());
    if (!postUrl) {
      return null;
    }

    const post = await this.getPostData(postUrl);
    if (!post) {
      return null;
    }

    return this.postToPlaylistItemData(post);
  }

  private async getRootUrl(rawUrl: string) {
    if (rawUrl.includes("/r/")) {
      return new URL(rawUrl);
    }

    let postUrl = null;

    await axios.get(rawUrl, {
      beforeRedirect: (config) => {
        if (config.host === "www.reddit.com") {
          postUrl = config.href;
        }
      },
    });

    if (!postUrl) {
      return null;
    }

    return new URL(postUrl);
  }

  private async getPostData(url: URL) {
    url.pathname = url.pathname.replace(".json", "") + ".json";

    const { data } = await this.client.get<Array<ApiResponse<Post>>>(url.toString());
    return data[0]?.data.children[0]?.data ?? null;
  }

  private async getListingData(url: URL) {
    url.pathname = url.pathname.replace(".json", "") + ".json";

    const { data } = await this.client.get<ApiResponse<Post>>(url.toString());
    return data.data.children.map((child) => child.data);
  }

  private postToPlaylistItemData(post: Post): PlaylistItemData | null {
    if (!post.media) {
      return null;
    }

    const rawUrl = new URL("https://reddit.com");
    rawUrl.pathname = post.permalink;

    if ("type" in post.media) {
      return {
        kind: "reddit",
        title: post.title,
        url: post.url,
        rawUrl: rawUrl.toString(),
        thumbnailUrl: post.thumbnail.replaceAll("&amp;", "&"),
        durationSeconds: -1,
      };
    }

    return {
      kind: "reddit",
      title: post.title,
      url: post.media.reddit_video.hls_url.split("?")[0]!,
      rawUrl: rawUrl.toString(),
      thumbnailUrl: post.thumbnail.replaceAll("&amp;", "&"),
      durationSeconds: post.media.reddit_video.duration,
    };
  }
}

type ApiResponse<T> = {
  data: {
    children: Array<{
      kind: string;
      data: T;
    }>;
  };
};

type Post = {
  title: string;
  thumbnail: string;
  permalink: string;
  subreddit_name_prefixed: string;
  url: string;
  media:
    | {
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
      }
    | { type: "youtube.com" }
    | null;
};
