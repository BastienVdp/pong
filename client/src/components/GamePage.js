import { useEffect, useRef, useState } from 'react'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import {useSocketEvents} from "../hooks/useSocketEvents";
import {useAppContext} from "../contexts/AppContext";
import GamePong from "./GamePong";

export default function GamePage({ socket, gameToken, players }) {

  const navigate = useNavigate()

  const currentPlayer = useRef('')
  const roomRef = useRef()

  const events = [
    {
      name: 'room:left',
      callback: () => {
        console.log('player left')
      }
    },

  ]

  useSocketEvents(events)

  const finishGame = () => {
    socket.emit('game:finished', gameToken)
  }

  return <div>
    <h1>Game: {gameToken}</h1>
    {players.length < 2 ? <div>Waiting for player...</div>
    : <div>
          {players.map(p => <h2 key={p.id}>{p.username}</h2>)}
    </div>}
    <button
      onClick={e => finishGame()}>
      Finish game
    </button>
    <hr />
    {(players.length === 2) && <GamePong />}
  </div>
}
