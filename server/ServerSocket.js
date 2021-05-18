module.exports = class ServerSocket {
    constructor(server) {
        this._io = require('socket.io')(server);
        this._io.on('connection', this._onConnection.bind(this));
        this._waitingUsersList = [];
    }
    _onConnection(socket) {
        console.log(
            `New user connected: ${socket.handshake.query.username} ${socket.id}`);

        socket.on('disconnect', ()=>{
            console.log(
                `User disconnected: ${socket.id}`);
            for(let i = 0; i < this._waitingUsersList.length; i++) {
                if(this._waitingUsersList[i].socket.id == socket.id) {
                    this._waitingUsersList.splice(i, 1);
                    break;       
                }
            }
        });

        socket.on("update_rocket_pos", (data)=>{
            this._io.emit("update_rocket_pos", data);
        });

        this._waitingUsersList.push({
            socket: socket,
            userName: socket.handshake.query.username
        });
        if(this._waitingUsersList.length >= 2) 
            this._startGame();
    }
    _startGame() {
        let player1 = this._waitingUsersList.pop().socket;
        let player2 = this._waitingUsersList.pop().socket;
        let roomName = player1.id+player2.id;
        player1.join(roomName);
        player2.join(roomName);
        this._io.to(player1.id).emit("start_game", {role: 1, roomName: roomName});
        this._io.to(player2.id).emit("start_game", {role: 2, roomName: roomName});
        console.log(`New room created: ${roomName}`);
    }
}
