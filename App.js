const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const ServerSocket = require('./server/ServerSocket');
const server = http.createServer(app);
const PORT = process.env.PORT || 8080;
let serverSocket;

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// io.on('connection', (socket) => {
//     console.log('a user connected');
//     socket.on('chat message', (message)=>{
//       console.log(message);
//       io.emit('chat message', message);
//     });
// });

server.listen(PORT, () => {
  console.log('Listening on port: ' + PORT);
  serverSocket = new ServerSocket(server);
});
