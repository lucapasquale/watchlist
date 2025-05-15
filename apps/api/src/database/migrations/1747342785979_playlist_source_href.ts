/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("playlist").addColumn("href", "varchar").execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("playlist").dropColumn("href").execute();
}
