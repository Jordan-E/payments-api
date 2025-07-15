import { db } from "../src/db/database";
import { app } from "../src/index";
import request from "supertest";

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
});
describe("Get records with filter", () => {});
describe("Adding records", () => {});
describe("Adding invalid records", () => {});
