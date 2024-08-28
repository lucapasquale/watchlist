/* eslint-disable turbo/no-undeclared-env-vars */
import { Kysely, PostgresDialect } from "kysely";
import pg from "pg";

import { PlaylistItemTable, PlaylistTable } from "../modules/playlist/models.js";

export interface Database {
  playlist: PlaylistTable;
  playlist_item: PlaylistItemTable;
}

const dialect = new PostgresDialect({
  pool: new pg.Pool({
    host: process.env.PG_HOST!,
    database: process.env.PG_DATABASE!,
    user: process.env.PG_USER!,
    password: process.env.PG_PASSWORD!,
    max: 10,
  }),
});

export const db = new Kysely<Database>({
  dialect,
});
