import { PlaylistItem, PlaylistItemInsert } from "../../playlist/models.js";
import * as Reddit from "../../services/reddit.js";
import * as Twitch from "../../services/twitch.js";
import * as Youtube from "../../services/youtube.js";

export async function parseUserURL(
  rawUrl: string,
): Promise<Omit<PlaylistItemInsert, "rank" | "playlist_id"> | null> {
  const url = new URL(rawUrl);

  switch (getUrlKind(url)) {
    case "youtube": {
      const usp = new URLSearchParams(url.search);
      const videoID = usp.get("v");
      if (!videoID) {
        return null;
      }

      const video = await Youtube.getVideo(videoID);
      if (!video) {
        return null;
      }

      return {
        kind: "youtube",
        raw_url: rawUrl,
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
        raw_url: rawUrl,
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
        raw_url: rawUrl,
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

export function getUrlKind(url: URL): PlaylistItem["kind"] | null {
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
