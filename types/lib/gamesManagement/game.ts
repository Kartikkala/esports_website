export interface IGame{
    gameId : string
    name : string
    type : boolean
    maxTeams : number
    maxTeamMembers : number
    imageBanner? : Buffer
    modeName? : string
}

export interface IGameEvent{
    game : IGame,
    eventDateTime : String,
    players: Set<string> ,
    eventStatus : boolean,
    eventId : string,
    prizepool : number,
    fee : number,
    publishRoomID(roomId: string): void,
    changeEventStatus() : boolean,
    addPlayer(email: string): boolean,
    removePlayer(email: string): boolean,
}

export interface IGameManager {
    getAllGames() : Array<IGame>
    createNewGame(name: string, type: boolean, maxTeams?: number, maxTeamMembers?: number, modeName?: string, imageBanner?: Buffer): Promise<boolean>;
    updateGame(targetGameId: string, name?: string, type?: boolean, maxTeams?: number, maxTeamMembers?: number, modeName?: string, imageBanner?: Buffer): Promise<boolean>;
    deleteGame(targetGameId: string): Promise<boolean>;
    getGameWithId(gameId : string) : IGame | undefined
}


export interface IGameAndEventsManagerFactory {
    createEvent(game: IGame, prizepool: number, eventDateTime : string ,fee? : number): Promise<IGameEvent | undefined>;
    getEvent(eventId: string): IGameEvent | undefined;
    deleteEvent(eventId: string): Promise<boolean>;
    getAllEvents() : Array<IGameEvent>,
    registerPlayerForEvent(eventId : string, email : string) : Promise<Boolean>,
    
    getGameWithId(gameId  : string)  : IGame | undefined
    createNewGame(name: string, type: boolean, maxTeams?: number, maxTeamMembers?: number, modeName?: string, imageBanner?: Buffer): Promise<boolean>;
    updateGame(targetGameId: string, name?: string, type?: boolean, maxTeams?: number, maxTeamMembers?: number, modeName?: string, imageBanner?: Buffer): Promise<boolean>;
    deleteGame(targetGameId: string): Promise<boolean>;
    getAllGames() : Array<IGame>
}