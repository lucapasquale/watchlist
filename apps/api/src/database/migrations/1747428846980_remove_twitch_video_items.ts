/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db
    .deleteFrom<any>("playlist_item")
    .where("kind" as any, "=", "twitch_video")
    .execute();
}

export async function down(): Promise<void> {}
