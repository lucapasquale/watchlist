import { integer, pgEnum, pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),

  ...timestamps,
});
export type Playlist = typeof playlists.$inferSelect;
export type PlaylistInsert = typeof playlists.$inferInsert;

export const videoKindEnum = pgEnum("video_kind", ["youtube", "twtich_clip"]);

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  url: varchar("url", { length: 256 }).notNull(),
  kind: videoKindEnum("kind").notNull(),
  sortOrder: integer("sort_order").notNull(),

  playlistID: integer("playlist_id")
    .references(() => playlists.id, { onDelete: "cascade" })
    .notNull(),

  ...timestamps,
});
export type Video = typeof videos.$inferSelect;
export type VideoInsert = typeof videos.$inferInsert;
