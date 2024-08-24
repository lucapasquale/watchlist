// https://old.reddit.com/r/TikTokCringe/comments/1ezcmnq/yamaha_coming_up_with_their_products/

import axios from "axios";

import { Video } from "../database/schema";

export async function getRedditVideo(
  rawUrl: string,
): Promise<Pick<Video, "kind" | "rawUrl" | "url"> | null> {
  const { data } = await axios.get(rawUrl + ".json");

  const postData = data?.[0]?.data?.children?.[0]?.data;
  if (!postData) {
    return null;
  }

  return {
    kind: "reddit" as const,
    rawUrl,
    url: postData.media.reddit_video.hls_url.split("?")[0],
  };
}
