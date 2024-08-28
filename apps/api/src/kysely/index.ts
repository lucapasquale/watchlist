import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

import { PlaylistItemTable, PlaylistTable } from "../modules/playlist/models.js";

export interface Database {
  playlist: PlaylistTable;
  playlist_item: PlaylistItemTable;
}

const dialect = new PostgresDialect({
  // TODO: use env vars
  pool: new pg.Pool({
    host: "localhost",
    database: "video_list_dev",
    user: "postgres",
    password: "postgres",
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
