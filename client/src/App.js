import { Route, Routes } from "react-router-dom"

import io from "socket.io-client"

import HomePage from "./pages/HomePage"
import GamePage from "./pages/GamePage"
import ConnectPage from "./pages/ConnectPage"
const socket = io("http://localhost:3001")

function App() {
  return <>
    <Routes>
      <Route path="/" exact element={<HomePage socket={socket}/>} />
      <Route path="/room/:roomId/" element={<GamePage socket={socket}/>} /> {/*:room/:player*/}
      <Route path="/connect" element={<ConnectPage socket={socket}/>} />
    </Routes>

  </>
}

export default App;