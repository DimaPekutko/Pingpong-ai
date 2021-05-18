const Game = require("./../Game");

module.exports = class MultiplayerGame extends Game {
    constructor(clientSocket) {
        super();
        this._clientSocket = clientSocket;
        this._clientSocket.onUpdateRocketPos(this._updateRockets.bind(this));
    }
    _updateRockets(data=null) {
        if(!data) {
            let role = this._PLAYER_ROLE;
            let xOffset = this._rocketXOffset;
            // let yOffset = this._rocketYOffset;
            
            if(xOffset) {
                this._clientSocket.getSocket().emit("update_rocket_pos", {
                    playerRole: role,
                    xOffset: xOffset,
                    // yOffset: yOffset
                });
            }

            this._rocketXOffset = 0;
            // this._rocketYOffset = 0;
        }
        else {
            if(data.playerRole == 1) {
                this._pl1Rocket.position.x += data.xOffset;
                // this._pl1Rocket.position.y += data.yOffset;
                this._camera.position.x = this._pl1Rocket.position.x;
            }
            else if(data.playerRole == 2) {
                this._pl2Rocket.position.x += data.xOffset;
                // this._pl2Rocket.position.y += data.yOffset;
                this._camera.position.x = this._pl2Rocket.position.x;
            }
        }
        
        // this._pl1Rocket.position.x += this._rocketXOffset;
        // this._pl1Rocket.position.y += this._rocketYOffset;
        // this._pl2Rocket.position.x = this._ball.position.x;
            
        // this._camera.position.x = this._pl1Rocket.position.x;

        // this._pl2Rocket.position.y = this._ball.position.y;
        // this._rocketXOffset = 0;
        // this._rocketYOffset = 0;
    }
    // _checkBallCollisions() {
    //     // return 0;
    // }
}