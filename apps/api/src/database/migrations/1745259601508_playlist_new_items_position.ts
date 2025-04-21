/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .alterTable("playlist")
    .addColumn("new_items_position", "varchar", (col) => col.notNull().defaultTo("bottom"))
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("playlist").dropColumn("new_items_position").execute();
}
