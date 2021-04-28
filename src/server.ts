import express, { Request, Response } from "express";
import * as core from "express-serve-static-core";
import { Db, MongoClient } from "mongodb";
import nunjucks from "nunjucks";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoSession from "connect-mongo";
import OAuth2Client, {
  OAuth2ClientConstructor,
} from "@fewlines/connect-client";
import * as getControlers from "./Controlers/getControlers";
import { GameModel } from "./Models/game";

const clientWantsJson = (request: express.Request): boolean =>
  request.get("accept") === "application/json";

export function makeApp(client: MongoClient): core.Express {
  const app = express();
  const db = client.db();

  nunjucks.configure("views", {
    autoescape: true,
    express: app,
  });

  app.set("view engine", "njk");

  ///////////////////////////////////////////
  // Initialization of the client instance //
  ///////////////////////////////////////////
  const oauthClientConstructorProps: OAuth2ClientConstructor = {
    openIDConfigurationURL:
      "https://fewlines.connect.prod.fewlines.tech/.well-known/openid-configuration",
    clientID: `${process.env.CONNECT_CLIENT_ID}`,
    clientSecret: `${process.env.CONNECT_CLIENT_SECRET}`,
    redirectURI: `${process.env.CONNECT_REDIRECT_URI}`,
    audience: "wdb2g2",
    scopes: ["openid", "email"],
  };
  const oauthClient = new OAuth2Client(oauthClientConstructorProps);

  /////////////////////////////////////
  // Initialization of sessionParser //
  /////////////////////////////////////

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }
  const sessionParser = session({
    secret:
      "aboubacar_florian_ilez_and_mohir_are_four_guys_trying_their_best_to_develop_this_app_and_therefor_to_learn_how_to_be_good_devs",
    name: "sessionId",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      client: client,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 3600000),
    },
  });

  app.get("/", sessionParser, (request: Request, response: Response) => {
    response.render("index");
  });

  app.get("/home", getControlers.getHome);

  // app.get("/games", (request: Request, response: Response) => {
  //   response.render("games");
  // });
  const gameModel = new GameModel(db.collection("games"));
  app.get("/games", (request, response) => {
    gameModel.getAll().then((games) => {
      if (clientWantsJson(request)) {
        response.json(games);
      } else {
        response.render("games", { games });
      }
    });
  });

  app.get("/games/:game_slug", getControlers.getGamesBySlug);

  app.get("/platforms", getControlers.getPlatforms);

  app.get("/platforms/:platform_slug", getControlers.getPlatformsBySlug);

  /////////////////////
  // Authentication //
  ///////////////////

  app.get(
    "/login",
    sessionParser,
    async (request: Request, response: Response) => {
      console.log("\n######## NEW TRY ON CONNECT ########\n");
      const urlConnect = await oauthClient.getAuthorizationURL();
      //console.log("\n######## urlConnect ########\n");
      console.log(urlConnect);
      response.redirect(`${urlConnect}`);
    }
  );

  app.get(
    "/oauth/callback",
    sessionParser,
    async (request: Request, response: Response) => {
      console.log("\n######## REDIRECT_URI FROM CONNECT ########\n");
      const tokens = await oauthClient.getTokensFromAuthorizationCode(
        `${request.query.code}`
      ); //Returns a list containing the access_token, refresh_token (and id_token if present)
    }
  );

  // app.get("/logout", getControlers.getLogout);

  // app.get("/payment", getControlers.getPayment);

  // app.get("/*", getControlers.getAllOthers);

  return app;
}
