const socket = io('http://localhost:8000');

const form = document.getElementById('send-container')
const messageInput = document.getElementById('messageInp')
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

const name = prompt('Enter your name to join')
socket.emit('new-user-joined', name);

socket.on('user-joined', name =>{
  //console.log(name);
  append(`${name} joined the chat`, 'left');
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
