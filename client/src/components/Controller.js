import {useNavigate, useParams} from "react-router-dom";
import {useSocketEvents} from "../hooks/useSocketEvents";
import {useState} from "react";

export default function Controller({socket, gameToken, player})
{
    const navigate = useNavigate()

    const [gameDone, setGameDone] = useState(false)

    const goUp = () => {
        socket.emit('controller:up', gameToken, player.id)
    }

    const goDown = () => {
        socket.emit('controller:down', gameToken, player.id)
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
                roomId : {gameToken} <br/>
                username : {player.username}<br/>
                userId: {player.id}<br />
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