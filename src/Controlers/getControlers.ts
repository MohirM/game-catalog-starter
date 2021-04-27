import express, { Request, Response } from "express";
import * as core from "express-serve-static-core";
import { Db } from "mongodb";
import nunjucks from "nunjucks";

export function getHome(request: Request, response: Response): void {
    response.render("home")
}

export function getGames(request: Request, response: Response): void {
    response.render("games")
}

export function getGamesBySlug(request: Request, response: Response): void {
    response.render("games_slug")
}

// export function getHome(request: Request, response: Response): void {
//     response.render("home")
// }

// export function getHome(request: Request, response: Response): void {
//     response.render("home")
// }