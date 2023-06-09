import { Route, Routes } from "react-router-dom"

import io from "socket.io-client"

import Viewer from "./pages/Viewer"
import GamePage from "./components/GamePage"
import ConnectPage from "./pages/ConnectPage"
import {AppProvider} from "./contexts/AppContext";
import Controller from "./components/Controller";
import Queue from "./components/Queue";

export const socket = io("http://192.168.1.9:3001")

function App() {
  return <>
  <AppProvider>
    <Routes>
        <Route path="/viewer" exact element={<Viewer socket={socket}/>} />
        <Route path="/" exact element={<ConnectPage socket={socket}/>} />
    </Routes>
  </AppProvider>

  </>
}

export default App;
