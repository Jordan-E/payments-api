import express, { Request, Response, json } from "express";
import { getRecords, createRecord } from "./routes/records.routes";

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
app.get("/records", getRecords);

/**
 * API endpoint to create a new record.
 * The request body should contain the record data.
 */
app.post("/records", createRecord);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
