import { db } from "../src/db/database";
import { app } from "../src/index";
import request from "supertest";
import { Record } from "../src/models/records.model";

const defaultRecord: Record = {
  total: 100,
  recordType: "bill", // Ensure the type matches the expected values
  status: "pending",
};

beforeAll(async () => {
  await db.deleteFrom("payments").execute();
});

afterAll(async () => {
  await db.deleteFrom("payments").execute();
});

describe("Getting records", () => {
  it("Get no data", async () => {
    const res = await request(app).get("/records").query({});
    expect(res.statusCode).toBe(200);
  });

  it("Manually added row", async () => {
    db.insertInto("payments")
      .values({
        total: defaultRecord.total,
        record_type: defaultRecord.recordType,
        status: defaultRecord.status,
        create_date: new Date().toISOString(),
        modified_date: new Date().toISOString(),
      })
      .execute();

    const res = await request(app).get("/records").query({});
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
  });
});
describe("Get records with filter", () => {});
describe("Adding records", () => {});
describe("Adding invalid records", () => {});
