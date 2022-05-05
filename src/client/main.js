const socket = io.connect("http://localhost:3000")

const formMsg = document.querySelector("#form-msg");
const formLogin = document.querySelector("#form-login");
let username = ""

formMsg.classList += " d-none"


//El cliente escucha al servidor
socket.on("server:loadMessages", (messages) => {
    printMessages(messages);
})
socket.on("server:loginError", () => {
    console.log("This username is not available")
})

socket.on("server:loginSuccess", (user) => {
    formMsg.classList.remove("d-none")
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
    chat.innerHTML = "";
    messages.forEach((msg, index) => {
        if(msg.author.username !== username){
            let li = document.createElement("li");
            li.classList = "list-group-item"
            li.innerHTML = `<strong>${msg.author.username}:</strong> ${msg.content}`
            chat.append(li);
        }else{
            let li = document.createElement("li");
            li.classList = "list-group-item d-flex justify-content-end"
            li.innerHTML = `${msg.content}`
            chat.append(li);
        }
    });
}