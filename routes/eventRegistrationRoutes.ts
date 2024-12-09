import express from 'express';
import { IGameAndEventsManagerFactory } from '../types/lib/gamesManagement/game.js';
import MoneyManager from '../lib/moneyManager/moneyManager.js';
// Assuming AdminMiddleware is imported correctly

export default function EventRegistrationRouter(gameAndEventsManagerFactory : IGameAndEventsManagerFactory, moneyManager : MoneyManager)
{
    const router = express.Router();
    router.use(express.json()); // for parsing application/json


    router.get("/events", (req, res)=>{
        if(req.user)
        {
            const events = gameAndEventsManagerFactory.getAllEvents()
            const ongoingEvents = []
            const upcomingEvents = []
            const registeredEvents = []
            for(let i = 0;i<events.length;i++)
            {
                const selectedEvent = events[i]
                const shortenedEvent = {
                    "eventId" : selectedEvent.eventId,
                    "game" : selectedEvent.game,
                    "prizepool" : selectedEvent.prizepool,
                    "fee" : selectedEvent.fee , 
                    "eventDateTime" : selectedEvent.eventDateTime,
                    "totalPlayersRegistered" : selectedEvent.players.size
                }
                if(selectedEvent.eventStatus)
                {
                    ongoingEvents.push(shortenedEvent)
                    selectedEvent.players.has(req.user.email) ? registeredEvents.push(shortenedEvent) : null
                }
                else
                {
                    upcomingEvents.push(shortenedEvent)
                }
            }
            res.json({
                "ongoing" : ongoingEvents,
                "upcoming" : upcomingEvents,
                "registered" : registeredEvents
            })
        }
    })

    router.post("/registerForEvent", async (req, res)=>{
        // Use inbuilt money class
        if(req.user)
        {
            const event = gameAndEventsManagerFactory.getEvent(req.body.eventId)
            if(event && event.addPlayer(req.user.email))
            {
                try{
                    const oldMoney = (await moneyManager.getUserMoney(req.user.email)).totalMoney
                    if(oldMoney < event.fee)
                    {
                        return res.status(401).send("Insufficient Balance!")
                    }

                    const newMoney = (await moneyManager.deductMoney(req.user.email, event.fee))?.totalMoney
                    const result = {
                        success : (oldMoney != newMoney) && (event.players.has(req.user.email)),
                        newMoney : newMoney
                    }

                    res.json(result)
                }
                catch(e : any)
                {
                    res.status(401).send("No wallet recharge!")
                }
            }
            else{
                res.status(500).send("Internal Server Error")
            }
        }
    })
    
    return router;
}

