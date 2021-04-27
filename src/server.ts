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
    response.render("home");
  });
  app.get("/games", (request: Request, response: Response) => {
    response.render("games");
  });
  app.get("/games/:game_slug", (request: Request, response: Response) => {
    response.render("game_slug");
  });
  app.get("/platforms", (request: Request, response: Response) => {
    response.render("platforms");
  });
  app.get("/platforms/:platform_slug", (request: Request, response: Response) => {
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

// db.findByPlatform(request.params.platform_slug)
//       .then((gamesForPlatform) => {
//         if (clientWantsJson(request)) {
//           response.json(gamesForPlatform)
//         } else {
//           response.render("platform_slug", { gamesForPlatform });
//         }
//       });
