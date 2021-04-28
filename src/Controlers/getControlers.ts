import express, { Request, Response } from "express";
import * as core from "express-serve-static-core";
import { Db } from "mongodb";
import nunjucks from "nunjucks";
import { GameModel } from "../Models/game";

const clientWantsJson = (request: express.Request): boolean =>
  request.get("Accept") === "application/json";

export function makeApp2(gameModel: GameModel): core.Express {
    //export function makeApp(client: MongoClient): core.Express {
    const app = express();
  
    nunjucks.configure("views", {
      autoescape: true,
      express: app,
    });
  
    app.set("view engine", "njk");

function getHome(request: Request, response: Response): void {
    response.render("home");
}

function getGames(request: Request, response: Response): void {
    gameModel.getAll().then((games) => {
        if (clientWantsJson(request)) {
          response.json(games)
        } else {
          response.render("games", { games });
        }
      });
    // response.render("games");
}

function getGamesBySlug(request: Request, response: Response): void {
    response.render("games_slug");
}

function getPlatforms(request: Request, response: Response): void {
    response.render("platforms");
}

function getPlatformsBySlug(request: Request, response: Response): void {
    response.render("platform_slug");
}

function getPayment(request: Request, response: Response): void {
    response.render("payment");
}

function getAllOthers(request: Request, response: Response): void {
    response.render("not-found");
}

function getLogin(request: Request, response: Response): void {
    response.render("login");
}

function getLogout(request: Request, response: Response): void {
    response.render("logout");
}
    return app;
}