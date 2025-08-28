/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("playlist_item")
    .alterColumn("duration_seconds", (col) => col.dropNotNull())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("playlist_item")
    .alterColumn("duration_seconds", (col) => col.setNotNull())
    .execute();
}
