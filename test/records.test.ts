import { db } from "../src/db/database";
import { InsertablePaymentsTable } from "../src/db/databaseTypes";
import { app } from "../src/index";
import request from "supertest";
import { Record } from "../src/models/records.model";

const defaultRecord: InsertablePaymentsTable = {
  Total: 100,
  Record_type: "bill", // Ensure the type matches the expected values
  Status: "pending",
  Create_date: new Date().toISOString(),
  Modified_date: new Date().toISOString(),
};

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

const defaultInsertRecord: Record = {
  total: 100,
  recordType: "bill",
  status: "pending",
};

const defaultInsertRecords: Record[] = [
  {
    total: 400,
    recordType: "invoice",
    status: "pending",
  },
  {
    total: 200,
    recordType: "invoice",
    status: "completed",
  },
  {
    total: 300,
    recordType: "none",
    status: "pending",
  },
];

// Remove all db records before and after tests to make sure tests aren't flakey.
beforeAll(async () => {
  await db.deleteFrom("payments").execute();
});
afterAll(async () => {
  await db.deleteFrom("payments").execute();
});

// End point testing the most basic fetching of records.
describe("Get records no data", () => {
  it("Get no data", async () => {
    const res = await request(app).get("/records");
    expect(res.statusCode).toBe(200);
  });
});

describe("Get records with single row", () => {
  beforeAll(async () => {
    await db.insertInto("payments").values(defaultRecord).execute();
  });
  afterAll(async () => {
    await db.deleteFrom("payments").execute();
  });

  it("Manually added row", async () => {
    const res = await request(app).get("/records");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body).toEqual([
      {
        id: expect.any(Number),
        total: defaultRecord.Total,
        recordType: defaultRecord.Record_type,
        status: defaultRecord.Status,
        modifiedDate: expect.any(String),
      },
    ]);
  });
});

describe("Get records with filter url params only test response code", () => {
  it("Record type param", async () => {
    const res = await request(app).get("/records").query({
      recordType: "bill",
    });
    expect(res.statusCode).toBe(200);
  });

  it("Status param", async () => {
    const res = await request(app).get("/records").query({
      status: "pending",
    });
    expect(res.statusCode).toBe(200);
  });
});

// TODO: Add data and check this was largely boilerplate. I ran out of time.
describe("Get records with filter url params check data", () => {
  beforeAll(async () => {
    await db.insertInto("payments").values(defaultRecords).execute();
  });
  afterAll(async () => {
    await db.deleteFrom("payments").execute();
  });

  it("Record type param", async () => {
    const res = await request(app).get("/records").query({
      recordType: "invoice",
    });
    expect(res.statusCode).toBe(200);
    const statusPendingDefaultValues = defaultRecords.filter(
      (record) => record.Record_type === "invoice"
    );
    expect(res.body).toHaveLength(statusPendingDefaultValues.length);
    const hasInvoiceRecordType = res.body.every(
      (record: any) => record.recordType === "invoice"
    );
    expect(hasInvoiceRecordType).toBe(true);
  });

  it("Status param", async () => {
    const res = await request(app).get("/records").query({
      status: "pending",
    });
    expect(res.statusCode).toBe(200);
    const statusPendingDefaultValues = defaultRecords.filter(
      (record) => record.Status === "pending"
    );
    expect(res.body).toHaveLength(statusPendingDefaultValues.length);
    const hasPendingStatus = res.body.every(
      (record: any) => record.status === "pending"
    );
    expect(hasPendingStatus).toBe(true);
  });

  it("Record type and status params", async () => {
    const res = await request(app).get("/records").query({
      recordType: "invoice",
      status: "pending",
    });
    expect(res.statusCode).toBe(200);
    const statusPendingDefaultValues = defaultRecords.filter(
      (record) =>
        record.Record_type === "invoice" && record.Status === "pending"
    );
    expect(res.body).toHaveLength(statusPendingDefaultValues.length);
    const hasInvoiceRecordTypeAndPendingStatus = res.body.every(
      (record: any) =>
        record.recordType === "invoice" && record.status === "pending"
    );
    expect(hasInvoiceRecordTypeAndPendingStatus).toBe(true);
  });
});

describe("Adding records", () => {
  beforeAll(async () => {
    await db.deleteFrom("payments").execute();
  });
  afterAll(async () => {
    await db.deleteFrom("payments").execute();
  });
  afterEach(async () => {
    await db.deleteFrom("payments").execute();
  });

  it("Add a single record", async () => {
    const res = await request(app)
      .post("/records")
      .send([defaultInsertRecord])
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(201);

    const records = await db.selectFrom("payments").selectAll().execute();
    expect(records).toHaveLength(1);
  });

  it("Add multiple records", async () => {
    const res = await request(app)
      .post("/records")
      .send(defaultInsertRecords)
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(201);

    const records = await db.selectFrom("payments").selectAll().execute();
    expect(records).toHaveLength(defaultInsertRecords.length);
  });
});

describe("Adding invalid records", () => {
  beforeAll(async () => {
    await db.deleteFrom("payments").execute();
  });
  afterAll(async () => {
    await db.deleteFrom("payments").execute();
  });
  afterEach(async () => {
    await db.deleteFrom("payments").execute();
  });

  it("Add a single record with invalid data", async () => {
    const res = await request(app)
      .post("/records")
      .send([{ total: "invalid", recordType: "bill", status: "pending" }])
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(400);
  });

  it("Add multiple records with invalid data", async () => {
    const res = await request(app)
      .post("/records")
      .send([
        { total: "invalid", recordType: "bill", status: "pending" },
        { total: 200, recordType: "invoice", status: "completed" },
      ])
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(400);
  });

  it("Add a single record with invalid record type", async () => {
    const res = await request(app)
      .post("/records")
      .send([{ total: 100, recordType: "invalid", status: "pending" }])
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(400);
  });

  it("Add a single record with invalid status", async () => {
    const res = await request(app)
      .post("/records")
      .send([{ total: 100, recordType: "bill", status: "invalid" }])
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(400);
  });

  it("Add a single record with missing total", async () => {
    const res = await request(app)
      .post("/records")
      .send([{ recordType: "bill", status: "pending" }])
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(res.body.error).toBe(
      "Invalid data format. ✖ Invalid input: expected number, received undefined\n  → at [0].total"
    );
  });
});
