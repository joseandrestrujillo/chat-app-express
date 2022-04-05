import express from "express";
import {Server as WebSocketServer, Socket} from "socket.io";
import http from "http"

//Creamos la configuracion de express
const app = express()
//Creamos un modulo http, un servidor
const server = http.createServer(app)
//Creamos el websocket con el servidor
const io = new WebSocketServer(server)

//El servidor sirve el contenido del cliente
app.use(express.static(__dirname + "/client"))


io.on("connection", (socket) => {
    console.log("nueva conexion:", socket.id)

    //Enviamos información al cliente
    socket.emit("ping")

    //Escuchamos al cliente
    socket.on("pong", () => {
        console.log("pong")
    })
})

//Inicia el servidor en el puerto 3000
server.listen(3000)
console.log("Server on port", 3000)