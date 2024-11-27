import express from "express";
import AdminRouter from "./routes/adminRoutes.js";
import getAuthenticationRouter from "./routes/authenticationRoutes.js";

import GameAndEventsManagerFactory from "./lib/GamesAndEvents/index.js"
import AuthenticationFactory from "./lib/authentication/authenticator.js";
import DatabaseFactory from "./lib/db/database.js";
import AuthorisationMiddlewareFactory from "./lib/authorisation/index.js";

const app = express();

const databaseFactory = DatabaseFactory.getInstance("mongoConnectionString", {"configs" : "something"});
const authenticationFactory = AuthenticationFactory.getInstance(databaseFactory.getAuthenticationDatabase())
const authorizationFactory = AuthorisationMiddlewareFactory.getInstance("Gmail", "smtp.gmail.com", 25, false, "kartikkala10december@gmail.com", "zkwydrpvlsrdxect", "GameWebsite", 6)

const gamesAndEventManagerFactoryObject = await GameAndEventsManagerFactory.getInstance(databaseFactory.getEventDatabase(), databaseFactory.getGameDatabase())
const authenticationRouter = getAuthenticationRouter(authenticationFactory, authorizationFactory)

app.use("/api/admin", AdminRouter(gamesAndEventManagerFactoryObject))
app.use("/api/", authenticationRouter)


app.listen(80 , "0.0.0.0" ,()=>{
    console.log("Listening on port 80...")
})
