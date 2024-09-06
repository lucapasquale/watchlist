import { ColumnType, Insertable, Selectable, Updateable } from "kysely";

export type Providers = "google";

export interface CredentialTable {
  provider: ColumnType<Providers, Providers, never>;
  subject: ColumnType<string, string, never>;
  userId: ColumnType<number, number, never>;
}

export type Credential = Selectable<CredentialTable>;
export type CredentialInsert = Insertable<CredentialTable>;
export type CredentialUpdate = Updateable<CredentialTable>;
