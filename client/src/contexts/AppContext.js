import { createContext, useContext, useState } from "react";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
    const [rooms, setRooms] = useState([])
    const [room, setRoom] = useState([])
    const [players, setPlayers] = useState([])
    return (
        <AppContext.Provider value={{
            rooms, setRooms,
            room, setRoom,
            players, setPlayers
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => useContext(AppContext)
