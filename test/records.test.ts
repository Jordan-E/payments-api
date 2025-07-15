import { db } from "../src/db/database";
import { app } from "../src/index";
import request from "supertest";
import { Record } from "../src/models/records.model";
import { record } from "zod";

const defaultRecord: Record = {
  total: 100,
  recordType: "bill", // Ensure the type matches the expected values
  status: "pending",
};

// Remove all db records before and after tests to make sure tests aren't flakey.
beforeAll(async () => {
  await db.deleteFrom("payments").execute();
});
afterAll(async () => {
  await db.deleteFrom("payments").execute();
});

// End point testing the most basic fetching of records.
describe("Get records", () => {
  it("Get no data", async () => {
    const res = await request(app).get("/records");
    expect(res.statusCode).toBe(200);
  });

  it("Manually added row", async () => {
    db.insertInto("payments")
      .values({
        Total: defaultRecord.total,
        Record_type: defaultRecord.recordType,
        Status: defaultRecord.status,
        Create_date: new Date().toISOString(),
        Modified_date: new Date().toISOString(),
      })
      .execute();

    const res = await request(app).get("/records");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    console.log(res.body);
    expect(res.body).toEqual([
      {
        id: expect.any(Number),
        total: defaultRecord.total,
        recordType: defaultRecord.recordType,
        status: defaultRecord.status,
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

  it("Both params", async () => {
    const res = await request(app).get("/records").query({
      status: "pending",
      recordType: "bill",
    });
    expect(res.statusCode).toBe(200);
  });
});

describe("Adding records", () => {});
describe("Adding invalid records", () => {});
