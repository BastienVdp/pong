const {
	createRoom,
	joinUserToRoom,
	isRoomAvailable,
	joinUserToQueue,
	checkIfUserInQueue,
	removeUserToQueue,
	checkIfUserInRoom
} = require('./utils/functions.js')

module.exports = handleGame = (client, io, room, queue) => {

	client.on('controller:up', (roomId, playerId) => {
		console.log('player: ', playerId, 'pressed on UP')
	})
	client.on('controller:down', (roomId, playerId) => {
		console.log('player: ', playerId, 'pressed on UP')
	})

	/* 
		This code is listening for the 'game:finished' event emitted by the client. 
		When this event is triggered, 
			it removes the last element from the 'room' array, 
			emits a 'game:finished' event to all connected clients, 
			and emits a 'room:isAvailable' event to all clients in the 'queue' with the	updated 'queue' array. 
	*/
	client.on('game:finished', (id) => {
		room.pop()
		io.emit('game:finished');
		io.to('queue').emit('room:isAvailable', queue)
	})
	
	/* 
		This code is listening for the 'room:joinFromQueue' event emitted by the client. 
		When this event is triggered, it checks 
			If there is an available room to join. 
			If there is no room available, 
				it adds the player to the queue. 
			If there is a room available, 
				it joins the player to the room,
				emits a 'game:created' event to all connected clients. 
			If the room is full (2 players join the room), 
				it removes the 2 players from the queue, 
				updates the queue array, 
				emits a 'queue:update' event to all clients in the 'queue' with the updated 'queue' array, 
				emits a 'room:go-to-controller' event to all clients in the room to start the game. 
	*/
	client.on('room:joinFromQueue', players => {
		let _room;
		if(!room.length) { // Pas de room on en crée une
			client.leave('queue')
			const { createdRoom } = createRoom(players[0], room);
			client.join(createdRoom.id)
			_room = createdRoom;
		}
		else {
			client.leave('queue')
			const {joignedRoom} = joinUserToRoom(players[1], room[0]);
			client.join(joignedRoom.id)
			_room = joignedRoom;
		}

		if(room[0].players.length === 2) {
			queue.shift()
			queue.shift()
			queue = [...queue]

			io.to('queue').emit('queue:update', { players: players, queue })
			io.emit('game:created', { room: _room})
			io.to(_room.id).emit('room:go-to-controller', {
				room: _room.id,
				players: _room.players,
			})
		}
	})

	/* 
		This code is listening for the 'onPlayerConnected' event emitted by the client. 
		When this event is triggered, it checks 
			If there is an available room to join. 
			If there is no room available, 
				it creates a new room,
				emits a 'room:created' event to all connected clients. 
			If there is a room available, 
				it joins the player to the room, 
				emits a 'game:created' event to all connected clients,
				emits a 'room:join' event to all clients in the room. 
			If there is no available room, 
				it adds the player to the queue,
				emits a 'queue:join' event to all clients in the 'queue' with the updated 'queue' array. 
		Finally, it calls the callback function. 
	*/
	client.on('onPlayerConnected', (player, callback) => {
		if(room.length === 0) { // No room
			const { createdRoom } = createRoom({ id: client.id, ...player}, room)
			client.join(createdRoom.id)
			io.to(createdRoom.id).emit('room:created', {
				room: createdRoom.id,
				players: createdRoom.players,
			})
		}
		else {
			const uniqueRoom = room[0]
			if(isRoomAvailable(uniqueRoom)) {
				const { error, joignedRoom } = joinUserToRoom({ id: client.id, ...player}, uniqueRoom)
				if(error) return callback(error)

				io.emit('game:created', { room: joignedRoom})
				client.join(joignedRoom.id)

				io.to(joignedRoom.id).emit('room:join', {
					room: joignedRoom.id,
					players: joignedRoom.players
				})
			}
			else { // Room not available
				const { error, newQueue } = joinUserToQueue({ id: client.id, ...player}, queue)
				if(error) return callback(error)

				client.join('queue')
				io.to('queue').emit('queue:update', {
					queue: newQueue
				})
			}
		}
		callback()
	})

	client.on("disconnect", () => {
		if(room.length > 0) {
			const uniqueRoom = room[0]
			if(checkIfUserInQueue(client.id, queue)) {
				const { newQueue } = removeUserToQueue(client.id, queue)
				queue.length = 0
				queue.push(...newQueue)
				io.to('queue').emit('queue:update', {
					queue
				})
				client.leave('queue')

			} else if(checkIfUserInRoom(client.id, uniqueRoom)) {
				io.emit('room:left')
				client.leave(room[0].id)
			}
		}
		console.log("handle disconnect", client.id)
	});
}