import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

import { config } from "../config.js";
import { PlaylistItemTable, PlaylistTable } from "../modules/playlist/models.js";

export interface Database {
  playlist: PlaylistTable;
  playlist_item: PlaylistItemTable;
}

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    host: config.database.host,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
