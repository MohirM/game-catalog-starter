import express, { request, Request, Response } from "express";
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

export function makeApp(db: Db, client: MongoClient): core.Express {
  //export function makeApp(client: MongoClient): core.Express {
  const app = express();

  nunjucks.configure("views", {
    autoescape: true,
    express: app,
  });

  app.set("view engine", "njk");

  //////////////////////////////////////////
  // Initialization of the client instance//
  //////////////////////////////////////////
  const oauthClientConstructorProps: OAuth2ClientConstructor = {
    openIDConfigurationURL:
      "https://fewlines.connect.prod.fewlines.tech/.well-known/openid-configuration",
    clientID: `${process.env.CONNECT_CLIENT_ID}`,
    clientSecret: `${process.env.CONNECT_CLIENT_SECRET}`,
    redirectURI: "http://localhost:3000/oauth/callback",
    audience: "wdb2g2",
    scopes: ["openid", "email"],
  };
  const oauthClient = new OAuth2Client(oauthClientConstructorProps);

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

  app.get("/games", getControlers.getGames);

  app.get("/games/:game_slug", getControlers.getGamesBySlug);

  app.get("/platforms", getControlers.getPlatforms);

  app.get("/platforms/:platform_slug", getControlers.getPlatformsBySlug);

  app.get("/login", async (request: Request, response: Response) => {
    //const urlConnect = `https://fewlines.connect.prod.fewlines.tech/oauth/authorize?client_id=${oauthClient.clientID}&response_type=code&redirect_uri=${oauthClient.redirectURI}&scope=${oauthClient.scopes[0]}+${oauthClient.scopes[1]}`;
    const urlConnect = await oauthClient.getAuthorizationURL();
    response.redirect(`${urlConnect}`);
  });

  app.get("/logout", getControlers.getLogout);

  app.get("/payment", getControlers.getPayment);

  app.get("/*", getControlers.getAllOthers);

  return app;
}
