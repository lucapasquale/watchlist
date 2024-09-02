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

  async getFromPlaylist(playlistID: number, shuffleSeed?: string, limit?: number) {
    let query = db.selectFrom("playlist_item").where("playlistId", "=", playlistID).selectAll();

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

  async getLastFromPlaylist(playlistID: number) {
    return db
      .selectFrom("playlist_item")
      .where("playlistId", "=", playlistID)
      .orderBy("rank desc")
      .selectAll()
      .executeTakeFirst();
  }

  async countFromPlaylist(playlistID: number) {
    const response = await db
      .selectFrom("playlist_item")
      .where("playlistId", "=", playlistID)
      .select((eb) => eb.fn.count("id").as("itemsCount"))
      .executeTakeFirstOrThrow();

    return Number(response.itemsCount);
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
