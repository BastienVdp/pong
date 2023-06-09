import {useNavigate, useParams} from "react-router-dom";
import {useSocketEvents} from "../hooks/useSocketEvents";
import {useState} from "react";

export default function Controller({socket})
{
    const navigate = useNavigate()
    const { roomId, userId } = useParams()

    const [gameDone, setGameDone] = useState(false)
    const goUp = () => {
        socket.emit('controller:up', roomId, userId)
    }

    const goDown = () => {
        socket.emit('controller:down', roomId, userId)
    }

    const events = [
        {
            name: 'game:finished',
            callback: () => {
                // navigate('/')
                setGameDone(true)
            }
        }
    ]

    useSocketEvents(events)

    return <>
        {gameDone ? (
            <div>
                The game is finished
            </div>
        ) : (
            <div>
                Controller Game :<br />
                roomId : {roomId} <br/>
                userId: {userId}<br />
                socketId : {socket.id}<br/>
                <hr />
                <button onClick={e => goUp()}>
                    UP
                </button>
                <button onClick={e => goDown()}>
                    DOWN
                </button>
            </div>
        )
       }
    </>
}