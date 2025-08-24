import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface PlaylistItemTable {
  id: Generated<number>;

  kind: "youtube" | "reddit" | "twitch_clip" | "kick_clip" | "x" | "tiktok";
  href: string;
  embedUrl: string;
  rank: string;
  title: string;
  thumbnailUrl: string;
  durationSeconds: number;
  originalPosterName: string;

  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string | undefined>;

  playlistId: number;
}

export type PlaylistItem = Selectable<PlaylistItemTable>;
export type PlaylistItemInsert = Insertable<PlaylistItemTable>;
export type PlaylistItemUpdate = Updateable<PlaylistItemTable>;
