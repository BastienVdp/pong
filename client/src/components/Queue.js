import {useSocketEvents} from "../hooks/useSocketEvents";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Queue({ socket })
{
    const navigate = useNavigate()
    const [playersInQueue, setPlayersInQueue] = useState([])
    const events = [
        {
            name: 'queue:data',
            callback: (queue) => {
                console.log('fetch queue data', queue)
                setPlayersInQueue(queue)
            }
        },
        {
            name: 'queue:left',
            callback: (queue) => {
                console.log(queue)
                setPlayersInQueue(
                    queue
                )
            }
        },
        {
            name: 'room:isAvailable',
            callback: (queue) => {
                if(queue.length >= 2) {
                    if(socket.id === queue[0].id || socket.id === queue[1].id) {
                        socket.emit('room:joinFromQueue', [queue[0], queue[1]])
                        console.log('room is available', queue.find(q => q.id === socket.id))
                    }
                }
            }
        },
        {
            name: 'room:go-to-controller',
            callback: (data) => {
                if(data.players.length === 1) {
                    if(socket.id == data.players[0].id) {
                        navigate(`/controller/${data.room}/${data.players[0].id}`)
                    }
                } else if(data.players.length === 2) {
                    if(socket.id === data.players[1].id) {
                        navigate(`/controller/${data.room}/${data.players[1].id}`)
                    }
                }
                console.log('go to controller', data)
            }
        },
        {
            name: 'queue:update',
            callback: (data) => {
                console.log('queue updated', data)
                let updatedQueue = [];
                setPlayersInQueue(
                    data.queue.filter(q => {
                        return !data.players.some((player) => {
                            return player.id === q.id && player.username === q.username;
                        })
                    })
                )
                // data.queue.forEach(playerQ => {
                //     data.players.forEach(p => {
                //         if(playerQ.id !== p.id) {
                //             console.log(playerQ)
                //         }
                //     })
                // })
                // setPlayersInQueue(updatedQueue)
                // data.players.forEach()
                // setPlayersInQueue(
                //
                // )
                // console.log('players in queue:', playersInQueue)
                // console.log('data receive:', data)
                // const updatedQueue = data._newQueue.filter(player => player.id !== data._newPlayers[0].id)
                // setPlayersInQueue(data)
            }
        }
    ]

    useSocketEvents(events)

    useEffect(() => {
        socket.emit('getQueueData')
    }, [])
    return (
        <div>
            Queue | socket: {socket.id}
            <hr />
            {playersInQueue.length && <div>
                <h2>Joueurs dans la file d'attente : </h2>
                {playersInQueue.map(player => (
                    <span key={player.id}>{player.username} | {player.id} <br/></span>
                ))}
            </div>}
        </div>
    )
}