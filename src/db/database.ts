import { Database } from "./databaseTypes";
import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

// Using keysly as query builder and ORM for SQLite database. For this exercise for speed I have used a file as the db.
// This is also very useful for testing purposes.
// https://kysely.dev/docs/intro
const dialect = new SqliteDialect({
  database: new SQLite(".database.db"),
});

export const db = new Kysely<Database>({
  dialect,
});
