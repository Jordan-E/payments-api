import express, { Request, Response, json } from "express";
import { RecordTypeSchema, StatusSchema } from "./models/records.model";
import { db } from "./db/database";
import { SelectablePaymentsTable } from "./db/databaseTypes";
import { logger } from "./utils/logger";

export const app = express();

app.use(json());

/**
 * Root endpoint that returns a simple greeting message.
 */
app.get("/", (_req: Request, res: Response) => {
  res.send("Hello from API");
});

/**
 * API endpoint to get all records.
 * Query parameters can be used to filter results.
 * @param recordType - RecordType of the record to filter by.
 * @param status - Status of the record to filter by.
 */
app.get("/records", async (req: Request, res: Response) => {
  logger.info("Records get endpoint");

  // Parsing zod record type
  const recordType = RecordTypeSchema.safeParse(req.query.recordType);
  if (req.query.recordType && !recordType.success)
    return res.status(400).json({ error: "Invalid record type" });

  const status = StatusSchema.safeParse(req.query.status);
  if (req.query.status && !status.success)
    return res.status(400).json({ error: "Invalid status" });

  let records: SelectablePaymentsTable[] | undefined = undefined;
  const query = db.selectFrom("payments").selectAll();

  if (recordType.data) query.where("Record_type", "=", recordType.data);
  if (status.data) query.where("Status", "=", status.data);

  try {
    records = await query.execute();
  } catch (error) {
    logger.error("Error executing query:", error);
    return res.status(500).json({ error: "Query Error" });
  }

  const formattedRecord = records.map((rec) => {
    return {
      id: rec.ID,
      total: rec.Total,
      recordType: rec.Record_type,
      status: rec.Status,
      modifiedDate: rec.Modified_date,
    };
  });

  logger.debug("Formatted records:", formattedRecord);

  return res.status(200).json(formattedRecord);
});

/**
 * API endpoint to create a new record.
 * The request body should contain the record data.
 */
app.post("/records", async (req: Request, res: Response) => {
  throw new Error("To be implemented");
  res.status(201).json({ message: "Records created successfully" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
