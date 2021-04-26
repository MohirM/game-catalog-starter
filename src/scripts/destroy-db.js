const mongo = require("mongodb");
const dotenv = require("dotenv")

dotenv.config()

let databaseUrl = process.env.MONGO_URL || "";
const options = { useNewUrlParser: true, useUnifiedTopology: true };

if (process.env.HEROKU_APP_NAME) {
  const url = new URL(databaseUrl)
  const herokuAppNameParts = process.env.HEROKU_APP_NAME.split("-");
  url.pathname = `${herokuAppNameParts[herokuAppNameParts.length - 1]}-${url.pathname.slice(1)}`
  databaseUrl = url.toString();
}

mongo.MongoClient.connect(databaseUrl, options).then((client) => {
  return client
    .db()
    .dropDatabase()
    .then(() => {
      console.log("Database dropped");
    });
});
