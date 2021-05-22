const io = require("socket.io-client");

module.exports = class ClientSocket {
    constructor(userName) {
        this._playerRole = null;
        this._userName = userName;
        this._opponentData = null;
        this._socket = io.connect(window.location.origin,{query:`username=${userName}`});
    }
    onCreateGame(callback) {
        this._socket.on("create_game", (data)=>{
            this._playerRole = data.role;
            this._opponentData = data.opponentData
            callback(this._playerRole);
        });        
    }
    onStartGame(callback) {
        this._socket.on("start_game", (data)=>{
            callback(data);
        });
    }
    onStopGame(callback) {
        this._socket.on("stop_game", (data)=>{
            callback(data);
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
    onUpdateScore(callback) {
        this._socket.on("update_score", (data)=>{
            callback(data);
        });
    }
    onFinishGame(callback) {
        this._socket.on("finish_game", (data)=>{
            callback(data);
        });
    }
    getSocket() {
        return this._socket;
    }
    getRole() {
        return this._playerRole;
    }
    getOpponentData() {
        return this._opponentData;
    }
}