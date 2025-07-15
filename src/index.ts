import express, { Request, Response, json } from "express";

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
  req.query.recordType;
  req.query.status;

  throw new Error("To be implemented");
  res.status(200).json({});
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
