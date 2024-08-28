import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface PlaylistTable {
  id: Generated<number>;

  name: string;

  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string | undefined>;
}
export type Playlist = Selectable<PlaylistTable>;
export type PlaylistInsert = Insertable<PlaylistTable>;
export type PlaylistUpdate = Updateable<PlaylistTable>;

export interface PlaylistItemTable {
  id: Generated<number>;

  kind: "youtube" | "twitch_clip" | "reddit";
  raw_url: string;
  url: string;
  rank: string;
  title: string;
  thumbnail_url: string;

  created_at: ColumnType<Date, string | undefined, never>;
  updated_at: ColumnType<Date, string | undefined, string | undefined>;

  playlist_id: number;
}
export type PlaylistItem = Selectable<PlaylistItemTable>;
export type PlaylistItemInsert = Insertable<PlaylistItemTable>;
export type PlaylistItemUpdate = Updateable<PlaylistItemTable>;
