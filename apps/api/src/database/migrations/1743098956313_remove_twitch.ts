/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db
    .deleteFrom<any>("playlist_item")
    .where("kind" as any, "=", "twitch_clip")
    .execute();
}

export async function down(): Promise<void> {}
