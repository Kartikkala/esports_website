import GameEventModel from './models.js'; 
import { IGameEventDocument, IGameEventsDatabase } from '../../../types/lib/db/GameEvents/types.js';
import { IGameEvent } from '../../../types/lib/gamesManagement/game.js';
import { Model, Types } from 'mongoose';
import { IDatabase } from '../../../types/lib/db/UserMangement/types.js';
import { IGame } from '../../../types/lib/gamesManagement/game.js';

export class GameEventsDatabase implements IGameEventsDatabase{
    private gameEventCollection: Model<IGameEventDocument>;
    private database: IDatabase;
    
    constructor(database: IDatabase, eventCollectionName: string) {
        if(!database){
            throw new Error("Mongoose database object missing");
        }
        this.database = database;
        this.gameEventCollection = GameEventModel(database, eventCollectionName);
    }
    
    async getGameEvents(): Promise<(IGameEventDocument & { game: IGame })[]> {
    const connectionStatus = await this.database.connectToDatabase();
    let result: (IGameEventDocument & { game: IGame })[] = [];
    
    if(connectionStatus)  {
        try{
            // Eagerly populate the 'game' field with game data from Games collection
            result = await this.gameEventCollection.find()
        } catch(e){
            console.error(e);
         }
     }
    return result;
    }

    sanitize(input: string): string {
        // Replace potentially harmful characters with safe alternatives
        return input.replace(/[$.]/g, '');
    }
    
    async createGameEvent(gameEvent: IGameEvent): Promise<boolean> {
        const connectionStatus = await this.database.connectToDatabase();
        if(connectionStatus) {
            try{
                let sanitizedEvent : IGameEventDocument = {
                    eventId : gameEvent.eventId,
                    players : Array.from(gameEvent.players),
                    eventDateTime : String(gameEvent.eventDateTime),
                    gameId : gameEvent.game.gameId,
                    prizepool : gameEvent.prizepool,
                    fee : gameEvent.fee
                };
                await this.gameEventCollection.create(sanitizedEvent);
                return true;
            } catch(e){
                console.error(e);
            }
        }
        
        return false;
    }
    
    async endGameEvent(gameEvent: IGameEvent): Promise<boolean> {
        const connectionStatus = await this.database.connectToDatabase();
        if(connectionStatus) {
            try{
                this.gameEventCollection.deleteOne({eventId : gameEvent.eventId})
                return true;
            } catch(e){
                console.error(e);
            }
        }
        
        return false;
    }
    
    async updatePlayers(gameEventId: string, players: Array<string>): Promise<boolean>  {
        const connectionStatus = await this.database.connectToDatabase();
        
        if (connectionStatus)   {
            try  {
                // Sanitize each player's name before inserting it into the array
                const sanitizedPlayers = players.map(player => this.sanitize(player));
                
                await this.gameEventCollection.updateOne({ eventId: new Types.ObjectId(gameEventId) }, { $set: { players: sanitizedPlayers } }); 
                return true;
             } catch (e)  {
                console.error(e);
            }
        }
        
        return false;
    }
}
