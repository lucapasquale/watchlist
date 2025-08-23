import { PlaylistItemKind } from "~common/graphql-types.js";

export const PLAYLIST_ITEM_KIND: Record<PlaylistItemKind, string> = {
  [PlaylistItemKind.Youtube]: "YouTube",
  [PlaylistItemKind.Reddit]: "Reddit",
  [PlaylistItemKind.TwitchClip]: "Twitch",
  [PlaylistItemKind.KickClip]: "Kick",
  [PlaylistItemKind.X]: "X",
};
