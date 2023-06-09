import React, {useEffect, useState} from 'react'
import GeneratorQR from '../components/GeneratorQR'
import {useAppContext} from "../contexts/AppContext";
import {useSocketEvents} from "../hooks/useSocketEvents";
import {useNavigate} from "react-router-dom";
import GamePage from "../components/GamePage";

export default function Viewer({ socket }) {

  const navigate = useNavigate()

  const [gameToken, setGameToken] = useState('')
  const [players, setPlayers] = useState([])
  const [gameStarted, setGameStarted] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)

  const events = [
    {
      name: 'game:created',
      callback: (data) => {
        setGameFinished(false)
        setGameToken(data.room.id)
        setPlayers(data.room.players)
      }
    },
    {
      name: 'game:finished',
      callback: () => {
        setGameFinished(true)
      }
    },
    {
      name: 'room:newRoomFromQueue',
      callback: (data) => {
        setGameToken(data.room.id)
        setPlayers(data.room.players)
        // console.log(data, 'created from queue')
      }
    },
  ]
  useSocketEvents(events)
  const test = () => {
    socket.emit('getQueueData')
  }
  // useEffect(() => console.log(room), [room])
  return <>
    {gameToken === '' ?
        <GeneratorQR value={`http://192.168.1.9:3000/`} />
    : gameFinished ? (
        <div>The game is finish</div>
    ) : <GamePage socket={socket} gameToken={gameToken} players={players}/>
    }
  </>
}
