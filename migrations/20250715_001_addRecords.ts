/**
 * This largely follows how I worked on a recent project for work.
 * However the migration scripts were using dbmate: https://github.com/amacneil/dbmate.
 * I did not do this part of the project as we have data engineers but given large amounts of time I would do this.
 */

import { Kysely } from "kysely";
import { db } from "../src/db/database";
import { Database, InsertablePaymentsTable } from "../src/db/databaseTypes";

const defaultRecords: InsertablePaymentsTable[] = [
  {
    Total: 400,
    Record_type: "invoice",
    Status: "pending",
    Create_date: new Date().toISOString(),
    Modified_date: new Date().toISOString(),
  },
  {
    Total: 200,
    Record_type: "invoice",
    Status: "completed",
    Create_date: new Date().toISOString(),
    Modified_date: new Date().toISOString(),
  },
  {
    Total: 300,
    Record_type: "none",
    Status: "pending",
    Create_date: new Date().toISOString(),
    Modified_date: new Date().toISOString(),
  },
];

export async function addRecords() {
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
  await db.insertInto("payments").values(defaultRecords).execute();
}

addRecords();
