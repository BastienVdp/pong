import { useEffect, useState } from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {useSocketEvents} from "../hooks/useSocketEvents";
import {useAppContext} from "../contexts/AppContext";
import {logDOM} from "@testing-library/react";

export default function ConnectPage({ socket }) {

	const navigate = useNavigate();
	const [username, setUsername] = useState('')

	const events = [
		{
			name: 'room:created',
			callback: (data) => {
				console.log('created room', data)
				navigate(`/controller/${data.room}/${socket.id}`)
			}
		},
		{
			name: 'room:join',
			callback: (data) => {
				console.log('joigned room', data)
				navigate(`/controller/${data.room}/${socket.id}`)
			}
		},
		{
			name: 'queue:join',
			callback: (data) => {
				navigate(`/queue`)
			}
		}
	]

	useSocketEvents(events)
	const handleCreateRoom = () => {
		if(!username) return alert('enter an username')
		socket.emit('onPlayerConnected', { username }, (error => {
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
