import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function GamePage({ socket }) {
  
  const currentPlayer = useRef('')
  const roomRef = useRef()

  const [players, setPlayers] = useState(null)

  useEffect(() => {
    socket.on('roomData', (data) => {
      console.log('roomData', data);
      roomRef.current = data.room
      setPlayers(data.players)
      
    })
  }, [])

 
  // if(!room.players) return <div>loading...</div>
  return <div>
	  <div>game</div>
    <h2>{players && players[0].username}</h2>
    <h2>{players && players[1].username}</h2>
    {/* {room.players.map(player => <div key={player.id}>{player.username}</div>)} */}
  </div>
}
