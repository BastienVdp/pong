const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");


const cors = require("cors");
app.use(cors());



const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	}
});


const PORT = 3001;

const handleRoom = require("./utils/rooms");

const rooms = [];

io.on("connect", (socket) => {
	
	handleRoom(socket, io, rooms)
	socket.on("disconnect", () => {
		console.log("user disconnected");
	});
});

server.listen(PORT, () => {
	console.log(`listening on *:${PORT}`);
});