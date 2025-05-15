import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

import { PlaylistData, PlaylistItemData } from "./external-clients.service.js";
import { TwitchService } from "./twitch.service.js";
import { YoutubeService } from "./youtube.service.js";

@Injectable()
export class RedditService {
  private client: AxiosInstance;

  constructor(
    private youtubeService: YoutubeService,
    private twitchService: TwitchService,
  ) {
    this.client = axios.create();
  }

  urlMatches(url: URL) {
    return url.href.match(/.*reddit\.com.*/gi) || url.href.match(/.*v\.redd\.it.*/gi);
  }

  async playlistDataFromUrl(url: URL): Promise<PlaylistData | null> {
    const postUrl = await this.getRootUrl(url.toString());
    if (!postUrl) {
      return null;
    }

    const posts = await this.getListingData(postUrl);
    const items = await Promise.all(posts.map((p) => this.postToPlaylistItemData(p)));

    const validItems = items.filter((item) => item !== null);
    if (!validItems.length) {
      return null;
    }

    return {
      name: posts[0]!.subreddit_name_prefixed,
      items: validItems,
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

  private async postToPlaylistItemData(post: Post): Promise<PlaylistItemData | null> {
    const rawUrl = new URL("https://reddit.com");
    rawUrl.pathname = post.permalink;

    if (post.media && "reddit_video" in post.media) {
      return {
        kind: "reddit",
        title: post.title,
        url: post.media.reddit_video.hls_url.split("?")[0]!,
        rawUrl: rawUrl.toString(),
        thumbnailUrl: post.thumbnail.replaceAll("&amp;", "&"),
        durationSeconds: post.media.reddit_video.duration,
      };
    }

    if (this.youtubeService.urlMatches(new URL(post.url))) {
      const youtubeItem = await this.youtubeService.playlistItemDataFromUrl(new URL(post.url));
      if (!youtubeItem) {
        return null;
      }

      return {
        ...youtubeItem,
        title: post.title,
        rawUrl: rawUrl.toString(),
      };
    }

    if (this.twitchService.urlMatches(new URL(post.url))) {
      const twitchItem = await this.twitchService.playlistItemDataFromUrl(new URL(post.url));
      if (!twitchItem) {
        return null;
      }

      return {
        ...twitchItem,
        title: post.title,
        rawUrl: rawUrl.toString(),
      };
    }

    return null;
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
  media: { reddit_video: { duration: number; hls_url: string } } | null;
};
