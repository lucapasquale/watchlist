/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("playlist_item").renameColumn("raw_url", "href").execute();
  await db.schema.alterTable("playlist_item").renameColumn("url", "embed_url").execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("playlist_item").renameColumn("href", "raw_url").execute();
  await db.schema.alterTable("playlist_item").renameColumn("embed_url", "url").execute();
}
