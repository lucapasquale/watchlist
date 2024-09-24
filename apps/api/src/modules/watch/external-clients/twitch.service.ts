import axios, { AxiosInstance } from "axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TwitchService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: "https://api.twitch.tv/helix",
      headers: { "Client-ID": process.env.TWITCH_CLIENT_ID },
    });

    this.client.interceptors.request.use(async (req) => {
      const { data: authData } = await axios.post("https://id.twitch.tv/oauth2/token", null, {
        params: {
          grant_type: "client_credentials",
          client_id: process.env.TWITCH_CLIENT_ID,
          client_secret: process.env.TWITCH_CLIENT_SECRET,
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

    return {
      kind: "twitch_clip" as const,
      rawUrl: url.toString(),
      url: clip.thumbnail_url.replace(/-preview-.+x.+\..*/gi, ".mp4"),
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
