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

        socket.on("hand_loaded", (data)=>{
            let rooms = socket.adapter.sids.get(socket.id);
            for (let room of rooms) {
                if(room != socket.id) 
                    return this._io.to(room).emit("hand_loaded", data);
            }
        });

        socket.on("start_game", (data)=>{
            let rooms = socket.adapter.sids.get(socket.id);
            for (let room of rooms) {
                if(room != socket.id) 
                    return this._io.to(room).emit("start_game", data);
            }
        });

        socket.on("stop_game", (data)=>{
            let rooms = socket.adapter.sids.get(socket.id);
            for (let room of rooms) {
                if(room != socket.id) 
                    return this._io.to(room).emit("stop_game", data);
            }
        });

        socket.on("update_rocket_pos", (data)=>{
            let rooms = socket.adapter.sids.get(socket.id);
            for (let room of rooms) {
                if(room != socket.id) 
                    return this._io.to(room).emit("update_rocket_pos", data);
            }
        });

        socket.on("update_ball_pos", (data)=>{
            let rooms = socket.adapter.sids.get(socket.id);
            for (let room of rooms) {
                if(room != socket.id) 
                    return this._io.to(room).emit("update_ball_pos", data);
            }
        });

        socket.on("update_score", (data)=>{
            let rooms = socket.adapter.sids.get(socket.id);
            for (let room of rooms) {
                if(room != socket.id) 
                    return this._io.to(room).emit("update_score", data);
            }
        });

        socket.on("finish_game", (data)=>{
            let rooms = socket.adapter.sids.get(socket.id);
            for (let room of rooms) {
                if(room != socket.id) {
                    this._io.to(room).emit("finish_game", data);
                    let roomSocketsIds = this._io.sockets.adapter.rooms.get(room);
                    for(let socketId of roomSocketsIds) {
                        let roomSocket = this._io.sockets.sockets.get(socketId)                        
                        roomSocket.leave(room);
                    }
                    return console.log(`Room deleted ${room}`); 
                }
            }
        });

        this._waitingUsersList.push({
            socket: socket,
            userName: socket.handshake.query.username
        });
        if(this._waitingUsersList.length >= 2) 
            this._createGame();
    }
    _createGame() {
        let player1 = this._waitingUsersList.shift();
        let player2 = this._waitingUsersList.shift();
        let roomName = player1.socket.id+player2.socket.id;
        player1.socket.join(roomName);
        player2.socket.join(roomName);
        this._io.to(player1.socket.id).emit("create_game", {
            role: 1,
            roomName: roomName,
            opponentData: {
                id: player2.socket.id,
                userName: player2.userName,
                role: 2
            }
        });
        this._io.to(player2.socket.id).emit("create_game", {
            role: 2, 
            roomName: roomName,
            opponentData: {
                id: player1.socket.id,
                userName: player1.userName,
                role: 1
            }
        });
        console.log(`New room created: ${roomName}`);
    }
}
