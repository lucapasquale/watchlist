import type { Video } from "../schema.js";
import * as Reddit from "../services/reddit.js";
import * as Twitch from "../services/twitch.js";
import * as Youtube from "../services/youtube.js";

export async function parseUserURL(
  rawUrl: string,
): Promise<Pick<Video, "kind" | "rawUrl" | "url" | "title" | "thumbnail_url"> | null> {
  const url = new URL(rawUrl);

  switch (getUrlKind(url)) {
    case "youtube": {
      const usp = new URLSearchParams(url.search);
      const videoID = usp.get("v");
      if (!videoID) {
        return null;
      }

      const video = await Youtube.getVideo(videoID);

      return {
        kind: "youtube",
        rawUrl,
        url: `https://www.youtube.com/embed/${videoID}`,
        title: video.snippet.title,
        thumbnail_url: video.snippet.thumbnails.medium.url,
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
        title: clip.title,
        thumbnail_url: clip.thumbnail_url,
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
        url: post.media.reddit_video.hls_url.split("?")[0]!,
        title: post.title,
        thumbnail_url: post.thumbnail,
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
