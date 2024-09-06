import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import pg from "pg";

import { config } from "../config.js";
import { CredentialTable } from "../modules/auth/credential/credential.model.js";
import { UserTable } from "../modules/auth/user/user.model.js";
import { PlaylistTable } from "../modules/watch/playlist/playlist.model.js";
import { PlaylistItemTable } from "../modules/watch/playlist-item/playlist-item.model.js";

export interface Database {
  playlist: PlaylistTable;
  playlist_item: PlaylistItemTable;
  user: UserTable;
  credential: CredentialTable;
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
  plugins: [new CamelCasePlugin()],
});
