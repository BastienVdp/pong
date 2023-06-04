/**
 * The function returns an array of rooms that have only one player.
 * @param rooms - The `rooms` parameter is an array of objects representing different rooms in a game.
 * Each object has a `players` property which is an array of players currently in that room. The
 * `getAvailableRooms` function filters this array and returns only the rooms where there is only one
 * player present.
 * @returns The function `getAvailableRooms` takes an array of `rooms` as input and returns a new array
 * containing only the rooms that have exactly one player in them.
 */
const getAvailableRooms = (rooms) => {
    return rooms.filter(room => room.players.length === 1)
}

/**
 * The function joins a player to a room if there is space and returns an error message if the room is
 * full or the username is taken.
 * @param room - The name of the room that the player wants to join.
 * @param player - The player parameter is an object that represents a player. It likely has properties
 * such as a username, score, and other relevant information about the player.
 * @param rooms - An array of objects representing different rooms. Each object has a "name" property
 * (string) and a "players" property (array of objects representing players in the room).
 * @returns The function `joinUserToRoom` returns an object with the existing room information if the
 * room is not full and the player can be added to the room. If the room is full or the player's
 * username is already taken, it returns an error object.
 */
const joinUserToRoom = (room, player, rooms) => {
    const existingRoom = rooms.find((r) => r.id === room)
    if (existingRoom && existingRoom.players.length === 1) {
        if (existingRoom.players[0].username === player.username) return {error: 'Username is taken.'}
        else existingRoom.players.push(player)
    } else return {error: 'Room is full.'}
    return { room: existingRoom }
}

const getRoomById = (id, rooms) => {
    const room = rooms.find(r => r.id === id)
    if(!room) return { error: 'Room not found' }
    return { room }
}
/**
 * The function creates a new room with a player and returns the room object, or an error if the room
 * already exists.
 * @param room - The name of the room that the player wants to create.
 * @param player - The player parameter is the name or identifier of the player who wants to create a
 * new room.
 * @param rooms - An array of objects representing existing rooms. Each object has a "name" property
 * representing the name of the room, and a "players" property representing an array of players
 * currently in the room.
 * @returns The function `createRoom` returns the current room object if the room is successfully
 * created, and an error object if the room already exists.
 */
const createRoom = (player, rooms) => {
    let id = (Math.random() + 1).toString(36).substring(7)

    if(rooms.find(r => r.id === id)) return { error: 'Room already exists' }
    rooms.push({id, players: [player]})

    const currentRoom = rooms.find(r => r.id === id)
    return { room: currentRoom }
}

module.exports = { createRoom, joinUserToRoom, getAvailableRooms, getRoomById}