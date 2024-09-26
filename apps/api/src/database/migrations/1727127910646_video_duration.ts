import { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("playlist_item").addColumn("duration_seconds", "integer").execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("playlist").dropColumn("duration_seconds").execute();
}
