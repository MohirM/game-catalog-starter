import express, { Request, Response } from "express";
import * as core from "express-serve-static-core";
import { Db, MongoClient } from "mongodb";
import nunjucks from "nunjucks";
import session from "express-session";
import mongoSession from "connect-mongo";
import OAuth2Client, {
  OAuth2ClientConstructor,
} from "@fewlines/connect-client";

//////////////////////
//makeApp() function//
//////////////////////
export function makeApp(db: Db): core.Express {
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
    openIDConfigurationURL: "https://fewlines.connect.prod.fewlines.tech/.well-known/openid-configuration",
    clientID: "***",
    clientSecret: "***",
    redirectURI: "https://localhost:3000/oauth/callback",
    audience: "wdb2g2",
    scopes: ["openid", "email"],
  };

  const oauthClient = new OAuth2Client(oauthClientConstructorProps);

  ////////////////////////////////////
  // Initialization of Mongo session//
  /////////////////////////////////////
  // const mongoStore = mongoSession(session);
  // if (process.env.NODE_ENV === "production") {
  //   app.set("trust proxy", 1);
  // }
  // const sessionParser = session({
  //   secret:
  //     "fdiosfoihfwihfiohwipuiiufbfiuhfisheiushfpihsfpihfifhihfpuhdfshfhfpihwepihpsdhiodghfoihpfhsfphsdpifh",
  //   name: "sessionId",
  //   resave: false,
  //   saveUninitialized: true,
  //   store: mongoStore.create({
  //     client: oauthClient,
  //   }),
  //   cookie: {
  //     secure: process.env.NODE_ENV === "production",
  //     expires: new Date(Date.now() + 3600000),
  //   },
  // });

  //callbackUrls: callbackUrls: {https://game-catalog-staging-appli.herokuapp.com/oauth/callback,https://game-catalog-production-ap.herokuapp.com/oauth/callback,http://localhost:8080/oauth/callback,http://localhost:3000/oauth/callback,https://oauthdebugger.com/debug}

  app.get("/", (request: Request, response: Response) => {
    response.render("index")
  });

  return app;
}





// app.get("/oauth/callback", sessionParser, (request:Request, response: Response) =>{
//   const data ={
//     client_id: `${process.env.CONNECT_CLIENT_ID}`,
//     code:`${request.query.code}`,
//     client_secret: `${process.env.CONNECT_CLIENT_SECRET}`,
//     grand_type: "authorization_code",
//     redirect_uri: "http://localhost:3000/oauth/callback",
//   };
//   fetch('http://fewlines.connect.prod.fewlines.tech/oauth/token', {
//     method: "POST",
//     headers: {
//       "Content-type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams(data).toString(),
//   })
//   .then((response) => response.json())
//   .then((result) => {
//     oauthClient.verifyJWT()
//     response.redirect();
//   })
// })