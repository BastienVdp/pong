const {
	createRoom,
	joinUserToRoom,
	isRoomAvailable,
	joinUserToQueue
} = require('./functions.js')
const {removeUserToQueue} = require("./functions");

module.exports = handleRoom = (client, io, room, queue) => {


	client.on('getRoomData', (id) => {
		io.emit("room:data", room[0])
	})

	client.on('getQueueData', () => {
		io.emit("queue:data", queue)
	})

	client.on('game:finished', (id) => {
		room.pop()
		io.emit('game:finished');
		io.to('queue').emit('room:isAvailable', queue)
		console.log(room, 'game is finished')
	})


	client.on('room:joinFromQueue', player => {
		let _room;
		if(!room.length) { // Pas de room on en crée une
			client.leave('queue')
			const { createdRoom } = createRoom(player[0], room);
			client.join(createdRoom.id)
			_room = createdRoom;
		} else {
			client.leave('queue')
			const { joignedRoom } = joinUserToRoom(player[1], room[0]);
			client.join(joignedRoom.id)
			_room = joignedRoom;
			// io.to('queue').emit('queue:update', {_newPlayers, _newQueue})
		}
		io.to(client.id).emit('room:go-to-controller', {
			room: _room.id,
			players: _room.players,
		})

		if(room[0].players.length === 2) {
			queue.slice(0, 2)
			console.log(queue, 'queue updated')
			io.to('queue').emit('queue:update', { players: player, queue })
		}
	})

	client.on('controller:up', (roomId, playerId) => {
		console.log('player: ', playerId, 'pressed on UP')
	})
	client.on('controller:down', (roomId, playerId) => {
		console.log('player: ', playerId, 'pressed on UP')
	})

	client.on('onPlayerConnected', (player, callback) => {
		if(room.length === 0) { // No room
			const { createdRoom } = createRoom({ id: client.id, ...player}, room)
			client.join(createdRoom.id)
			io.to(createdRoom.id).emit('room:created', {
				room: createdRoom.id,
				players: createdRoom.players,
			})
		} else {
			const uniqueRoom = room[0]
			if(isRoomAvailable(uniqueRoom)) { // 1 player in the room
				// if(uniqueRoom.id !== roomId) return callback('Room id is incorrect')

				const { error, joignedRoom } = joinUserToRoom({ id: client.id, ...player}, uniqueRoom)
				if(error) return callback(error)

				io.emit('game:created', { room: joignedRoom})
				client.join(joignedRoom.id)

				io.to(joignedRoom.id).emit('room:join', {
					room: joignedRoom.id,
					players: joignedRoom.players
				})
			} else { // Room not available
				const { error, newQueue } = joinUserToQueue({ id: client.id, ...player}, queue)
				if(error) callback(error)

				client.join('queue')
				io.to('queue').emit('queue:join', {
					queue: newQueue
				})
			}
		}

		// if(getAvailableRooms(rooms).length) { // if there are available rooms
		// 	const { error, room } = joinUserToRoom(getAvailableRooms(rooms)[0].id, { id: client.id, ...player}, rooms)
		// 	if(error) return callback(error)
		//
		// 	io.emit('player:join', {
		// 		room: room.id,
		// 	})
		// 	client.join(room.id)
		// 	io.to(room.id).emit('room:data', {
		// 		room: room.id,
		// 		players: room.players,
		// 		currentUser: player.id
		// 	})
		// 	io.to(room.id).emit('game:start', {})
		// }
		// else { // no avaible rooms : create room
		// 	const { error, room} = createRoom(roomId,{ id: client.id, ...player}, rooms);
		// 	if(error) return callback(error)
		//
		// 	client.join(room.id)
		// 	io.to(room.id).emit('room:data', {
		// 		room: room.id,
		// 		players: room.players,
		// 		currentUser: player.id
		// 	})
		// }
		callback()
	})
}