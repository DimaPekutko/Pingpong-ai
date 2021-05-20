const io = require("socket.io-client");

module.exports = class ClientSocket {
    constructor(userName) {
        this._playerRole = null;
        this._userName = userName;
        this._roomName = null;
        this._socket = io.connect(window.location.origin,{query:`username=${userName}`});
    }
    onStartGame(callback) {
        this._socket.on("start_game", (data)=>{
            this._playerRole = data.role;
            this._roomName = data.roomName;
            callback(this._playerRole);
        });        
    }
    onUpdateRocketPos(callback) {
        this._socket.on("update_rocket_pos", (data)=>{
            callback(data);
        });
    }
    onUpdateBallPos(callback) {
        this._socket.on("update_ball_pos", (data)=>{
            callback(data);
        });
    }
    getSocket() {
        return this._socket;
    }
    getRole() {
        return this._playerRole;
    }
    getRoomName() {
        return this._roomName;
    }
}