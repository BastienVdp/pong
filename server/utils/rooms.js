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

	client.on('getRoomData', (id, callback) => {
		const cb = getRoomById(id, rooms)
		if(cb.error) return callback(cb.error)
		return callback(cb.room)
		// io.emit('lastRoom', cb.room)
	})

	client.on('handleRoom', (player, callback) => {
		if(getAvailableRooms(rooms).length) { // if there are available rooms
			const cb = joinUserToRoom(getAvailableRooms(rooms)[0].id, { id: client.id, ...player}, rooms) 
			if(cb.error) return callback(cb.error) 

			client.join(cb.room.id)
			io.to(cb.room.id).emit('roomData', {
				room: cb.room.id,
				players: cb.room.players
			})
		} else { // no avaible rooms
			const cb = createRoom({ id: client.id, ...player}, rooms);
			if(cb.error) return callback(cb.error)

			client.join(cb.room.id)
			io.to(cb.room.id).emit('roomData', {
				room: cb.room.id,
				players: cb.room.players
			})
		}
		callback()
	})
}