import { useEffect, useRef, useState } from 'react'
import {useLocation, useParams} from 'react-router-dom'
import {useSocketEvents} from "../hooks/useSocketEvents";
import {useAppContext} from "../contexts/AppContext";

export default function GamePage({ socket }) {

  const { players, setPlayers } = useAppContext()

  const currentPlayer = useRef('')
  const roomRef = useRef()

  const events = [
    {
      name: 'room:data',
      callback: (data) => {
        setPlayers(data.players)
      }
    },
    {
      name: 'game:start',
      callback: () => {
        console.log('game started')
      }
    }
  ]

  useSocketEvents(events)

  return <div>
    {players.length < 2 ? <div>Waiting for player 2...</div>
    : <div>
          {players.map(p => <h2>{p.username}</h2>)}
    </div>}
  </div>
}
