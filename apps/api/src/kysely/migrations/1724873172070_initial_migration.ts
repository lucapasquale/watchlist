import { Kysely, sql } from "kysely";

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable("playlist")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema
    .createTable("playlist_item")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("kind", "varchar", (col) => col.notNull())
    .addColumn("raw_url", "varchar", (col) => col.notNull())
    .addColumn("url", "varchar", (col) => col.notNull())
    .addColumn("rank", "varchar", (col) => col.notNull())
    .addColumn("title", "varchar", (col) => col.notNull())
    .addColumn("thumbnail_url", "varchar", (col) => col.notNull())
    .addColumn("playlist_id", "integer", (col) =>
      col.references("playlist.id").onDelete("cascade").notNull(),
    )
    .execute();

  await db.schema
    .createIndex("playlist_item_playlist_id_index")
    .on("playlist_item")
    .column("playlist_id")
    .execute();

  await db.schema
    .createIndex("playlist_item_rank_index")
    .on("playlist_item")
    .column("rank")
    .execute();
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable("playlist_item").execute();
  await db.schema.dropTable("playlist").execute();
}
