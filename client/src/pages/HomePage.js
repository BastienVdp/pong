import React, {useEffect, useState} from 'react'
import GeneratorQR from '../components/GeneratorQR'
import {useAppContext} from "../contexts/AppContext";
import {useSocketEvents} from "../hooks/useSocketEvents";
import {useNavigate} from "react-router-dom";
import GamePage from "./GamePage";

export default function HomePage({ socket }) {

  const navigate = useNavigate()
  const [gameToken, setGameToken] = useState('')
  const [players, setPlayers] = useState([])
  const events = [
    {
      name: 'game:created',
      callback: (data) => {
        // setGameToken(data.room.id)
        console.log('game created', data.room)
        setGameToken(data.room.id)
        setPlayers(data.room.players)
        // navigate(`/game/${data.room}`)
      }
    },
    {
      name: 'game:finished',
      callback: () => {
        console.log('game is finished')
        // setGameToken('')
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
    {
      name: 'queue:data',
      callback: (data) => {
        console.log('updated q', data)
      }
    }
  ]
  useSocketEvents(events)
  const test = () => {
    socket.emit('getQueueData')
  }
  // useEffect(() => console.log(room), [room])
  return <>
    <button
      onClick={e => test()}
    >get queue data</button>
    {gameToken === '' ?
        <GeneratorQR value={`http://192.168.1.9:3000/connect`} />
    :
        <GamePage socket={socket} gameToken={gameToken} players={players}/>
    }
  </>
}
