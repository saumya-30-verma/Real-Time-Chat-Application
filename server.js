const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000", // Allow React app
    methods: ["GET", "POST"]
  }
});

// Store messages
let messages = [];

io.on('connection', (socket) => {
  console.log('New client connected');

  // Send message history to new clients
  socket.emit('messageHistory', messages);

  // Handle new messages
  socket.on('sendMessage', (message) => {
    const newMsg = {
      ...message,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    messages.push(newMsg);
    io.emit('newMessage', newMsg); // Broadcast to all
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));