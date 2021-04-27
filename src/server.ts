import express, { Request, Response } from "express";
import * as core from "express-serve-static-core";
import { Db } from "mongodb";
import nunjucks from "nunjucks";

export function makeApp(db: Db): core.Express {
  const app = express();

  nunjucks.configure("views", {
    autoescape: true,
    express: app,
  });

  app.set("view engine", "njk");

  app.get("/", (request: Request, response: Response) => {
    response.render("index");
  });

  app.get("/home", (request: Request, response: Response) => {
    response.render("index");
  });

  app.get("/games", (request: Request, response: Response) => {
    response.render("games");
  });

  app.get("/games/:game_slug", (request: Request, response: Response) => {
    response.render("games_slug");
  });

  app.get("/platforms", (request: Request, response: Response) => {
    response.render("platforms");
  });
  app.get("/platforms/:platform_slug",(request: Request, response: Response) => {
      response.render("platform_slug");
    });

  app.get("/login", (request: Request, response: Response) => {
    response.render("login");
  });

  app.get("/logout", (request: Request, response: Response) => {
    response.render("logout");
  });

  app.get("/payement", (request: Request, response: Response) => {
    response.render("payement");
  });

  app.get("/*", (request: Request, response: Response) => {
    response.render("not-found");
  });

  return app;
}
