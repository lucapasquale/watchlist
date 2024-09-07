import { PlaylistItemKind } from "~graphql/types";

export const PLAYLIST_ITEM_KIND: Record<PlaylistItemKind, string> = {
  [PlaylistItemKind.Youtube]: "YouTube",
  [PlaylistItemKind.TwitchClip]: "Twitch",
  [PlaylistItemKind.Reddit]: "Reddit",
};
