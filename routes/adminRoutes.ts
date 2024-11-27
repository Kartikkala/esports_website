import express from 'express';
import { AdminMiddleware } from '../lib/admin/adminMiddleware';
import { IGameAndEventsManagerFactory } from '../types/lib/gamesManagement/game';
// Assuming AdminMiddleware is imported correctly

export default function AdminRouter(gameAndEventsManagerFactory : IGameAndEventsManagerFactory)
{
    const router = express.Router();
    router.use(express.json()); // for parsing application/json

    const adminMiddlewareInstance = AdminMiddleware.getInstance(gameAndEventsManagerFactory);

    // Create game route
    router.post('/createGame', adminMiddlewareInstance.createGameMiddleware);

    // Update game route
    router.post('/updateGame', adminMiddlewareInstance.updateGameMiddleware);

    // Delete game route
    router.post('/deleteGame', adminMiddlewareInstance.deleteGameMiddleware);

    // Create game event route
    router.post('/createEvent', adminMiddlewareInstance.createGameEventMiddleware);

    // Delete game event route
    router.post('/deleteEvent', adminMiddlewareInstance.deleteGameEventMiddleware); 
    
    
    return router;
}

