import React from "react";

import { Props } from ".";

export function TwitchClipPlayer({ video, onVideoEnded, onVideoError }: Props) {
  const videoRef = React.useRef<HTMLVideoElement>(null);

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
  }, [video, onVideoError]);

  React.useEffect(() => {
    const videoCurrent = videoRef.current;
    if (!videoCurrent) {
      return;
    }

    videoCurrent.addEventListener("ended", () => {
      onVideoEnded?.();
    });
    videoCurrent.addEventListener("error", (e: any) => {
      onVideoError?.(e);
    });

    return () => {
      videoCurrent?.removeEventListener("ended", () => {
        onVideoEnded?.();
      });
      videoCurrent?.removeEventListener("error", (e: any) => {
        onVideoError?.(e);
      });
    };
  }, [onVideoEnded, onVideoError]);

  return (
    <video autoPlay controls ref={videoRef} width="100%" height="100%" className="min-h-[210px]">
      {clipSrc && <source src={clipSrc} type="video/mp4" />}
    </video>
  );
}

/**
 * Gets the download URL for a Twitch clip
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
