const socket = io("http://localhost:3000")

//El cliente escucha al servidor
socket.on("ping", () => {
    socket.emit("pong")
})
