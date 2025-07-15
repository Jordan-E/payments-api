import { Database } from "./databaseTypes"; // this is the Database interface we defined earlier
import SQLite from "better-sqlite3";
import { Kysely, SqliteDialect } from "kysely";

// Using keysly as query builder and ORM for SQLite database.
// https://kysely.dev/docs/intro
const dialect = new SqliteDialect({
  database: new SQLite(":memory:"),
});

// Database interface is passed to Kysely's constructor, and from now on, Kysely
// knows your database structure.
// Dialect is passed to Kysely's constructor, and from now on, Kysely knows how
// to communicate with your database.
export const db = new Kysely<Database>({
  dialect,
});
