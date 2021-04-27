import express, { Request, Response } from "express";
import * as core from "express-serve-static-core";
import { Db } from "mongodb";
import nunjucks from "nunjucks";

// app.get("/home", (request: Request, response: Response) => {
  //   response.render("index");
  // });

export function getHome(request: Request, response: Response): void {
    response.render("index")
}