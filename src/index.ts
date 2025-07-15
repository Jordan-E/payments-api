import express, { Request, Response, json } from "express";
import { RecordTypeSchema, StatusSchema } from "./models/records.model";
import { db } from "./db/database";

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
  const recordType = RecordTypeSchema.safeParse(req.query.recordType);
  if (!recordType.success)
    return res.status(400).json({ error: "Invalid record type" });

  const status = StatusSchema.safeParse(req.query.status);
  if (!status.success) return res.status(400).json({ error: "Invalid status" });

  const records = await db.selectFrom("payments").selectAll().execute();

  const formattedRecord = records.map((record) => ({
    total: record.total,
    recordType: record.record_type,
    status: record.status,
    modifiedDate: record.modified_date,
  }));

  res.status(200).json(formattedRecord);
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
