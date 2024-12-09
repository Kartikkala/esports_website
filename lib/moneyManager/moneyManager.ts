import Razorpay from 'razorpay'
import { ICurrencyDatabase } from "../../types/lib/db/Currency/types.js";
import { ICoinPacksDatabase } from "../../types/lib/db/CoinPacks/types.js";


export default class MoneyManager{
    private currencyDb : ICurrencyDatabase;
    private coinPacksDb : ICoinPacksDatabase;
    private rzp : Razorpay;
    private static _instance : MoneyManager
    private constructor(currencyDatabase : ICurrencyDatabase, coinPacksDatabase : ICoinPacksDatabase, razorPay : Razorpay){
        this.currencyDb = currencyDatabase;
        this.coinPacksDb = coinPacksDatabase;
        this.rzp = razorPay;
    }

    public static getInstance(currencyDatabase : ICurrencyDatabase, coinPacksDatabase : ICoinPacksDatabase, razorPay : Razorpay) // Use users database only to store thier available money, razorpay for payment handling
    {
        if (!this._instance) {
          this._instance = new MoneyManager(currencyDatabase, coinPacksDatabase, razorPay);
        }
        return this._instance;
    }


    public async getUserMoney(email : string) {
        let currency = await this.currencyDb.getTotalUserCurrencyById(email);
        if(!currency){
            throw new Error("No Currency Found");
        }
        return currency;
    }

    public async buyMoneyPack(email : string, moneyPackId : string)
    {
        const packs = await this.coinPacksDb.getCoinPacks()
        for(let i=0;i<packs.length;i++)
        {
            const pack = packs[i]
            if(pack._id.toString() === moneyPackId)
            {

                // ------------------- Use razorpay here ----------------------- //
                return await this.currencyDb.addCurrencyWithId(pack.coins, email)
            }
        }
        return false
    }

    public async createMoneyPack(coins : number, price : number)
    {
        return await this.coinPacksDb.createCoinPack(coins, price)
    }

    public async getMoneypacks()
    {
        return await this.coinPacksDb.getCoinPacks()
    }

    public async deleteMoneyPack(id : string)
    {
        return await this.coinPacksDb.deleteCoinPack(id)
    }

    public async deductMoney(email : string, amount : number)
    {
        return await this.currencyDb.deductFromUserAccountByID(amount, email)
    }

    public async modifyMoneyPack(id : string, newCoinsAmount : number, newPrice : number)
    {
        return await this.coinPacksDb.updateCoinPack(id, newCoinsAmount, newPrice)
    }
}