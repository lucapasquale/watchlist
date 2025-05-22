import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

import { config } from "../../../config.js";
import { PlaylistData, PlaylistItemData } from "./external-clients.service.js";
import { TwitchService } from "./twitch.service.js";
import { YoutubeService } from "./youtube.service.js";

@Injectable()
export class RedditService {
  private client: AxiosInstance;

  private authToken: string | null = null;
  private expiresAt = Number.MIN_SAFE_INTEGER;

  constructor(
    private youtubeService: YoutubeService,
    private twitchService: TwitchService,
  ) {
    this.client = axios.create({ baseURL: "https://oauth.reddit.com" });

    this.client.interceptors.request.use(async (req) => {
      if (!this.authToken || this.expiresAt < Date.now()) {
        const auth = await this.authenticateApplication();

        this.authToken = auth.access_token;
        this.expiresAt = Date.now() + auth.expires_in * 1000;
      }

      req.headers["Client-Id"] = config.reddit.clientId;
      req.headers["Authorization"] = `Bearer ${this.authToken}`;
      return req;
    });
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
    const items = (await Promise.all(posts.map((p) => this.postToPlaylistItemData(p)))).filter(
      (item): item is PlaylistItemData => item !== null,
    );

    return { name: posts[0]!.subreddit_name_prefixed, items };
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

  private async authenticateApplication() {
    const body = new FormData();
    body.append("grant_type", "client_credentials");

    const { data } = await axios.post<AuthResponse>(
      "https://www.reddit.com/api/v1/access_token",
      body,
      { auth: { username: config.reddit.clientId, password: config.reddit.clientSecret } },
    );

    return data;
  }

  private async getRootUrl(href: string) {
    if (href.includes("/r/")) {
      return new URL(href);
    }

    let postUrl = null;

    await axios.get(href, {
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

    const { data } = await this.client.get<Array<ApiResponse<Post>>>(url.pathname + url.search);
    return data[0]?.data.children[0]?.data ?? null;
  }

  private async getListingData(url: URL) {
    url.pathname = url.pathname.replace(".json", "") + ".json";

    const { data } = await this.client.get<ApiResponse<Post>>(url.pathname + url.search);
    return data.data.children.map((child) => child.data);
  }

  private async postToPlaylistItemData(post: Post): Promise<PlaylistItemData | null> {
    const href = new URL("https://reddit.com");
    href.pathname = post.permalink;

    if (post.media && "reddit_video" in post.media) {
      return {
        kind: "reddit",
        title: post.title,
        embedUrl: post.media.reddit_video.hls_url.split("?")[0]!,
        href: href.toString(),
        thumbnailUrl: post.thumbnail.replaceAll("&amp;", "&"),
        durationSeconds: post.media.reddit_video.duration,
      };
    }

    if (this.youtubeService.urlMatches(new URL(post.url))) {
      return this.youtubeService.playlistItemDataFromUrl(new URL(post.url));
    }

    if (this.twitchService.urlMatches(new URL(post.url))) {
      return this.twitchService.playlistItemDataFromUrl(new URL(post.url));
    }

    return null;
  }
}

type AuthResponse = {
  access_token: string;
  expires_in: number;
};

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
