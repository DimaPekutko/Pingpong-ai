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
            this._roomName = data.roomName
            console.log(this._socket);
            callback(this._playerRole);
        });        
    }
}