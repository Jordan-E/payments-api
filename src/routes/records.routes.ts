import { logger } from "../utils/logger";
import { Request, Response } from "express";
import {
  RecordTypeSchema,
  StatusSchema,
  RecordsSchema,
} from "../models/records.model";
import { db } from "../db/database";
import { SelectablePaymentsTable } from "../db/databaseTypes";
import { z } from "zod";

// Interface used to define the structure of the returned records in the post endpoint
interface RecordReturned {
  id: number;
  total: number;
  recordType: string;
  status: string;
  modifiedDate: string;
}

/**
 * API endpoint to get all records.
 * @param req Express Request object
 * @param res Express Response object
 * @returns RecordReturned[]
 */
export async function getRecords(
  req: Request,
  res: Response
): Promise<RecordReturned[] | void> {
  logger.info(
    `Records get endpoint: record type: ${req.query.recordType}, status: ${req.query.status}`
  );

  const recordType = RecordTypeSchema.safeParse(req.query.recordType);
  if (req.query.recordType && !recordType.success) {
    res.status(400).json({ error: "Invalid record type" });
    logger.error(
      `Invalid record type: ${req.query.recordType}. Error: ${z.prettifyError(
        recordType.error
      )}`
    );
    return;
  }

  const status = StatusSchema.safeParse(req.query.status);
  if (req.query.status && !status.success) {
    res.status(400).json({ error: "Invalid status" });
    logger.error(
      `Invalid status: ${req.query.status}. Error: ${z.prettifyError(
        status.error
      )}`
    );
    return;
  }
  let records: SelectablePaymentsTable[] | undefined = undefined;
  let query = db.selectFrom("payments").selectAll();

  if (recordType.data) query = query.where("Record_type", "=", recordType.data);
  if (status.data) query = query.where("Status", "=", status.data);

  logger.debug("Executing query:", query.compile().sql);

  try {
    records = await query.execute();
  } catch (error) {
    logger.error("Error executing query:", error);
    res.status(500).json({ error: "Query Error" });
    return;
  }

  const formattedRecord: RecordReturned[] = records.map((rec) => {
    return {
      id: rec.ID,
      total: rec.Total,
      recordType: rec.Record_type,
      status: rec.Status,
      modifiedDate: rec.Modified_date,
    };
  });

  logger.debug("Formatted records:", formattedRecord);

  res.status(200).json(formattedRecord);
}

/**
 * API endpoint to create new record item(s).
 * @param req Express Request object
 * @param res Express Response object
 * @returns Promise<void>
 */
export async function createRecord(req: Request, res: Response): Promise<void> {
  logger.info(`Creating new records: ${JSON.stringify(req.body)}`);
  const records = RecordsSchema.safeParse(req.body);

  if (!records.success) {
    res.status(400).json({
      error: `Invalid data format. ${z.prettifyError(records.error)}`,
    });
    logger.error(
      `Invalid data format: ${JSON.stringify(
        req.body
      )}. Error: ${z.prettifyError(records.error)}`
    );
    return;
  }

  const trx = await db.startTransaction().execute();

  try {
    for (const record of records.data) {
      await trx
        .insertInto("payments")
        .values({
          Total: parseFloat(record.total.toFixed(2)),
          Record_type: record.recordType,
          Status: record.status,
          Create_date: new Date().toISOString(),
          Modified_date: new Date().toISOString(),
        })
        .execute();
    }

    await trx.commit().execute();
  } catch (error) {
    await trx.rollback().execute();
    logger.error(`Error inserting records. Error: ${error}`);
    res.status(500).json({
      error: `Error inserting records. Error: ${error}`,
    });
    return;
  }

  res.status(201).json({ message: "Records created successfully" });
}
