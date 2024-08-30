import { sql } from "kysely";
import { Injectable } from "@nestjs/common";

import { db } from "../../database/index.js";

@Injectable()
export class PlaylistItemService {
  async getByID(id: number) {
    return db
      .selectFrom("playlist_item")
      .where("id", "=", id)
      .selectAll()
      .executeTakeFirstOrThrow();
  }

  async getForPlaylist(playlistID: number, shuffleSeed?: string, limit?: number) {
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

  async countForPlaylist(playlistID: number) {
    const response = await db
      .selectFrom("playlist_item")
      .where("playlistId", "=", playlistID)
      .select((eb) => eb.fn.count("id").as("itemsCount"))
      .executeTakeFirstOrThrow();

    return Number(response.itemsCount);
  }
}
