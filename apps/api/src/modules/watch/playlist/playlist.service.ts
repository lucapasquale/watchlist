import { Injectable } from "@nestjs/common";

import { db } from "../../../database/index.js";

import type { PlaylistInsert, PlaylistUpdate } from "./playlist.model.js";

@Injectable()
export class PlaylistService {
  async getAll() {
    return db.selectFrom("playlist").selectAll().execute();
  }

  async getById(id: number) {
    return db.selectFrom("playlist").where("id", "=", id).selectAll().executeTakeFirstOrThrow();
  }

  async getAllByUser(userId: number) {
    return db.selectFrom("playlist").where("userId", "=", userId).selectAll().execute();
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
    return db.deleteFrom("playlist").where("id", "=", id);
  }
}
