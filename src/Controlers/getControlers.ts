import express, { Request, Response } from "express";

export function getHome(request: Request, response: Response): void {
  response.render("home");
}

export function getGames(request: Request, response: Response): void {
  response.render("games");
}

export function getGamesBySlug(request: Request, response: Response): void {
  response.render("games_slug");
}

export function getPlatforms(request: Request, response: Response): void {
  response.render("platforms");
}

export function getPlatformsBySlug(request: Request, response: Response): void {
  response.render("platform_slug");
}

export function getPayment(request: Request, response: Response): void {
  response.render("payment");
}

// export function getAllOthers(request: Request, response: Response): void {
//   response.render("not-found");
// }

export function getLogin(request: Request, response: Response): void {
  response.render("login");
}

export function getLogout(request: Request, response: Response): void {
  response.render("logout");
}
