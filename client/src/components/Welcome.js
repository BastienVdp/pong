import {useState} from "react";

export default function Welcome({ socket }) {
    const [username, setUsername] = useState('')

    const handleCreateRoom = () => {
        if(!username) return alert('enter an username')
        socket.emit('onPlayerConnected', { username }, (error => {
            if(error) return alert(error)
        }))
    }

    return <div>
        <h1>Commencez à jouer</h1>
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
        />
        <button onClick={handleCreateRoom}>Create Room</button>
    </div>
}