import React from "react";
import ReactPlayer from "react-player";

import { PlaylistItem } from "~common/graphql-types.js";

type Video = Pick<PlaylistItem, "kind" | "title" | "thumbnailUrl" | "embedUrl" | "durationSeconds">;

export type Props = {
  playing?: boolean;
  video: Video;
  onVideoEnded?: () => void;
  onVideoError?: (error: MediaError | null) => void;
};

export function Player({ video, onVideoEnded, onVideoError, playing = false }: Props) {
  const playerRef = React.useRef<HTMLVideoElement>(null);

  return (
    <ReactPlayer
      ref={playerRef}
      playing={playing}
      controls
      width="100%"
      height="100%"
      src={video.embedUrl}
      onError={(e) => onVideoError?.(e.currentTarget.error)}
      onEnded={onVideoEnded}
      style={{ aspectRatio: "16 / 9", width: "100%" }}
    />
  );
}
