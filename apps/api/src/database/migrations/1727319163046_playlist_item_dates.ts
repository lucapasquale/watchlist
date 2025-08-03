/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.deleteFrom<any>("playlist_item").execute();

  await db.schema
    .alterTable("playlist_item")
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("playlist_item").dropColumn("created_at").execute();
  await db.schema.alterTable("playlist_item").dropColumn("updated_at").execute();
}
