import { cn } from "@ui/lib/utils";

import { PlaylistItemKind } from "~common/graphql-types";

import { Kick, Reddit, Twitch, X, Youtube } from "./icons";

type Props = {
  kind: PlaylistItemKind;
  className?: string;
};

/**
 * @url https://simpleicons.org
 */
export function PlaylistItemKindIcon({ kind, className }: Props) {
  switch (kind) {
    case PlaylistItemKind.Youtube:
      return <Youtube className={cn("size-4", className)} />;

    case PlaylistItemKind.Reddit:
      return <Reddit className={cn("size-4", className)} />;

    case PlaylistItemKind.TwitchClip:
      return <Twitch className={cn("size-4", className)} />;

    case PlaylistItemKind.KickClip:
      return <Kick className={cn("size-4", className)} />;

    case PlaylistItemKind.X:
      return <X className={cn("size-4", className)} />;

    default:
      return null;
  }
}
