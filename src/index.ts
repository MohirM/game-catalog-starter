import { makeApp } from "./server";
import * as dotenv from "dotenv";
import { initDB } from "./init-database";
import { GameModel } from "./models/game";

dotenv.config();

const PORT = process.env.PORT || 3000;

initDB().then((client) => {
  const db = client.db();
  const gameModel = new GameModel(db.collection("games"));

  const app = makeApp(gameModel);

  app.listen(PORT, () => {
    console.log(`Server successfully started on http://localhost:${PORT}`);
  });
});