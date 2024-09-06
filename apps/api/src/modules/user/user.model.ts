import { ColumnType, Generated, Insertable, Selectable, Updateable } from "kysely";

export interface UserTable {
  id: Generated<number>;

  email: ColumnType<string, string, never>;
  name: string;
  profilePictureUrl: string | null;

  createdAt: ColumnType<Date, string | undefined, never>;
  updatedAt: ColumnType<Date, string | undefined, string | undefined>;
}

export type User = Selectable<UserTable>;
export type UserInsert = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;
