import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import {useSocketEvents} from "../hooks/useSocketEvents";
import {useAppContext} from "../contexts/AppContext";

export default function ConnectPage({ socket }) {

	const { setRoom, setPlayers } = useAppContext()
	const navigate = useNavigate();
	const [username, setUsername] = useState('')

	const events = [
		{
			name: 'room:data',
			callback: (data) => {
				setRoom(data.room)
				setPlayers(data.players)
				navigate(`/controller/${data.room}/${socket.id}`)
			}
		}
	]

	useSocketEvents(events)
	const handleCreateRoom = () => {
		if(!username) return alert('enter an username')
		socket.emit('handleRoom', { username }, (error => {
			if(error) return alert(error)
		}))
	}
	
	return <>
		<h1>Commencez à jouer</h1>
		<input 
			type="text" 
			placeholder="Username"
			value={username} 
			onChange={e => setUsername(e.target.value)} 
		/>
		<button onClick={handleCreateRoom}>Create Room</button>
	</>
}
