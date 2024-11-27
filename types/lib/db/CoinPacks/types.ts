export interface ICoinPackDocument{
    coins : number,
    price : number
}

export interface ICoinPacksDatabase {
    getCoinPacks(): Promise<ICoinPackDocument[]>;
    createCoinPack(coins: number, price: number): Promise<boolean>;
    deleteCoinPack(id: string): Promise<boolean>;
    updateCoinPack(id: string, coins: number, price: number): Promise<boolean>;
}
