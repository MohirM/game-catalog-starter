import * as dotenv from "dotenv";
import { makeApp } from "./src/server";
import { initDB } from "./src/init-database";
import { GameModel } from "./src/Models/game";
<<<<<<< HEAD

=======
>>>>>>> d14ba6da63c685b1e84b6281460e418b300a1f6e

dotenv.config();
import { format } from "prettier";

initDB().then((client) => {
  const db = client.db();
<<<<<<< HEAD
  // const gameModel = new GameModel(db.collection("games"));
  
  const app = makeApp(client);
=======
  const app = makeApp(db, client);
>>>>>>> d14ba6da63c685b1e84b6281460e418b300a1f6e

  app.listen(process.env.PORT, () => {
    console.log(`Server listening on port: ${process.env.PORT}`);
  });
});
