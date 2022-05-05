import express from "express";
import {Server as WebSocketServer} from "socket.io";
import http from "http"

//Creamos la configuracion de express
const app = express()
//Creamos un modulo http, un servidor
const server = http.createServer(app)
//Creamos el websocket con el servidor
const io = new WebSocketServer(server)


//Variables para guardar el chat en memoria ram
let messages = [];
let anonymous = {
    username: "Offline User",
    userId: ""
}
let onlineUsers = [];

//Clases necesarias para almacenar los mensajes
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



//El servidor sirve el contenido del cliente: Envia los archivos de la carpeta client donde se encuentra el front
app.use(express.static(__dirname + "/client"))


//Un socket se conecta al servidor
io.on("connection", (socket) => {
    //Mostramos por consola el id del nuevo socket conectado
    console.log("nueva conexion:", socket.id)

    //Enviamos información al nuevo socket conectado con los mensajes
    socket.emit("server:loadMessages", messages);

    //Recibimos un mensaje del socket
    socket.on("client:newMessage", (msg, username) => {
        let user = onlineUsers.find(user => user.username === username)
        let message = new Message(user, msg);
        messages.push(message);
        //Enviamos a TODOS los sockets conectados la nueva informacion con los mensajes
        io.emit("server:loadMessages", messages);
    })

    //Un socket intenta iniciar sesion
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

    //El socket se desconecta
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
        //Enviamos a todos los sockets conectados los mensajes
        io.emit("server:loadMessages", messages);
    })
})

//Inicia el servidor en el puerto 3000
server.listen(3000)
console.log("Server on port", 3000)