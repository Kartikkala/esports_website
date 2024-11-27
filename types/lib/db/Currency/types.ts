export interface ICurrencyDocument{
    emailId : string,
    totalMoney : number
}

export interface ICurrencyDatabase{
    addCurrencyWithId(amount : number, userEmail : string): Promise<Boolean>,
    deductFromUserAccountByID (amount : number , userEmail : string):Promise <ICurrencyDocument | null>,
    getTotalUserCurrencyById(userEmail :string ) : Promise<ICurrencyDocument | null>,
}