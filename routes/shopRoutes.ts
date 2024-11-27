import express from 'express';
import MoneyManager from '../lib/moneyManager/moneyManager';

// Assuming AdminMiddleware is imported correctly

export default function ShopRouter(moneyManager : MoneyManager)
{
    const router = express.Router();
    router.use(express.json()); // for parsing application/json


    router.get("/getPacks", async (req, res)=>{
        const packs = await moneyManager.getMoneypacks()
        res.json({
            "packs" : packs
        })
    })
    
    return router;
}

