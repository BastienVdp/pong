import {useAppContext} from "../contexts/AppContext";

export default function Controller({socket})
{
    const { room } = useAppContext()
    console.log(room)
    return (
        <div>
            Controller Game :<br />
            roomId : {room} <br/>
            socketId : {socket.id}
        </div>
    )
}