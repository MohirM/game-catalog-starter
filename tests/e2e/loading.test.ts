import { openBrowser, goto, text, closeBrowser } from "taiko";
import { Server } from "http";
import { MongoClient } from "mongodb";
import * as dotenv from "dotenv";
import { makeApp } from "../../src/server";

dotenv.config();

let server: Server;
let mongoClient: MongoClient;

beforeEach((done) => {
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  const databaseUrl: string = process.env.MONGO_URL || "";

  MongoClient.connect(databaseUrl, options).then((client) => {
    mongoClient = client;
    const db = mongoClient.db();

    server = makeApp(db).listen(3030, done);
  });
});

afterEach(async (done) => {
  await mongoClient.close();
  server.close(done);
});

beforeAll(async () => {
  await openBrowser({
    args: [
      "--window-size=1440,1000",
      "--no-sandbox",
      "--start-maximized",
      "--disable-dev-shm",
    ],
    headless: true,
    observe: false,
    observeTime: 2000,
  });
});

afterAll(async () => {
  await closeBrowser();
});

test("Test that we have an index with an h1", async () => {
  expect.assertions(1);

  await goto("http://localhost:3030");

  expect(await text("This should be changed in the first PR").exists()).toBe(
    true
  );
});
