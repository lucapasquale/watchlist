import axios, { AxiosInstance } from "axios";
import { Injectable } from "@nestjs/common";

import { config } from "../../../config.js";

@Injectable()
export class TwitchService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.twitch.tv/helix",
      headers: { "Client-ID": config.twitch.clientID },
    });

    this.client.interceptors.request.use(async (req) => {
      const { data: authData } = await axios.post("https://id.twitch.tv/oauth2/token", null, {
        params: {
          grant_type: "client_credentials",
          client_id: config.twitch.clientID,
          client_secret: config.twitch.clientSecret,
        },
      });

      req.headers.Authorization = `Bearer ${authData.access_token}`;
      return req;
    });
  }

  urlMatches(url: URL) {
    return url.href.match(/twitch.tv\/.+\/clip/gi);
  }

  async playlistItemDataFromUrl(url: URL) {
    const clipID = url.pathname.split("/").pop();
    if (!clipID) {
      return null;
    }

    const clip = await this.getClip(clipID);

    const usp = new URLSearchParams();
    usp.append("clip", clip.id);
    usp.append("parent", "localhost");
    usp.append("parent", "watchlist.luca.codes");
    usp.append("autoplay", "true");
    usp.append("muted", "false");

    const embedUrl = new URL("/embed", "https://clips.twitch.tv");
    embedUrl.search = usp.toString();

    return {
      kind: "twitch_clip" as const,
      rawUrl: url.toString(),
      url: embedUrl.toString(),
      title: clip.title,
      thumbnailUrl: clip.thumbnail_url,
      durationSeconds: Math.floor(clip.duration),
    };
  }

  async getClip(clipID: string) {
    const { data } = await this.client.get<ApiResponse<Clip>>("/clips", {
      params: { id: clipID },
    });

    return data.data[0] as Clip;
  }
}

type ApiResponse<T> = {
  data: T[];
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
  created_at: Date;
  thumbnail_url: string;
  duration: number;
  vod_offset: number;
  is_featured: boolean;
};
