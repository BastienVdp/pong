import {useSocketEvents} from "../hooks/useSocketEvents";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function Queue({ socket, playersInQueue, setPlayersInQueue })
{
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