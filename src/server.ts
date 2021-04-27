import express, { Request, Response } from "express";
import * as core from "express-serve-static-core";
import nunjucks from "nunjucks";
import { GameModel } from "./models/game";

const clientWantsJson = (request: express.Request): boolean =>
  request.get("Accept") === "application/json";

export function makeApp(gameModel: GameModel): core.Express {
  const app = express();

  app.use("/assets", express.static("assets"));

  nunjucks.configure("views", {
    autoescape: true,
    express: app,
  });

  app.set("view engine", "njk");

  app.get("/", (request: Request, response: Response) => {
    response.render("not-found");
  });

  app.get("/home", (request: Request, response: Response) => {
    response.render("home");
  });

  app.get("/games", (request: Request, response: Response) => {
    gameModel.getAll().then((games) => {
      if (clientWantsJson(request)) {
        response.json(games)
      } else {
        response.render("games", { games });
      }
    });
  });

  app.get("/games/:game_slug", (request: Request, response: Response) => {
    gameModel.findBySlug(request.params.game_slug).then((game) => {
      if (!game) {
        response.status(404).end();
      } else {
        if (clientWantsJson(request)) {
          response.json(game);
        } else {
          response.render("game_slug", { game });
        }
      }
    });
  });

  app.get("/platforms", (request: Request, response: Response) => {
    gameModel.getPlatforms().then((platforms) => {
      if (clientWantsJson(request)) {
        response.json(platforms)
      } else {
        response.render("platforms", { platforms });
      }
    });
  });

  app.get("/platforms/:platform_slug", (request: Request, response: Response) => {
    gameModel.findByPlatform(request.params.platform_slug)
      .then((gamesForPlatform) => {
        if (clientWantsJson(request)) {
          response.json(gamesForPlatform)
        } else {
          response.render("platform_slug", { gamesForPlatform });
        }
      });
  });

  app.get("/login", (request, response) => {
    response.render("login");
  });

  app.get("/logout", (request, response) => {
    response.render("logout");
  });

  app.get("/payement", (request, response) => {
    response.render("payement");
  });

  app.get("/*", (request, response) => {
    response.status(400).render("not-found");
  });

  return app;
}
