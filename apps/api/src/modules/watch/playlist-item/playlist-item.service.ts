import { sql } from "kysely";
import crypto from "node:crypto";
import { Injectable } from "@nestjs/common";

import { db } from "../../../database/index.js";

import type {
  PlaylistItem,
  PlaylistItemInsert,
  PlaylistItemUpdate,
} from "./playlist-item.model.js";

@Injectable()
export class PlaylistItemService {
  async getByID(id: number) {
    return db
      .selectFrom("playlist_item")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirstOrThrow();
  }

  async getByIds(ids: number[]) {
    return db.selectFrom("playlist_item").where("id", "in", ids).selectAll().execute();
  }

  async countByPlaylists(playlistIds: number[]) {
    const response = await db
      .selectFrom("playlist_item")
      .where("playlistId", "in", playlistIds)
      .select("playlistId")
      .select((eb) => eb.fn.count("id").as("count"))
      .groupBy("playlistId")
      .execute();

    return playlistIds.map((playlistId) => {
      const item = response.find((item) => item.playlistId === playlistId);
      return item ? Number(item.count) : 0;
    });
  }

  async getFromPlaylist(playlistId: number, shuffleSeed?: string, limit?: number) {
    let query = db.selectFrom("playlist_item").where("playlistId", "=", playlistId).selectAll();

    if (shuffleSeed) {
      query = query.orderBy(sql`md5(id::text || ${shuffleSeed}) asc`);
    } else {
      query = query.orderBy("rank asc");
    }

    if (limit) {
      query = query.limit(limit);
    }

    return query.execute();
  }

  async getNextFromPlaylist(item: PlaylistItem, shuffleSeed?: string) {
    let query = db
      .selectFrom("playlist_item")
      .where("playlistId", "=", item.playlistId)
      .selectAll();

    if (shuffleSeed) {
      const itemHash = crypto
        .createHash("md5")
        .update(item.id.toString() + shuffleSeed)
        .digest("hex");

      query = query
        .where(sql`md5(id::text || ${shuffleSeed})`, ">", itemHash)
        .orderBy(sql`md5(id::text || ${shuffleSeed}) asc`);
    } else {
      query = query.where("rank", ">", item.rank).orderBy("rank asc");
    }

    return query.executeTakeFirst();
  }

  async getLastFromPlaylist(playlistId: number) {
    return db
      .selectFrom("playlist_item")
      .where("playlistId", "=", playlistId)
      .orderBy("rank desc")
      .selectAll()
      .executeTakeFirst();
  }

  async create(values: PlaylistItemInsert | PlaylistItemInsert[]) {
    return db.insertInto("playlist_item").values(values).returningAll().executeTakeFirstOrThrow();
  }

  async update({ id, ...input }: PlaylistItemUpdate & { id: number }) {
    return db
      .updateTable("playlist_item")
      .where("id", "=", id)
      .set(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async delete(id: number) {
    return db
      .deleteFrom("playlist_item")
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
