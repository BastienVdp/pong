const isRoomAvailable = (room) => {
    return room.players.length === 1
}

const joinUserToQueue = (player, queue) => {
    if(queue.length > 0 && queue.find(q => q.username === player.username)) return { error: 'Username in the queue is already taken' }
    queue.push(player)
    return { newQueue: queue }
}

const joinUserToRoom = (player, room) => {
    if(room.players[0].username === player.username) return { error: 'Username in the room is already taken'}
    if(room.players.length > 1) return { error: 'Room is full'}
    room.players.push(player)
    return { joignedRoom: room }
}

const getRoomById = (id, rooms) => {
    const room = rooms.find(r => r.id === id)
    if(!room) return { error: 'Room not found' }
    return { room }
}

const createRoom = (player, room) => {
    const generatedId = (Math.random() + 1).toString(36).substring(7)
    if(room.length === 0) {
        room.push({
            id: generatedId,
            players: Array.isArray(player) ? player : [player]
        })
        return { createdRoom: room[0] }
    } else return { error: 'You cant create this room' }
}

const checkIfUserInRoom = (id, room) => {
    return room.players.filter(p => p.id === id).length
}

const checkIfUserInQueue = (id, queue) => {
    return queue.filter(q => q.id === id).length
}

const removeUserToQueue = (id, queue) => {
    queue = queue.filter(player => player.id !== id);
    return { newQueue: queue}
}

module.exports = { createRoom, joinUserToRoom, isRoomAvailable, getRoomById, joinUserToQueue, checkIfUserInRoom, checkIfUserInQueue, removeUserToQueue}