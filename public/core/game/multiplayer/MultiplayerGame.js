const Game = require("./../Game");

module.exports = class MultiplayerGame extends Game {
    constructor(clientSocket) {
        super();
        this._clientSocket = clientSocket;
        this._clientSocket.onUpdateRocketPos(this._updateRockets.bind(this));
        this._clientSocket.onUpdateBallPos(this._updateBall.bind(this));
    }
    _updateRockets(data=null) {
        // if data = null, then this method called from render()
        // else - method called by socket event
        if(!data) {
            let playerRole = this._PLAYER_ROLE;
            let xOffset = this._rocketXOffset;
            if(xOffset) {
                this._clientSocket.getSocket().emit("update_rocket_pos", {
                    playerRole: playerRole,
                    xOffset: xOffset,
                });
            }
            this._rocketXOffset = 0;
        }
        else {
            if(data.playerRole == 1) {
                this._pl1Rocket.position.x += data.xOffset;
                if(data.playerRole == this._clientSocket.getRole()) {
                    this._camera.position.x = this._pl1Rocket.position.x;
                }
            }
            else if(data.playerRole == 2) {
                this._pl2Rocket.position.x += data.xOffset;
                if(data.playerRole == this._clientSocket.getRole()) {
                    this._camera.position.x = this._pl2Rocket.position.x;
                }
            }
        }   
    }
    _updateBall(data=null) {
        // if data = null, then this method called from render()
        // else - method called by socket event
        if(!data) {
            // this._ball.position.x += this._gravSpeedX;
            // this._ball.position.z += this._gravSpeedZ;
        }
        else {
            this._ball.position.x = data.ballX;
            this._ball.position.z = data.ballZ;
            this._gravSpeedZ = Math.abs(this._gravSpeedZ);
            if(data.isNegativeSpeedZ) {
                this._gravSpeedZ *= -1;
            }
        }
    }
    _checkBallCollisions() {
        let ballX = this._ball.position.x;
        let ballY = this._ball.position.y;
        let ballZ = this._ball.position.z;

        // checking collision for the player 1 rocket
        if(this._PLAYER_ROLE == 1 && ballZ >= this._table.scale.z/2 && ballZ <= this._table.scale.z/2+this._ball.scale.z) {
            let leftRocketCorner = this._pl1Rocket.position.x-this._pl1Rocket.scale.x*4;
            let rightRocketCorner = this._pl1Rocket.position.x+this._pl1Rocket.scale.x*4;
            if(leftRocketCorner <= ballX && ballX <= rightRocketCorner) {
                this._updateBallSpeedX();
                this._gravSpeedZ *= -1;
                if(this._gravDY > 0) 
                    this._gravDY = -this._gravDY; 
            }
            else {
                this._gravDY += this._gravSpeedY;
                this._CURRENT_SCORE[1]++;
                this._updateScoreElement(2);
                return;
            }
        }
        // checking collision for the player 2 rocket
        else if(this._PLAYER_ROLE == 2 && ballZ <= -(this._table.scale.z/2) && ballZ >= -(this._table.scale.z/2+this._ball.scale.z)) {
            let leftRocketCorner = this._pl2Rocket.position.x-this._pl2Rocket.scale.x*4;
            let rightRocketCorner = this._pl2Rocket.position.x+this._pl2Rocket.scale.x*4;
            if(leftRocketCorner <= ballX && ballX <= rightRocketCorner) {
                this._updateBallSpeedX();
                this._gravSpeedZ *= -1;
                if(this._gravDY > 0) 
                    this._gravDY = -this._gravDY; 
            }
            else {
                this._gravDY += this._gravSpeedY;
                this._CURRENT_SCORE[0]++;
                this._updateScoreElement(1);
                return;
            }
        }

        let playerRole = null;
            let isNegativeSpeedZ = null;
            if(this._gravSpeedZ <= 0) {
                playerRole = 2;
                isNegativeSpeedZ = true;
            }
            else if(this._gravSpeedZ > 0) {
                playerRole = 1;
                isNegativeSpeedZ = false;
            }
            let gravSpeedX = this._gravSpeedX;
            let gravSpeedZ = this._gravSpeedZ;
            let updateBallData = {
                ballX: ballX+gravSpeedX,
                ballY: ballY,
                ballZ: ballZ+gravSpeedZ,
                isNegativeSpeedZ: isNegativeSpeedZ
            }
            
            // sender of this event - only player who will hit the ball next
            if(playerRole == this._PLAYER_ROLE) {
                this._clientSocket.getSocket().emit("update_ball_pos", updateBallData);
            }
    }
}