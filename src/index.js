import express from "express";
import {Server as WebSocketServer, Socket} from "socket.io";
import http from "http"
import { emit } from "process";

//Creamos la configuracion de express
const app = express()
//Creamos un modulo http, un servidor
const server = http.createServer(app)
//Creamos el websocket con el servidor
const io = new WebSocketServer(server)

let messages = [];
let anonymous = {
    username: "Offline User",
    userId: ""
}

let onlineUsers = [];

class User {
    constructor(user, id){
        this.username = user;
        this.userId = id;
    }
}

class Message{
    constructor(user, msg){
        this.author = user;
        this.content = msg;
    }
}

//El servidor sirve el contenido del cliente
app.use(express.static(__dirname + "/client"))


io.on("connection", (socket) => {
    console.log("nueva conexion:", socket.id)

    //Enviamos información al cliente
    io.emit("server:loadMessages", messages);


    socket.on("client:newMessage", (msg, username) => {
        let user = onlineUsers.find(user => user.username === username)
        let message = new Message(user, msg);
        messages.push(message);
        io.emit("server:loadMessages", messages);
    })

    socket.on("client:tryLogin", (username) => {
        if((onlineUsers.find(user => user.username === username)) === -1){
            socket.emit("server:loginError")
        }else{
            let user = new User(username, socket.id)
            onlineUsers.push(user)
            console.log(user)
            socket.emit("server:loginSuccess", username)
        }
    })

    socket.on("disconnect", () => {
        let index = onlineUsers.findIndex(user => user.userId === socket.id)
        onlineUsers.splice(index, 1);
        messages.map((msg) => {
            if(msg.author.userId === socket.id){
                let newMsg = msg;
                newMsg.author = anonymous
                return newMsg
            }else{
                return msg
            }
        })
        io.emit("server:loadMessages", messages);
    })
})

//Inicia el servidor en el puerto 3000
server.listen(3000)
console.log("Server on port", 3000)