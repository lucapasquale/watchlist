import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface PlaylistTable {
  id: Generated<number>;

  name: string;

  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string | undefined>;
}

export type Playlist = Selectable<PlaylistTable>;
export type PlaylistInsert = Insertable<PlaylistTable>;
export type PlaylistUpdate = Updateable<PlaylistTable>;
