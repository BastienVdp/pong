import { useEffect, useRef, useState } from 'react'
import {useLocation, useParams} from 'react-router-dom'
import {useSocketEvents} from "../hooks/useSocketEvents";
import {useAppContext} from "../contexts/AppContext";
import GamePong from "../components/GamePong";

export default function GamePage({ socket }) {

  const { roomId } = useParams()
  const { players, setPlayers } = useAppContext()

  const currentPlayer = useRef('')
  const roomRef = useRef()

  const events = [
    {
      name: 'room:data',
      callback: (data) => {
        setPlayers(data.room.players)
      }
    }
  ]

  useSocketEvents(events)

  useEffect(() => {
    socket.emit('getRoomData', roomId)
  }, [])

  const finishGame = () => {
    socket.emit('game:finished', roomId)
  }

  return <div>
    {players.length < 2 ? <div>Waiting for player...</div>
    : <div>
          {players.map(p => <h2>{p.username}</h2>)}
    </div>}
    <button
      onClick={e => finishGame()}>
      Finish game
    </button>
    <hr />
    {(players.length === 2) && <GamePong />}
  </div>
}
