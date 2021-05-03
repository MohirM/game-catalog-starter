import express, { request, Request, Response } from "express";
import * as core from "express-serve-static-core";
import { Db, MongoClient } from "mongodb";
import { GameModel } from "./Models/game";
import nunjucks from "nunjucks";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoSession from "connect-mongo";
import OAuth2Client, {
  OAuth2ClientConstructor,
} from "@fewlines/connect-client";

const clientWantsJson = (request: express.Request): boolean =>
  request.get("accept") === "application/json";

export function makeApp(client: MongoClient): core.Express {
  const app = express();

  const formParser = express.urlencoded({ extended: true });

  const db = client.db();

  const gameModel = new GameModel(db.collection("games"));

  nunjucks.configure("views", {
    autoescape: true,
    express: app,
  });

  app.set("view engine", "njk");
  app.use("/assets", express.static("assets"));

  ///////////////////////////////////////////
  // Initialization of the client instance //
  ///////////////////////////////////////////
  const oauthClientConstructorProps: OAuth2ClientConstructor = {
    openIDConfigurationURL:
      "https://fewlines.connect.prod.fewlines.tech/.well-known/openid-configuration",
    clientID: `${process.env.CONNECT_CLIENT_ID}`,
    clientSecret: `${process.env.CONNECT_CLIENT_SECRET}`,
    redirectURI: `${process.env.CONNECT_REDIRECT_URI}`,
    audience: "wdb2g2",
    scopes: ["openid", "email"],
  };
  const oauthClient = new OAuth2Client(oauthClientConstructorProps);

  /////////////////////////////////////
  // Initialization of sessionParser //
  /////////////////////////////////////

  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }
  const sessionParser = session({
    secret:
      "aboubacar_florian_ilez_and_mohir_are_four_guys_trying_their_best_to_develop_this_app_and_therefor_to_learn_how_to_be_good_devs",
    name: "sessionId",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      client: client,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 3600000),
    },
  });

  ////////////////////////////////////////////////////
  // Declaring variables for checking loggin status //
  ////////////////////////////////////////////////////
  let checkingLoggin = false;
  let checkingLogginStatus: any = false;

  //////////////
  // Routing //
  /////////////

  app.get("/", sessionParser, (request: Request, response: Response) => {
    response.render("home", { checkingLoggin });
  });

  app.get("/home", sessionParser, async (request, response) => {
    response.render("home", { checkingLoggin });
  });

  app.get("/games", (request, response) => {
    gameModel.getAll().then((games) => {
      if (clientWantsJson(request)) {
        response.json(games);
      } else {
        response.render("games", { games, checkingLoggin });
      }
    });
  });

  app.get("/games/:game_slug", (request, response) => {
    gameModel.findBySlug(request.params.game_slug).then((game) => {
      if (!game) {
        response.status(404).render("not-found");
      } else {
        if (clientWantsJson(request)) {
          response.json(game);
        } else {
          response.render("game-slug", { game, checkingLoggin });
        }
      }
    });
  });

  app.get("/platforms", (request, response) => {
    gameModel.getPlatforms().then((platforms) => {
      if (clientWantsJson(request)) {
        response.json(platforms);
      } else {
        response.render("platforms", { platforms, checkingLoggin });
      }
    });
  });

  app.get("/platforms/:platform_slug", formParser, (request, response) => {
    gameModel
      .findByPlatform(request.params.platform_slug)
      .then((gamesForPlatform) => {
        if (clientWantsJson(request)) {
          response.json(gamesForPlatform);
        } else {
          response.render("platform-slug", {
            gamesForPlatform,
            checkingLoggin,
          });
        }
      });
  });

  app.get("/payment", (request: Request, response: Response) => {
    if (checkingLogginStatus) {
      response.render("payment", { checkingLoggin });
    } else {
      response.redirect("/login");
    }
  });

  /////////////////////
  // Authentication //
  ///////////////////

  app.get(
    "/login",
    sessionParser,
    async (request: Request, response: Response) => {
      const authURL = await oauthClient.getAuthorizationURL();
      response.redirect(`${authURL}`);
    }
  );

  app.get(
    "/oauth/callback",
    sessionParser,
    async (request: Request, response: Response) => {
      const tokens = await oauthClient.getTokensFromAuthorizationCode(
        `${request.query.code}`
      );

      const decoded = await oauthClient.verifyJWT(tokens.access_token, "RS256");
      checkingLogginStatus = decoded;

      try {
        if (request.session) {
          (request.session as any).accessToken = tokens.access_token;
          checkingLoggin = true;
          response.render("home", { checkingLoggin });
        }
      } catch (error) {
        console.error(error);
        response.redirect("/home");
      }
    }
  );

  app.get("/logout", sessionParser, (request: Request, response: Response) => {
    if (request.session) {
      request.session.destroy(() => {
        checkingLoggin = false;
        checkingLogginStatus = false;
        response.redirect("/home");
      });
    } else {
      response.redirect("/home");
    }
  });

  app.get("/comfirmedPurchase", (request: Request, response: Response) => {
    response.render("confirmed", { checkingLoggin });
  });

  app.get("/*", (request: Request, response: Response) => {
    response.render("not-found");
  });

  app.post("/search", formParser, (request, response) => {
    gameModel.getSearch(request.body.searchInput).then((games) => {
      if (clientWantsJson(request)) {
        response.json(games);
      } else {
        response.render("games", { games });
      }
    });
  });
  app.post("/platformsSearch", formParser, (request, response) => {
    console.log(request.body.searchInput);
    gameModel.getPlatformsSearch(request.body.searchInput).then((platforms) => {
      if (clientWantsJson(request)) {
        response.json(platforms);
      } else {
        console.log(platforms);
        response.render("platforms", { platforms });
      }
    });
  });

  return app;
}
