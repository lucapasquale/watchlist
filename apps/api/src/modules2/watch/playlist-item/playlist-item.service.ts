import { sql } from "kysely";
import { Injectable } from "@nestjs/common";

import { db } from "../../../database/index.js";
import type {
  PlaylistItem,
  PlaylistItemInsert,
  PlaylistItemUpdate,
} from "../../../modules/playlist/models.js";

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

  async getNextFromPlaylist(item: PlaylistItem) {
    return await db
      .selectFrom("playlist_item")
      .where("playlistId", "=", item.playlistId)
      .where("rank", ">", item.rank)
      .orderBy("rank asc")
      .selectAll()
      .executeTakeFirst();
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

  async create(input: PlaylistItemInsert) {
    return db.insertInto("playlist_item").values(input).returningAll().executeTakeFirstOrThrow();
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
    return db.deleteFrom("playlist_item").where("id", "=", id).execute();
  }
}
