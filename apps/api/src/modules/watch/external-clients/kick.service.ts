import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

import { config } from "../../../config.js";
import { PlaylistItemData } from "./external-clients.service.js";

@Injectable()
export class KickService {
  private client: AxiosInstance;

  private authToken: string | null = null;
  private expiresAt = Number.MIN_SAFE_INTEGER;

  constructor() {
    this.client = axios.create({ baseURL: "https://kick.com/api" });

    this.client.interceptors.request.use(async (req) => {
      if (!this.authToken || this.expiresAt < Date.now()) {
        const auth = await this.authenticateApplication();

        this.authToken = auth.access_token;
        this.expiresAt = Date.now() + auth.expires_in;
      }

      req.headers["Authorization"] = `Bearer ${this.authToken}`;
      return req;
    });
  }

  urlMatches(url: URL) {
    return url.href.match(/.*kick\.com\/.*\/clips\/.*/gi);
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
    const body = new FormData();
    body.append("grant_type", "client_credentials");
    body.append("client_id", config.kick.clientId);
    body.append("client_secret", config.kick.clientSecret);

    const { data } = await axios.post<AuthResponse>("https://id.kick.com/oauth/token", body);
    return data;
  }

  // TODO: Wait for Kick to have proper API support for clips, this current call does not work
  private async getClip(clipID: string) {
    const { data } = await this.client.get<{ clip: Clip }>(`/v2/clips/${clipID}`);
    return data?.clip ?? null;
  }

  private clipToPlaylistItemData(clip: Clip): PlaylistItemData | null {
    return {
      kind: "kick_clip",
      title: clip.title,
      href: `https://kick.com/${clip.channel.slug}/clips/${clip.id}`,
      originalPosterName: clip.channel.username,
      embedUrl: clip.clip_url,
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
  title: string;
  clip_url: string;
  thumbnail_url: string;
  duration: number;
  channel: {
    id: number;
    username: string;
    slug: string;
    profile_picture: string;
  };
};
