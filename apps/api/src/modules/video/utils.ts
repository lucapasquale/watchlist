import { Video } from "../../database/schema";

import * as Reddit from "./services/reddit";
import * as Twitch from "./services/twitch";

export async function parseUserURL(
  rawUrl: string,
): Promise<Pick<Video, "kind" | "rawUrl" | "url"> | null> {
  const url = new URL(rawUrl);

  switch (getUrlKind(url)) {
    case "youtube": {
      const usp = new URLSearchParams(url.search);
      const v = usp.get("v");
      if (!v) {
        return null;
      }

      return {
        kind: "youtube",
        rawUrl,
        url: `https://www.youtube.com/embed/${v}`,
      };
    }

    case "twitch_clip": {
      const clipID = url.pathname.split("/").pop();
      if (!clipID) {
        return null;
      }

      const clip = await Twitch.getClip(clipID);

      return {
        kind: "twitch_clip",
        rawUrl,
        url: clip.thumbnail_url.replace(/-preview-.+x.+\..*/gi, ".mp4"),
      };
    }

    case "reddit": {
      const post = await Reddit.getPost(rawUrl);
      if (!post) {
        return null;
      }

      return {
        kind: "reddit",
        rawUrl,
        url: post.media.reddit_video.hls_url.split("?")[0],
      };
    }

    default: {
      return null;
    }
  }
}

export function getUrlKind(url: URL): Video["kind"] | null {
  if (url.href.match(/.*reddit\.com.*/gi)) {
    return "reddit";
  }

  if (url.href.match(/twitch.tv\/.+\/clip/gi)) {
    return "twitch_clip";
  }

  if (url.href.match(/youtube.com\/watch/gi)) {
    return "youtube";
  }

  return null;
}
