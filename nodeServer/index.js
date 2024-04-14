// Node Server that will handle all socket.io connections

const io = require('socket.io')(8000, {
  cors: {
    origin: '*',
  }
})
const users = [];

io.on('connection', socket=>{
  socket.on('new-user-joined', ({userName, roomName}) =>{
    //console.log(name)
    socket.join(roomName)
    users[socket.id] = {name: userName, room: roomName};
    socket.broadcast.to(roomName).emit('user-joined', {userName, roomName})
    socket.emit('user-joined', {userName: "You", roomName})
  })

  socket.on('send', message =>{
    socket.broadcast.to(users[socket.id].room).emit('recieve', {message: message, name: users[socket.id].name})
  })

  socket.on("typing", () => { 
    socket.broadcast.to(users[socket.id].room).emit("notifyTyping", { message: "is Typing...", name: users[socket.id].name }); 
  }); 

  socket.on("stopTyping", () => { 
    socket.broadcast.to(users[socket.id].room).emit("notifyStopTyping", ""); 
  }); 

  socket.on('disconnect', message =>{
    let name = users[socket.id]?.name, room = users[socket.id]?.room;
    socket.broadcast.to(room).emit('left', name);
    // delete users[socket.id]
  })
})