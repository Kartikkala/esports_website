import CurrencyModel from './models.ts'; 
import { Model } from 'mongoose';
import { IDatabase } from '../../../types/lib/db/UserMangement/types.ts';
import { ICurrencyDocument, ICurrencyDatabase } from '../../../types/lib/db/Currency/types.ts';

export class CurrencyDatabase implements ICurrencyDatabase {
    private currencyCollection: Model<ICurrencyDocument>;
    private database: IDatabase;

    constructor(database: IDatabase, currencyCollectionName: string) {
        if (!database) {
            throw new Error("Mongoose database object missing");
        }
        this.database = database;
        this.currencyCollection = CurrencyModel(database, currencyCollectionName);
    }

    async addCurrencyWithId(amount: number, userEmail: string): Promise<Boolean> {
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }

        if(await this.database.connectToDatabase())
        {
            // Find the user document by email and update its currency amount
            try{
                const response = await this.currencyCollection.findOneAndUpdate(
                    {userEmail: userEmail},
                    {$inc: {'totalMoney': amount}},
                    {new: true}  // return the updated document
                );
                if(response)
                {
                    return true
                }
                else {
                    throw new Error("User not found");
                }
            }
            catch(e){
                console.error(e)
            }
        }
        return false
    }

    async deductFromUserAccountByID(amount: number, userEmail: string): Promise<ICurrencyDocument | null> {
        // Check if amount is valid
        if (amount <= 0) {
            throw new Error("Amount must be greater than 0");
        }
        let result = null
        if(await this.database.connectToDatabase())
        {
            // Find the user document by email and update its currency amount
            result = await this.currencyCollection.findOne({userEmail: userEmail});
            
            if (!result) {
                throw new Error("User not found");
            } else if (result.totalMoney < amount) {
                throw new Error("Insufficient balance, transaction denied");    // Balance cannot go below 0
            } else {
                result = await this.currencyCollection.findOneAndUpdate(
                    {userEmail: userEmail},
                    {$inc: {'totalMoney': -amount}},
                    {new: true}   // return the updated document
                );
            }
        }
        return result;

    }

    async getTotalUserCurrencyById(userEmail: string): Promise<ICurrencyDocument | null> {
        let result = null

        if(await this.database.connectToDatabase())
        {
            try{
                result = await this.currencyCollection.findOne({userEmail: userEmail});
                if (result) {
                    return result;
                } else {
                    throw new Error("User not found");
                }
            }
            catch(e)
            {
                console.error(e)
            }
            
        }
        return result
    }
}
