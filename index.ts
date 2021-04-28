import * as dotenv from "dotenv";
import { makeApp } from "./src/server";
import { initDB } from "./src/init-database";
import { GameModel } from "./src/Models/game";

dotenv.config();

initDB().then((client) => {
  const db = client.db();
  const app = makeApp(db, client);

  app.listen(process.env.PORT, () => {
    console.log(`Server listening on port: ${process.env.PORT}`);
  });
});
