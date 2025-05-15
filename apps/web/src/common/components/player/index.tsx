import React from "react";
import ReactPlayer from "react-player";

import { parseDuration } from "@helpers/duration.js";

import { PlaylistItem, PlaylistItemKind } from "~common/graphql-types.js";

type Video = Pick<PlaylistItem, "kind" | "title" | "thumbnailUrl" | "url" | "durationSeconds">;

type Props = {
  playing?: boolean;
  video: Video;
  onVideoEnded?: () => void;
  onVideoError?: (error: Error) => void;
};

export function Player({ video, onVideoEnded, onVideoError, playing = false }: Props) {
  const playerRef = React.useRef<ReactPlayer>(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (video.kind !== PlaylistItemKind.TwitchVideo) {
        return;
      }

      const currentTime = playerRef.current?.getCurrentTime();
      if (!currentTime) {
        return;
      }

      const vodStart = new URL(video.url).searchParams.get("t");
      if (!vodStart) {
        return;
      }

      /**
       * Twitch clips are not interactable, so we need to use the clip's video instead
       * But we now can't wait until the clip ends to navigate to the next video,
       * so check if the video reaches the end of the clip and navigate to the next video
       */
      const vodEnd = parseDuration(vodStart) + video.durationSeconds;
      if (currentTime > vodEnd) {
        onVideoEnded?.();
      }
    }, 1_000);

    return () => clearInterval(interval);
  }, [video, onVideoEnded]);

  return (
    <ReactPlayer
      ref={playerRef}
      playing={playing}
      controls
      width="100%"
      height="100%"
      url={video.url}
      onError={onVideoError}
      onEnded={onVideoEnded}
      style={{ aspectRatio: "16 / 9", width: "100%" }}
    />
  );
}
