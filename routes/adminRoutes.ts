import express from 'express';
import { AdminMiddleware } from '../lib/admin/adminMiddleware.js';
import { IGameAndEventsManagerFactory } from '../types/lib/gamesManagement/game.js';
import MoneyManager from '../lib/moneyManager/moneyManager.js';
// Assuming AdminMiddleware is imported correctly

export default function AdminRouter(gameAndEventsManagerFactory : IGameAndEventsManagerFactory, moneyManager : MoneyManager)
{
    const router = express.Router();
    router.use(express.json()); // for parsing application/json

    const adminMiddlewareInstance = AdminMiddleware.getInstance(gameAndEventsManagerFactory);

    // Create game route
    router.post('/createGame', adminMiddlewareInstance.createGameMiddleware);

    router.get('/getGames', adminMiddlewareInstance.getGamesMiddleware);

    // Update game route
    router.post('/updateGame', adminMiddlewareInstance.updateGameMiddleware);

    // Delete game route
    router.post('/deleteGame', adminMiddlewareInstance.deleteGameMiddleware);

    // Create game event route
    router.post('/createEvent', adminMiddlewareInstance.createGameEventMiddleware);

    // Delete game event route
    router.post('/deleteEvent', adminMiddlewareInstance.deleteGameEventMiddleware); 

    router.post("/createMoneyPack", async (req, res)=>{
        if(req.user && req.user.admin)
        {
            if(req.body.coins && req.body.price)
            {
                const result = await moneyManager.createMoneyPack(req.body.coins, req.body.price)
                return res.json({"success" : result})
            }
            res.status(400).send("Enter coins and price in body!")
        }
        res.status(401).send("Unauthorized!")
    })
    
    
    return router;
}

