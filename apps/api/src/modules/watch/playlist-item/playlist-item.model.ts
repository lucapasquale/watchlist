import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface PlaylistItemTable {
  id: Generated<number>;

  kind: "youtube" | "reddit";
  rawUrl: string;
  url: string;
  rank: string;
  title: string;
  thumbnailUrl: string;
  durationSeconds: number;

  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string | undefined>;

  playlistId: number;
}

export type PlaylistItem = Selectable<PlaylistItemTable>;
export type PlaylistItemInsert = Insertable<PlaylistItemTable>;
export type PlaylistItemUpdate = Updateable<PlaylistItemTable>;
