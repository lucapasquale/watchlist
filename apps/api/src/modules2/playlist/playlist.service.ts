import { Injectable } from "@nestjs/common";

import { db } from "../../database/index.js";
import type { PlaylistInsert, PlaylistUpdate } from "../../modules/playlist/models.js";

@Injectable()
export class PlaylistService {
  async getAll() {
    return db.selectFrom("playlist").selectAll().execute();
  }

  async getByID(id: number) {
    return db.selectFrom("playlist").where("id", "=", id).selectAll().executeTakeFirstOrThrow();
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
