const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");


const cors = require("cors");
app.use(cors());



const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000", "http://192.168.1.9:3000"],
		methods: ["GET", "POST"],
	}
});


const PORT = 3001;

const handleGame = require("./app/game");
const queue = [];

const room = []

io.on("connect", (socket) => {
	console.log("user connected : ", socket.id)
	handleGame(socket, io, room, queue)
});

server.listen(PORT, () => {
	console.log(`listening on *:${PORT}`);
});