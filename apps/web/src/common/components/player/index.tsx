import React from "react";
import ReactPlayer from "react-player";

import { PlaylistItem, PlaylistItemKind } from "~common/graphql-types.js";

import { TwitchClipPlayer } from "./twitch-clip-player";

type Video = Pick<PlaylistItem, "kind" | "title" | "thumbnailUrl" | "embedUrl" | "durationSeconds">;

export type Props = {
  playing?: boolean;
  video: Video;
  onVideoEnded?: () => void;
  onVideoError?: (error: Error) => void;
};

export function Player({ video, onVideoEnded, onVideoError, playing = false }: Props) {
  const playerRef = React.useRef<ReactPlayer>(null);

  if (video.kind === PlaylistItemKind.TwitchClip) {
    return (
      <TwitchClipPlayer video={video} onVideoEnded={onVideoEnded} onVideoError={onVideoError} />
    );
  }

  return (
    <ReactPlayer
      ref={playerRef}
      playing={playing}
      controls
      width="100%"
      height="100%"
      url={video.embedUrl}
      onError={onVideoError}
      onEnded={onVideoEnded}
      style={{ aspectRatio: "16 / 9", width: "100%" }}
    />
  );
}
