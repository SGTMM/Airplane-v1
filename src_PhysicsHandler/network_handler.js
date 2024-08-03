import { io } from "socket.io-client";

const socket = io("ws://localhost:4000");

socket.on("data", (data) => {
    for (const e of physics.bodies) {
        if (e.name === data.id) {
            return
        }
    }
})

socket.on("new player", (id) => {
    admin.addPlayer(id)
})

socket.on("player disconnected", (data) => {
    for (const e of physics.bodies) {
        if (e.name === data) {
            physics.world.removeBody(e)
            physics.bodies.splice(physics.bodies.indexOf(e), 1)
        }
    }
    admin.removePlayer(data)
})

socket.on("updateControls", (data) => {
    physics.updateControls(data)
})

socket.on("raycast", (data) => {
    physics.raycast(data)
})

window.io = io
window.socket = socket
