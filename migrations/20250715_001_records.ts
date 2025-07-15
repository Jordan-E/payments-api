/**
 * This largely follows how I worked on a recent project for work.
 * However the migration scripts were using dbmate: https://github.com/amacneil/dbmate.
 * I did not do this part of the project as we have data engineers but given large amounts of time I would do this.
 */

import { Kysely } from "kysely";
import { db } from "../src/db/database";
import { Database } from "../src/db/databaseTypes";

export async function createDatabase() {
  try {
    await createPaymentsTable(db);
  } catch (err) {
    throw new Error(
      "Failed to create database. If using in memory database delete database.db file and try again." +
        err
    );
  }
}

async function createPaymentsTable(db: Kysely<Database>) {
  await db.schema
    .createTable("payments")
    .addColumn("ID", "bigint", (col) => col.primaryKey().autoIncrement())
    .addColumn("Total", "real")
    .addColumn("Record_type", "text", (col) => col.notNull())
    .addColumn("Status", "text", (col) => col.notNull())
    .addColumn("Create_date", "text")
    .addColumn("Modified_date", "text")
    .execute();
}

createDatabase();
