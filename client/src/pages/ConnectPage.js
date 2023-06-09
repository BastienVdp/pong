import { useEffect, useState } from 'react'
import {useNavigate, useParams} from "react-router-dom";
import {useSocketEvents} from "../hooks/useSocketEvents";
import {useAppContext} from "../contexts/AppContext";
import {logDOM} from "@testing-library/react";
import Controller from "../components/Controller";
import Queue from "../components/Queue";
import Welcome from "../components/Welcome";

export default function ConnectPage({ socket }) {

	const navigate = useNavigate();

	const [gameToken, setGameToken] = useState('')
	const [players, setPlayers] = useState([])
	const [isConnected, setIsConnected] = useState(false)
	const [playersInQueue, setPlayersInQueue] = useState([])
	const [isInQueue, setIsInQueue] = useState(false)

	const events = [
		{
			name: 'room:created',
			callback: (data) => {
				console.log('create room')
				setGameToken(data.room)
				setPlayers(data.players)
			}
		},
		{
			name: 'room:join',
			callback: (data) => {
				console.log('join room')
				setGameToken(data.room)
				setPlayers(data.players)
			}
		},
		{
			name: 'room:isAvailable',
			callback: (queue) => {
				console.log('room available')
				if(queue.length >= 2) {
					if(socket.id === queue[0].id || socket.id === queue[1].id) {
						socket.emit('room:joinFromQueue', [queue[0], queue[1]])
					}
				}
			}
		},
		{
		    name: 'room:go-to-controller',
		    callback: (data) => {
				console.log('go to controller')
				console.log(players, data.players)
				setGameToken(data.room)
				setPlayers(data.players)
		        // navigate(`/controller/${data.room}/${socket.id}`)
		    }
		},
		{
			name: 'queue:update',
			callback: (data) => {
				setPlayersInQueue(
					data.queue
				)
			}
		}
	]

	useSocketEvents(events)



	useEffect(() => {
		setIsConnected(
			players.length ? (
				players.some(p => p.id === socket.id)
			) : false
		)
	}, [players])

	useEffect(() => {
		setIsInQueue(
			playersInQueue.length ? (
				playersInQueue.some(p => p.id === socket.id)
			) : false
		)
	}, [playersInQueue])

	return <>
		<div>
			socketId : {socket.id}
		</div>
		{isConnected ? (
			<Controller
				socket={socket}
				gameToken={gameToken}
				player={players?.find(p => p.id === socket.id)}
			/>
		) : isInQueue ? (
			<Queue
				socket={socket}
				playersInQueue={playersInQueue}
			/>
		) : <Welcome socket={socket} /> }

	</>
}