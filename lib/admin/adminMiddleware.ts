import { Request, Response, NextFunction } from 'express';
import {Admin} from './admin.js';
import { IGameAndEventsManagerFactory, IGameEvent } from '../../types/lib/gamesManagement/game.js';

export class AdminMiddleware {
    private static adminMiddlewareInstance : AdminMiddleware | null = null;
    private adminInstance: Admin;
    private constructor(gameAndEventsManagerFactory : IGameAndEventsManagerFactory) {
        this.adminInstance = Admin.getInstance(gameAndEventsManagerFactory);
    } 

    public static getInstance(gameAndEventsManagerFactory : IGameAndEventsManagerFactory){
        if(!this.adminMiddlewareInstance)
        {
            this.adminMiddlewareInstance = new AdminMiddleware(gameAndEventsManagerFactory);
        }
        return this.adminMiddlewareInstance;
     }

    public createGameEventMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        if (req.user) {
            const gameId = req.body.gameId;
            const prizepool = req.body.prizepool;
            const fee = req.body.fee;
            const eventDateTime = req.body.eventDateTime
            
            const gameEvent: IGameEvent | undefined = await this.adminInstance.createGameEvent(req.user, gameId, prizepool, eventDateTime, fee);
            
            if (gameEvent) {

                const result = {
                    eventId : gameEvent.eventId,
                    totalPlayersRegistered : gameEvent.players.size,
                    game : gameEvent.game,
                    eventStatus : gameEvent.eventStatus,
                    prizepool : gameEvent.prizepool,
                    fee : gameEvent.fee,
                    eventDateTime : gameEvent.eventDateTime
                }
                res.json(result);
            } else {
                res.json({message:  "Invalid game ID!"});
            }
            next();
        } else {
            res.status(401).send('Unauthorized');
        }
    }

    
    public createGameMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        if(req.user && req.body.name !== undefined 
            && req.body.type !== undefined && req.body.maxTeams !== undefined 
            && req.body.maxTeamMembers !== undefined){
                try{
                    let base64Image = req.body.imageBanner
                    if(req.body.imageBanner)
                    {
                        base64Image = req.body.imageBanner.replace(/^data:image\/\w+;base64,/, "");
                    }
                    await this.adminInstance.createGame(req.user, req.body.name, req.body.type, 
                                                        req.body.modeName, req.body.maxTeamMembers, 
                                                        req.body.maxTeams, Buffer.from(base64Image, 'base64'));
                    res.json({success: true});
                } catch(err) {
                    console.error(err);
                    res.status(500).send('Error creating game');
                }
        } else  {
            res.status(400).send('Missing required parameters');    // 400 for bad request
        }
    };

    public getGamesMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        if(req.user){
                try{
                    const games = this.adminInstance.getGames(req.user);
                    res.json(games);
                } catch(err) {
                    console.error(err);
                    res.status(500).send('Error getting games');
                }
        } else  {
            res.status(400).send('Missing required parameters');    // 400 for bad request
        }
    };
    
    public updateGameMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        if((req.user?.admin && req.body.targetGameId) || (req.user?.admin && Object.keys(req.body).length > 1)){  // only admin can update all fields
            try{
                await this.adminInstance.updateGame(req.user, req.body.targetGameId, 
                                                    req.body.name, req.body.type, 
                                                    req.body.modeName, req.body.maxTeamMembers, 
                                                    req.body.maxTeams, req.body.imageBanner);
                res.json({success: true});
            } catch(err) {
                console.error(err);
                res.status(500).send('Error updating game');
            }
        } else  {
            res.status(401).send('Unauthorized');     // 401 for Unauthorized, unless only admin is changing all fields
        }
    };
    
    public deleteGameMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        if(req.user?.admin && req.body.targetGameId){     // only admin can delete a game
            try{
                await this.adminInstance.deleteGame(req.user, req.body.targetGameId);
                res.json({success: true});
            } catch(err) {
                console.error(err);
                res.status(500).send('Error deleting game');
            }
        } else  {
            res.status(401).send('Unauthorized');     // 401 for Unauthorized, unless only admin is deleting a game
        }
    };
    
    public deleteGameEventMiddleware = async (req: Request, res: Response, next: NextFunction) => {
        if(req.user?.admin && req.body.eventId){     // only admin can delete an event
            try{
                await this.adminInstance.deleteEvent(req.user, req.body.eventId);
                res.json({success: true});
            } catch(err) {
                console.error(err);
                res.status(500).send('Error deleting event');
            }
        } else  {
            res.status(401).send('Unauthorized');     // 401 for Unauthorized, unless only admin is deleting an event
        }
    };
}