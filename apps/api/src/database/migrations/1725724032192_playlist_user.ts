/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.deleteFrom<any>("playlist_item").execute();
  await db.deleteFrom<any>("playlist").execute();

  await db.schema
    .alterTable("playlist")
    .addColumn("user_id", "integer", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.alterTable("playlist").dropColumn("user_id").execute();
}
