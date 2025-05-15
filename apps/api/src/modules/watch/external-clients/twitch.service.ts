import { Injectable } from "@nestjs/common";
import { timeToDuration } from "@workspace/helpers/duration";
import axios, { AxiosInstance } from "axios";

import { config } from "../../../config.js";
import { PlaylistItemData } from "./external-clients.service.js";

@Injectable()
export class TwitchService {
  private client: AxiosInstance;

  private authToken: string | null = null;
  private expiresAt = Number.MIN_SAFE_INTEGER;

  constructor() {
    this.client = axios.create({ baseURL: "https://api.twitch.tv/helix" });

    this.client.interceptors.request.use(async (req) => {
      if (!this.authToken || this.expiresAt < Date.now()) {
        const auth = await this.authenticateApplication();

        this.authToken = auth.access_token;
        this.expiresAt = Date.now() + auth.expires_in;
      }

      req.headers["Client-Id"] = config.twitch.clientId;
      req.headers["Authorization"] = `Bearer ${this.authToken}`;
      return req;
    });
  }

  urlMatches(url: URL) {
    return url.href.match(/.*twitch\.tv.*/gi);
  }

  async playlistItemDataFromUrl(url: URL): Promise<PlaylistItemData | null> {
    const clipID = url.pathname.split("/").pop();
    if (!clipID) {
      return null;
    }

    const clip = await this.getClip(clipID);
    if (!clip) {
      return null;
    }

    return this.clipToPlaylistItemData(clip);
  }

  private async authenticateApplication() {
    const { data } = await axios.post<AuthResponse>("https://id.twitch.tv/oauth2/token", null, {
      params: {
        grant_type: "client_credentials",
        client_id: config.twitch.clientId,
        client_secret: config.twitch.clientSecret,
      },
    });

    return data;
  }

  private async getClip(clipID: string) {
    const { data } = await this.client.get<{ data: Clip[] }>("/clips", {
      params: { id: clipID },
    });

    return data.data[0];
  }

  private clipToPlaylistItemData(clip: Clip): PlaylistItemData | null {
    if (!clip.video_id) {
      return null;
    }

    const videoUrl = new URL("https://www.twitch.tv/videos/" + clip.video_id);

    // Twitch offset is in the future for whatever reason, start 5 seconds earlier
    const vodOffset = Math.max(clip.vod_offset - 5, 0);
    videoUrl.searchParams.set("t", timeToDuration(vodOffset).toLowerCase());

    return {
      kind: "twitch_video",
      title: clip.title,
      href: clip.url,
      embedUrl: videoUrl.toString(),
      thumbnailUrl: clip.thumbnail_url,
      durationSeconds: Math.floor(clip.duration),
    };
  }
}

type AuthResponse = {
  access_token: string;
  expires_in: number;
};

type Clip = {
  id: string;
  url: string;
  embed_url: string;
  broadcaster_id: string;
  broadcaster_name: string;
  creator_id: string;
  creator_name: string;
  video_id: string;
  game_id: string;
  language: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
  duration: number;
  vod_offset: number;
  is_featured: false;
};
