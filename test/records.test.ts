import { db } from "../src/db/database";
import { app } from "../src/index";

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
