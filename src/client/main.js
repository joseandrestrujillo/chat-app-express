const socket = io.connect("http://localhost:3000")

const formMsg = document.querySelector("#form-msg");
const formLogin = document.querySelector("#form-login");
let username = ""

formMsg.style.display = "none"


//El cliente escucha al servidor
socket.on("server:loadMessages", (messages) => {
    printMessages(messages);
})
socket.on("server:loginError", () => {
    console.log("This username is not available")
})

socket.on("server:loginSuccess", (user) => {
    formMsg.style.display = "block"
    formLogin.style.display = "none"
    username = user
    let h2 = document.querySelector("h2")
    h2.innerText = `Usuario: ${username}`
})


formMsg.addEventListener("submit", (e) => {
    e.preventDefault();
    let msg = document.querySelector("#message-text").value;
    socket.emit("client:newMessage", msg, username);
    document.querySelector("#message-text").value = ""
})

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();
    let username = document.querySelector("#username-text").value;
    socket.emit("client:tryLogin", username);
    document.querySelector("#username-text").value = ""
})

function printMessages(messages){
    const chat = document.querySelector("#chat");
    console.log(messages)
    chat.innerHTML = "";
    messages.forEach((msg, index) => {
        let li = document.createElement("li");
        li.innerHTML = `<strong>${msg.author.username}:</strong> ${msg.content}`
        chat.append(li);
    });
}