import { Injectable } from "@nestjs/common";

import { db } from "../../database/index.js";

import { UserInsert } from "./user.model.js";

@Injectable()
export class UserService {
  async getById(id: number) {
    return db.selectFrom("user").where("id", "=", id).selectAll().executeTakeFirstOrThrow();
  }

  async create(values: UserInsert) {
    return db.insertInto("user").values(values).returningAll().executeTakeFirstOrThrow();
  }
}
