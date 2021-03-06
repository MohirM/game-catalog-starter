import * as dotenv from "dotenv";
import { makeApp } from "./src/server";
import { initDB } from "./src/init-database";

dotenv.config();

initDB().then((client) => {
  const app = makeApp(client);

  app.listen(process.env.PORT, () => {
    console.log(`Server listening on port: ${process.env.PORT}`);
  });
});
