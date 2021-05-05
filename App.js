const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const io = require('socket.io')(server);
const { exec } = require("child_process");
const PORT = 3000;

app.use(express.static(path.join(__dirname + '/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
    // res.render('/../index.html')
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
 
  // for testing
  // exec("google-chrome 127.0.0.1:" + PORT);
});
