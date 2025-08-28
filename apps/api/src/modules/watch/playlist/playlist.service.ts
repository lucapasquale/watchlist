import { Injectable } from "@nestjs/common";
import DataLoader from "dataloader";

import { db } from "../../../database/index.js";
import type { Playlist, PlaylistInsert, PlaylistUpdate } from "./playlist.model.js";

@Injectable()
export class PlaylistService {
  loader: DataLoader<number, Playlist>;

  constructor() {
    this.loader = new DataLoader<number, Playlist>(async (ids) => {
      const playlists = await db
        .selectFrom("playlist")
        .where("id", "in", [...ids])
        .selectAll()
        .execute();

      return ids.map((id) => playlists.find((playlist) => playlist.id === id)!);
    });
  }

  async getAll() {
    return db.selectFrom("playlist").selectAll().orderBy("id", "asc").execute();
  }

  async getById(id: number) {
    return db.selectFrom("playlist").where("id", "=", id).selectAll().executeTakeFirstOrThrow();
  }

  async getByIds(ids: number[]) {
    return db.selectFrom("playlist").where("id", "in", ids).selectAll().execute();
  }

  async getAllByUser(userId: number) {
    return db
      .selectFrom("playlist")
      .where("userId", "=", userId)
      .selectAll()
      .orderBy("id", "asc")
      .execute();
  }

  async create(input: PlaylistInsert) {
    return db.insertInto("playlist").values(input).returningAll().executeTakeFirstOrThrow();
  }

  async update({ id, ...input }: PlaylistUpdate & { id: number }) {
    return db
      .updateTable("playlist")
      .where("id", "=", id)
      .set(input)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async delete(id: number) {
    return db.deleteFrom("playlist").where("id", "=", id).returningAll().executeTakeFirstOrThrow();
  }
}
