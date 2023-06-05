import { Route, Routes } from "react-router-dom"

import io from "socket.io-client"

import HomePage from "./pages/HomePage"
import GamePage from "./pages/GamePage"
import ConnectPage from "./pages/ConnectPage"
import {AppProvider} from "./contexts/AppContext";
import Controller from "./components/Controller";

export const socket = io("http://192.168.1.9:3001")

function App() {
  return <>
  <AppProvider>
    <Routes>
        <Route path="/" exact element={<HomePage socket={socket}/>} />
        <Route path="/controller/:roomId/:userId" element={<Controller socket={socket} />} />
        <Route path="/game/:roomId" element={<GamePage socket={socket}/>} />
        <Route path="/connect" element={<ConnectPage socket={socket}/>} />
    </Routes>
  </AppProvider>

  </>
}

export default App;
