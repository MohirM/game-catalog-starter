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

export function makeApp(db: Db): core.Express {
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
    redirectURI: "https://localhost:3000/oauth/callback",
    audience: "wdb2g2",
    scopes: ["openid", "email"],
  };
  const oauthClient = new OAuth2Client(oauthClientConstructorProps);

  const urlConnect = `https://fewlines.connect.prod.fewlines.tech/oauth/authorize?client_id=${oauthClient.clientID}&response_type=code&redirect_uri=${oauthClient.redirectURI}&scope=${oauthClient.scopes[0]}+${oauthClient.scopes[1]}`;

  app.get("/", (request: Request, response: Response) => {
    response.render("index");
  });

  // app.get("/home", (request: Request, response: Response) => {
  //   response.render("home");
  // });

  app.get("/home", getControlers.getHome);

  // app.get("/games", (request: Request, response: Response) => {
  //   response.render("games");
  // });

  app.get("/games", getControlers.getGames);

  // app.get("/games/:game_slug", (request: Request, response: Response) => {
  //   response.render("games_slug");
  // });

  app.get("/games/:game_slug", getControlers.getGamesBySlug);

  // app.get("/platforms", (request: Request, response: Response) => {
  //   response.render("platforms");
  // });

  app.get("/platforms", getControlers.getPlatforms);

  // app.get("/platforms/:platform_slug",(request: Request, response: Response) => {
  //     response.render("platform_slug");
  //   });

  app.get("/platforms/:platform_slug", getControlers.getPlatformsBySlug);

  // app.get("/login", (request: Request, response: Response) => {
  //   response.render("login");
  // });

  app.get("/login", (request: Request, response: Response) => {
    response.redirect(urlConnect);
  });

  // app.get("/logout", (request: Request, response: Response) => {
  //   response.render("logout");
  // });

  app.get("/logout", getControlers.getLogout);

  // app.get("/payment", (request: Request, response: Response) => {
  //   response.render("payment");
  // });

  app.get("/payment", getControlers.getPayment);

  // app.get("/*", (request: Request, response: Response) => {
  //   response.render("not-found");
  // });

  app.get("/*", getControlers.getAllOthers);

  return app;
}
