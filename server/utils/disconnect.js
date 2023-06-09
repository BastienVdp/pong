const {
    checkIfUserInQueue,
    checkIfUserInRoom,
    removeUserToQueue
} = require('./functions.js')
module.exports = handleDisconnect = (client, io, room, queue) => {
    if(room.length > 0) {
        const uniqueRoom = room[0]
        if(checkIfUserInQueue(client.id, queue)) {
            const { newQueue } = removeUserToQueue(client.id, queue)
            io.emit('queue:left', newQueue)
            client.leave('queue')

        } else if(checkIfUserInRoom(client.id, uniqueRoom)) {
            io.emit('room:left')
            // client.leave(room)
        }
    }
    console.log("handle disconnect", client.id)
}
