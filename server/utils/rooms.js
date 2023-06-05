const {
	createRoom,
	joinUserToRoom,
	getAvailableRooms,
	getRoomById
} = require('./functions.js')

module.exports = handleRoom = (client, io, rooms) => {

	client.on('getRooms', () => {
        io.emit("availableRooms", rooms)
    })
	// client.on('getRoomById', ({ roomId }) => {
	//
	// 	io.emit('getRoomId', getRoomById(roomId, rooms), rooms)
	// })

	client.on('handleRoom', (player, callback) => {
		if(getAvailableRooms(rooms).length) { // if there are available rooms
			const { error, room } = joinUserToRoom(getAvailableRooms(rooms)[0].id, { id: client.id, ...player}, rooms)
			if(error) return callback(error)

			client.join(room.id)
			io.to(room.id).emit('room:data', {
				room: room.id,
				players: room.players
			})
			io.to(room.id).emit('game:start', {})
		} else { // no avaible rooms : create room
			const { error, room} = createRoom({ id: client.id, ...player}, rooms);
			if(error) return callback(error)

			client.join(room.id)
			io.to(room.id).emit('room:data', {
				room: room.id,
				players: room.players
			})
		}
		callback()
	})
}