const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');


app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    }
});

io.on('connection', (socket) => {
    console.log("User connected: " + socket.id);

    socket.on('join_room', (data) => {
        socket.join(data);
        console.log("User joined: " + socket.id + " room " + data);
    })

    socket.on('send_message', (messageData) => {
        socket.to(messageData.room).emit("receive_message", messageData);
        console.log("User sent: " + socket.id + "to " + messageData.room + " message " + messageData.message)
    })

    socket.on('disconnect', () => {
        console.log("User disconnected: " + socket.id);
    })
});

server.listen(3001, () => {
    console.log('Server running on port http://localhost:3001');
})