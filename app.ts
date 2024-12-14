import express from "express";
import cors from 'cors'
import { appConfig } from "./configs/config.js";
import {config} from 'dotenv'

import AdminRouter from "./routes/adminRoutes.js";
import getAuthenticationRouter from "./routes/authenticationRoutes.js";

import GameAndEventsManagerFactory from "./lib/GamesAndEvents/index.js"
import AuthenticationFactory from "./lib/authentication/authenticator.js";
import DatabaseFactory from "./lib/db/database.js";
import AuthorisationMiddlewareFactory from "./lib/authorisation/index.js";
import EventRegistrationRouter from "./routes/eventRegistrationRoutes.js";
import ShopRouter from "./routes/shopRoutes.js";
import MoneyManager from "./lib/moneyManager/moneyManager.js";
import Razorpay from 'razorpay'

const app = express();
const rzp = new Razorpay({key_id : "something"}) // Change this
config({path : ".env"})


app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(cors({origin : appConfig.frontendUrl,credentials : true}))

const dbConnectionString = process.env.MONGO_CONNECTION_STRING
const senderEmailPassword = process.env.USER_EMAIL_PASSWORD

const databaseFactory = DatabaseFactory.getInstance(dbConnectionString, {
    "db_name" : appConfig.dbName,
}); // Import appConfigs from a file


const authenticationFactory = AuthenticationFactory.getInstance(databaseFactory.getAuthenticationDatabase(), {"keypair_directory" : "keys", "publickey_filename" : "key.pub", "privatekey_filename" : "key.pem"})
const authorizationFactory = AuthorisationMiddlewareFactory.getInstance(appConfig.smtpServiceName, appConfig.smtpServerAddress, appConfig.smtpServerPortNumber, false, appConfig.smtpServerEmail, senderEmailPassword, appConfig.smtpServerSenderName, appConfig.smtpOtpLength)
const gamesAndEventManagerFactoryObject = await GameAndEventsManagerFactory.getInstance(databaseFactory.getEventDatabase(), databaseFactory.getGameDatabase())

const moneyManagerObject = MoneyManager.getInstance(databaseFactory.getCurrencyDatabase(), databaseFactory.getCoinPacksDatabase(), rzp)



const authenticationRouter = getAuthenticationRouter(authenticationFactory, authorizationFactory)
const eventRegistrationRouter = EventRegistrationRouter(gamesAndEventManagerFactoryObject, moneyManagerObject)

const shopRouter = ShopRouter(moneyManagerObject)

app.use("/api/", authenticationRouter)
app.use("/api/admin", authenticationFactory.jwtAuthenticator.authenticate, authenticationFactory.jwtAuthenticator.isAuthenticated, AdminRouter(gamesAndEventManagerFactoryObject, moneyManagerObject))
app.use("/api/events", authenticationFactory.jwtAuthenticator.authenticate, authenticationFactory.jwtAuthenticator.isAuthenticated ,eventRegistrationRouter)
app.use("/api/shop",authenticationFactory.jwtAuthenticator.authenticate,  authenticationFactory.jwtAuthenticator.isAuthenticated ,shopRouter)


app.listen(80 , "0.0.0.0" ,()=>{
    console.log("Listening on port 80...")
})
