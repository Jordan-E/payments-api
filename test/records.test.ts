import { db } from "../src/db/database";

beforeAll(async () => {
  await db.deleteFrom("payments").execute();
});

afterAll(async () => {
  await db.deleteFrom("payments").execute();
});

describe("Getting records", () => {});
describe("Get records with filter", () => {});
describe("Adding records", () => {});
describe("Adding invalid records", () => {});
