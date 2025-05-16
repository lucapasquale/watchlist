import React from "react";
import videojs from "video.js";
import VideoJSPlayer from "video.js/dist/types/player";
import "video.js/dist/video-js.css";

import { Skeleton } from "@ui/components/ui/skeleton";

import { Props } from ".";

export function TwitchClipPlayer({ video, onVideoEnded, onVideoError }: Props) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const playerRef = React.useRef<VideoJSPlayer | null>(null);

  const [clipSrc, setClipSrc] = React.useState<string | null>(null);

  React.useEffect(() => {
    const abortController = new AbortController();

    const clipId = new URL(video.embedUrl).searchParams.get("clip");
    if (!clipId) {
      onVideoError?.(new Error("Invalid clip ID"));
      return;
    }

    getClipDownloadUrl(clipId, abortController.signal)
      .then(setClipSrc)
      .catch((err) => {
        if (abortController.signal.aborted) {
          return;
        }

        onVideoError?.(err);
      });

    return () => {
      abortController.abort();
    };
  }, [video]);

  React.useEffect(() => {
    if (!videoRef.current || !clipSrc) {
      return;
    }

    playerRef.current = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      fluid: true,
      responsive: true,
      aspectRatio: "16:9",
      bigPlayButton: false,
      preload: "auto",
      sources: [{ src: clipSrc, type: "video/mp4" }],
      techOrder: ["html5"],
    });

    const player = playerRef.current;
    if (!player) {
      return;
    }

    player.on("loadedmetadata", () => {
      if (!player.paused()) {
        return;
      }

      player.play()?.catch((err) => {
        console.warn("Play failed:", err);
      });
    });

    player.on("error", (e: any) => {
      onVideoError?.(e);
    });

    player.on("ended", () => {
      onVideoEnded?.();
    });

    return () => {
      if (!playerRef.current || playerRef.current.isDisposed()) {
        return;
      }

      try {
        playerRef.current.dispose();
      } catch (e) {
        console.warn("Error during Video.js dispose:", e);
      }
      playerRef.current = null;
    };
  }, [clipSrc, onVideoEnded, onVideoError]);

  if (!clipSrc) {
    return <Skeleton />;
  }

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-default-skin" />
    </div>
  );
}

/**
 * Fetch the direct download URL for a Twitch clip.
 * @url https://github.com/jakemiki/twitch-clip-queue/blob/main/src/common/apis/twitchApi.ts#L26
 */
async function getClipDownloadUrl(clipId: string, signal?: AbortSignal) {
  const response = await fetch("https://gql.twitch.tv/gql", {
    signal,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
    },
    body: JSON.stringify([
      {
        operationName: "ClipsDownloadButton",
        variables: { slug: clipId },
        extensions: {
          persistedQuery: {
            version: 1,
            sha256Hash: "6e465bb8446e2391644cf079851c0cb1b96928435a240f07ed4b240f0acc6f1b",
          },
        },
      },
    ]),
  });

  const [data] = await response.json();
  const playbackAccessToken = data.data.clip.playbackAccessToken;

  const url =
    data.data.clip.videoQualities[0].sourceURL +
    "?sig=" +
    playbackAccessToken.signature +
    "&token=" +
    encodeURIComponent(playbackAccessToken.value);

  return url;
}
