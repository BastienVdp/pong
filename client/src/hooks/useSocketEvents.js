import { useEffect } from "react";
import { socket } from '../App.js'

export function useSocketEvents(events)
{
    useEffect(() => {
        for(const event of events) {
            socket.on(event.name, event.callback)
        }

        return () => {
            for(const event of events) {
                socket.off(event.name, event.callback)
            }
        }
    }, [])
}