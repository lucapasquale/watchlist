import { pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "../../database/base-schema";

export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),

  ...timestamps,
});

export type Playlist = typeof playlists.$inferSelect;
export type PlaylistInsert = typeof playlists.$inferInsert;
