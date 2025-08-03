/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.deleteFrom<any>("playlist_item").execute();
  await db.deleteFrom<any>("playlist").execute();

  await db.schema
    .alterTable("playlist_item")
    .addColumn("original_poster_name", "varchar", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("playlist_item").dropColumn("original_poster_name").execute();
}
