import { createContext, useContext, useState } from "react";
import {useSocketEvents} from "../hooks/useSocketEvents";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {

    const [rooms, setRooms] = useState([])
    const [room, setRoom] = useState([])
    const [players, setPlayers] = useState([])

    // const events = [
    //     {
    //         name: 'room:data',
    //         callback: (data) => {
    //             setPlayers(data.players)
    //         }
    //     }
    // ]
    //
    // useSocketEvents(events)

    return (
        <AppContext.Provider value={{
            rooms, setRooms,
            room, setRoom,
            players, setPlayers,
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext)
