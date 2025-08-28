import { Injectable } from "@nestjs/common";
import axios, { AxiosInstance } from "axios";

import { PlaylistItemData } from "./external-clients.service.js";

type Oembed = {
  version: string;
  type: string;
  title: string;
  provider_url: string;
  provider_name: string;
  author_url: string;
  author_name: string;
  author_unique_id: string;
  thumbnail_width: number;
  thumbnail_height: number;
  thumbnail_url: string;
  embed_product_id: string;
  embed_type: string;
  width: string;
  height: string;
  html: string;
};

@Injectable()
export class TiktokService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({ baseURL: "https://tiktok.com" });
  }

  urlMatches(url: URL) {
    return url.host.match(/.*tiktok\.com.*/gi);
  }

  async playlistItemDataFromUrl(url: URL): Promise<PlaylistItemData | null> {
    const { data } = await this.client.get<Oembed>("/oembed", {
      params: { url: url.toString() },
    });

    if (!data) {
      return null;
    }

    const embedUrl = new URL("https://www.tiktok.com/player/v1/" + data.embed_product_id);
    embedUrl.searchParams.set("autoplay", "1");

    return {
      kind: "tiktok",
      title: data.title,
      href: url.toString(),
      originalPosterName: data.author_name,
      embedUrl: embedUrl.toString(),
      thumbnailUrl: data.thumbnail_url,
      durationSeconds: null,
    };
  }
}
