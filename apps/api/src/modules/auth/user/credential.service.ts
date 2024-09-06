import { Injectable } from "@nestjs/common";

import { db } from "../../../database/index.js";

import { CredentialInsert, Providers } from "./credential.model.js";

@Injectable()
export class CredentialService {
  async findByProviderAndSubject(provider: Providers, subject: string) {
    return db
      .selectFrom("credential")
      .where("provider", "=", provider)
      .where("subject", "=", subject)
      .selectAll()
      .executeTakeFirst();
  }

  async create(values: CredentialInsert) {
    return db.insertInto("credential").values(values).returningAll().executeTakeFirstOrThrow();
  }
}
