import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("user")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("email", "varchar", (col) => col.notNull())
    .addColumn("name", "varchar", (col) => col.notNull())
    .addColumn("profile_picture_url", "varchar")
    .addColumn("created_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn("updated_at", "timestamp", (col) => col.defaultTo(sql`now()`).notNull())
    .execute();

  await db.schema
    .createTable("credential")
    .addColumn("provider", "varchar", (col) => col.notNull())
    .addColumn("subject", "varchar", (col) => col.notNull())
    .addColumn("user_id", "integer", (col) =>
      col.references("user.id").onDelete("cascade").notNull(),
    )
    .addPrimaryKeyConstraint("credential_pk", ["provider", "subject"])
    .execute();

  await db.schema
    .createIndex("credential_user_id_index")
    .on("credential")
    .column("user_id")
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable("credential").execute();
  await db.schema.dropTable("user").execute();
}
