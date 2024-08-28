import { FileMigrationProvider, Kysely, Migrator, PostgresDialect } from "kysely";
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

import { type Database } from "./index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateToLatest() {
  const db = new Kysely<Database>({
    // TODO: use env vars
    dialect: new PostgresDialect({
      pool: new pg.Pool({
        host: "localhost",
        database: "video_list_dev",
        user: "postgres",
        password: "postgres",
      }),
    }),
  });

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, "./migrations"),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
