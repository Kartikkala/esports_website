import express from 'express';
import { IGameAndEventsManagerFactory } from '../types/lib/gamesManagement/game';
// Assuming AdminMiddleware is imported correctly

export default function EventRegistrationRouter(gameAndEventsManagerFactory : IGameAndEventsManagerFactory)
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

    router.get("/registerForEvent/:eventId", (req, res)=>{
        // Use inbuild money class
    })
    
    return router;
}

