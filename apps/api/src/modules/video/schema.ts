import { integer, pgEnum, pgTable, serial, varchar } from "drizzle-orm/pg-core";

import { timestamps } from "../../database/base-schema";
import { playlists } from "../playlist/schema";

export const videoKindEnum = pgEnum("video_kind", ["youtube", "twitch_clip", "reddit"]);

export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  kind: videoKindEnum("kind").notNull(),
  rawUrl: varchar("raw_url", { length: 256 }).notNull(),
  url: varchar("url", { length: 256 }).notNull(),
  rank: varchar("rank", { length: 256 }).notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  thumbnail_url: varchar("thumbnail_url", { length: 256 }).notNull(),

  playlistID: integer("playlist_id")
    .references(() => playlists.id, { onDelete: "cascade" })
    .notNull(),

  ...timestamps,
});
export type Video = typeof videos.$inferSelect;
export type VideoInsert = typeof videos.$inferInsert;
