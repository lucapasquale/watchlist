import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";
import dayjs, { Dayjs } from "dayjs";

import { config } from "../../../config.js";
import { PlaylistData, PlaylistItemData } from "./external-clients.service.js";

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

  async playlistDataFromUrl(url: URL): Promise<PlaylistData | null> {
    const userLogin = url.pathname.split("/")[1];
    if (!userLogin) {
      return null;
    }

    const user = await this.getUser(userLogin);
    if (!user) {
      return null;
    }

    const dateRange = this.getDateOffsets(url.searchParams.get("range") as ClipRangeKey | null);
    const clips = await this.getClips(user.id, dateRange);

    const items = clips
      .map((clip) => this.clipToPlaylistItemData(clip))
      .filter((item): item is PlaylistItemData => item !== null);

    return { name: user.display_name, items };
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

  private async getUser(userLogin: string) {
    const { data } = await this.client.get<{ data: User[] }>("/users", {
      params: { login: userLogin },
    });

    return data.data[0];
  }

  private async getClip(clipID: string) {
    const { data } = await this.client.get<{ data: Clip[] }>("/clips", {
      params: { id: clipID },
    });

    return data.data[0];
  }

  private async getClips(broadcasterId: string, dateRange: [Dayjs, Dayjs]) {
    const { data } = await this.client.get<{ data: Clip[] }>("/clips", {
      params: {
        first: 25,
        broadcaster_id: broadcasterId,
        started_at: dateRange[0].format("YYYY-MM-DDTHH:mm:ssZ"),
        ended_at: dateRange[1].format("YYYY-MM-DDTHH:mm:ssZ"),
      },
    });

    return data.data;
  }

  private clipToPlaylistItemData(clip: Clip): PlaylistItemData | null {
    return {
      kind: "twitch_clip",
      title: clip.title,
      href: clip.url,
      embedUrl: clip.embed_url,
      thumbnailUrl: clip.thumbnail_url,
      durationSeconds: Math.floor(clip.duration),
    };
  }

  private getDateOffsets(rangeKey: ClipRangeKey | null) {
    const ranges: Record<ClipRangeKey, [dayjs.Dayjs, dayjs.Dayjs]> = {
      "24hr": [dayjs().subtract(1, "day"), dayjs()],
      "7d": [dayjs().subtract(7, "day"), dayjs()],
      "30d": [dayjs().subtract(30, "day"), dayjs()],
      all: [dayjs("2000-01-01"), dayjs()],
    };

    return rangeKey && rangeKey in ranges ? ranges[rangeKey] : ranges["7d"];
  }
}

type ClipRangeKey = "24hr" | "7d" | "30d" | "all";

type AuthResponse = {
  access_token: string;
  expires_in: number;
};

type User = {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: 0;
  created_at: Date;
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
