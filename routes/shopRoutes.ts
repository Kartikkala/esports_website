import express from 'express';
import MoneyManager from '../lib/moneyManager/moneyManager.js';

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

    router.post("/buyPack", async(req, res)=>{
        if(req.body && req.body.packId && req.user)
        {
            const result = await moneyManager.buyMoneyPack(req.user.email, req.body.packId)
            return res.json({"success" : result})
        }
        return res.status(400).send("packId parameter missing!")
    })


    router.post("/deletePack", async(req, res)=>{
        // TODO
        res.send(401).send("Do not come here!")
    })
    
    return router;
}

