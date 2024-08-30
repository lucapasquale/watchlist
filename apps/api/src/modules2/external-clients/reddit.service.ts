import axios, { AxiosInstance } from "axios";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RedditService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create();
  }

  async getPost(postURL: string) {
    const { data } = await this.client.get<ApiResponse<Post>>(postURL + ".json");

    return data?.[0]?.data?.children?.[0]?.data ?? null;
  }
}

type ApiResponse<T> = [
  {
    kind: string;
    data: {
      after: string | null;
      dist: number;
      modhash: string;
      geo_filter: string;
      children: Array<{
        kind: string;
        data: T;
      }>;
      before: string | null;
    };
  },
];

type Post = {
  title: string;
  thumbnail: string;
  media: {
    reddit_video: {
      fallback_url: string;
      height: string;
      width: string;
      scrubber_media_url: string;
      dash_url: string;
      duration: string;
      hls_url: string;
      is_gif: string;
      transcoding_status: string;
    };
  };
};
