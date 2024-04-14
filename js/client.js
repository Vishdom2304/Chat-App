const socket = io('http://localhost:8000');

const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
const typing = document.getElementById('typing')
const messageContainer = document.querySelector('.chatArea')
var audio = new Audio('message_sound.mp3')

const append = (message, position) =>{
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if(position == 'left'){
    audio.play();
  }
}

let userName;
do {
  userName = prompt('Enter your name to join');
} while (!userName.trim());

let roomName;
do {
  roomName = prompt('Enter the room name to join');
} while (!roomName.trim());

socket.emit('new-user-joined', {userName, roomName});

socket.on('user-joined', ({userName, roomName}) =>{
  //console.log(name);
  append(`${userName} joined the chat ${roomName}`, 'center');
})

socket.on('recieve', data =>{
  append(`${data.name}: ${data.message}`, 'left')
})

socket.on('left', name =>{
  append(`${name} left the chat`, 'left')
})

form.addEventListener('submit', (e)=>{
  e.preventDefault()
  const message = messageInput.value
  socket.emit('send', message)
  append(`You: ${message}`, 'right')
  messageInput.value = ''
})

messageInput.addEventListener("keydown", () =>  {
  socket.emit("typing", "");
});
socket.on("notifyTyping", data  =>  {
  typing.innerText  =  data.name  +  "  "  +  data.message;
});
//stop typing
messageInput.addEventListener("keyup", () =>  {
  setTimeout(function() {
    socket.emit("stopTyping", "");
  }, 1000);
});
socket.on("notifyStopTyping", () =>  {
  typing.innerText  =  "";
});
