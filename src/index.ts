import { makeApp } from "./server";
import * as dotenv from "dotenv";
import { initDB } from "./init-database";

dotenv.config();

const PORT = process.env.PORT || 3000;

initDB().then((client) => {
  const db = client.db();

  const app = makeApp(db);

  app.listen(PORT, () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
  });
});