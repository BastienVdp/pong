import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

export default function ConnectPage({ props, socket }) {

	const navigate = useNavigate();
	const [username, setUsername] = useState('')

	const handleCreateRoom = () => {
		if(!username) return console.log('Please enter a username');

		socket.emit('handleRoom', { username }, (error => {
			if(error) return console.log(error)
		}))
	}

	useEffect(() => {
		socket.on('roomData', data => navigate(`/room/${data.room}`))
		return () => socket.off('roomData')
	}, [])
	
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
