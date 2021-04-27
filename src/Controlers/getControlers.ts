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

export function getPlatforms(request: Request, response: Response): void {
    response.render("platforms")
}

export function getPlatformsBySlug(request: Request, response: Response): void {
    response.render("platform_slug")
}

export function getLogout(request: Request, response: Response): void {
    response.render("logout")
}

export function getPayment(request: Request, response: Response): void {
    response.render("payment")
}

export function getAllOthers(request: Request, response: Response): void {
    response.render("not-found")
}