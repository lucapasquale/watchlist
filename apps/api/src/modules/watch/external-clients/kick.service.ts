import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

import { PlaylistItemData } from "./external-clients.service.js";

@Injectable()
export class KickService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({ baseURL: "https://kick.com/api" });
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

  private async getClip(clipID: string) {
    const { data } = await this.client.get<{ clip: Clip }>(`/v2/clips/${clipID}`, {
      headers: {
        "User-Agent": "PostmanRuntime/7.45.0",
      },
    });

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
