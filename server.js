const express = require('express');
const http = require('node:http');
//const https = require("https");
const { Server } = require('socket.io');
const fs = require("fs");
const path = require("path");

const options = {
    key: fs.readFileSync(path.join(__dirname, "localhost-key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "localhost.pem"))
};

const app = express();
const server = http/* s */.createServer(/* options, */ app);
const io = new Server(server, {
    cors: {
        methods: ["GET", "POST"],
    }
});

app.get('/', (req, res) => {
});

var game_data;

io.on('connection', (socket) => {
    console.log('a user connected');
    //console.log(socket.id)
    socket.emit("id config", socket.id)
    socket.broadcast.emit("new player", socket.id)

    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit("player disconnected", socket.id)
    });

    socket.on("data", (obj) => {
        socket.broadcast.emit("data", obj)
        //console.log(obj)
    })

    socket.on("update", (obj) => {
        socket.broadcast.emit("update", obj)
        //console.log(obj)
    })

    socket.on("add Plane", (obj) => {
        socket.broadcast.emit("add Plane", obj)
    })

    socket.on("spawn bullet", (obj) => {
        socket.broadcast.emit("spawn bullet", obj)
    })

    socket.on("start game", (data) => {
        socket.broadcast.emit("start game", data)
    })

    socket.on("updateControls", (obj) => {
        socket.broadcast.emit("updateControls", obj)
    })

    socket.on("hit", (data) => {
        socket.broadcast.emit("hit", data)
    })

    socket.on("raycast", (data) => {
        socket.broadcast.emit("raycast", (data))
    })
});

server.listen(4000, () => {
    console.log('server running at http://localhost:4000');
});