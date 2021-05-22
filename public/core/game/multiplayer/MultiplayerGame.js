const Game = require("./../Game");

module.exports = class MultiplayerGame extends Game {
    constructor(clientSocket) {
        super();
        this._clientSocket = clientSocket;
        this._clientSocket.onStartGame(this._onStartGame.bind(this));
        this._clientSocket.onUpdateRocketPos(this._updateRockets.bind(this));
        this._clientSocket.onUpdateBallPos(this._updateBall.bind(this));
        this._clientSocket.onUpdateScore(this._updateScoreElement.bind(this));
        this._clientSocket.onFinishGame(this._finishGame.bind(this));
    }
    _spaceDown(event) {
        //key code 32 = space
        if(!this._GAME_START && this._PLAYER_ROLE == 1 && event.keyCode == 32) {
            let playerRole = this._PLAYER_ROLE;
            this._clientSocket.getSocket().emit("start_game", {
                playerRole: playerRole
            });
        }
    }
    _onStartGame(data) {
        this._GAME_START = true;
        this._gameMainMessage.innerHTML = "";
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
                // this._pl1Rocket.position.x = this._ball.position.x;
                if(data.playerRole == this._clientSocket.getRole()) {
                    this._camera.position.x = this._pl1Rocket.position.x;
                }
            }
            else if(data.playerRole == 2) {
                this._pl2Rocket.position.x += data.xOffset;
                // this._pl2Rocket.position.x = this._ball.position.x;
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

        }
        else {
            this._gravSpeedX = data.gravSpeedX;
            this._gravSpeedY = data.gravSpeedY;
            this._gravDY = data.gravDY;
            this._gravSpeedZ = data.gravSpeedZ

            this._ball.position.z += this._gravSpeedZ;
            this._ball.position.x += this._gravSpeedX;
            this._ball.position.y -= this._gravDY;
            if(this._ball.position.y <= this._ball.scale.x*2) {
                this._ball.position.y = this._ball.scale.x*2;
                this._gravDY = -(this._gravDY);
            }
            this._gravDY += this._gravSpeedY;
            if(this._gravSpeedZ < 0) {
                if(this._ball.position.z > 0) {
                    this._gravDY += this._gravSpeedY;
                }
            }
            else {
                if(this._ball.position.z < 0) {
                    this._gravDY += this._gravSpeedY;
                }
            }
        }
    }
    _updateScoreElement(data) {
        
        this._GAME_START = false;
        this._ball.position.x = 0;
        this._ball.position.y = 10;
        this._ball.position.z = 0;
        this._setStartGravity();

        // for win a point 
        if(data.winnerSocketId == this._clientSocket.getSocket().id) {
            this._CURRENT_SCORE[this._PLAYER_ROLE-1]++;
            //for game end 
            if(this._CURRENT_SCORE[this._PLAYER_ROLE-1] >= this._MAX_SCORE_VALUE) {
                this._gameMainMessage.innerHTML = `You win a GAME!`;
                this._clientSocket.getSocket().emit("finish_game", {
                    winnerSocketId: data.winnerSocketId
                });
                return;    
            }

            this._gameMainMessage.innerHTML = `You win a point!`;
        }
        // for lose a point
        else {
            this._CURRENT_SCORE[2-this._PLAYER_ROLE]++;
            //for game end 
            if(this._CURRENT_SCORE[this._PLAYER_ROLE-1] >= this._MAX_SCORE_VALUE) {
                this._gameMainMessage.innerHTML = 
                    `${this._clientSocket.getOpponentData().userName} win a GAME!`;
                this._clientSocket.getSocket().emit("finish_game", {
                    winnerSocketId: data.winnerSocketId
                });
                return;    
            }

            this._gameMainMessage.innerHTML = 
                `${this._clientSocket.getOpponentData().userName} win a point!`
        }

        this._scoreElement.innerHTML = 
            this._CURRENT_SCORE[0]+":"+this._CURRENT_SCORE[1];
    }
    _finishGame(data) {
        
    }
    _checkBallCollisions() {
        let ballX = this._ball.position.x;
        let ballY = this._ball.position.y;
        let ballZ = this._ball.position.z;

        let changeSpeedZ = false;

        // checking collision for the player 1 rocket
        if(this._PLAYER_ROLE == 1 && this._gravSpeedZ > 0 && ballZ >= this._table.scale.z/2 && ballZ <= this._table.scale.z/2+this._ball.scale.z) {
            let leftRocketCorner = this._pl1Rocket.position.x-this._pl1Rocket.scale.x*4;
            let rightRocketCorner = this._pl1Rocket.position.x+this._pl1Rocket.scale.x*4;
            if(leftRocketCorner <= ballX && ballX <= rightRocketCorner) {
                // this._updateBallSpeedX();
                this._gravSpeedZ *= -1;
                changeSpeedZ = true;
                if(this._gravDY > 0) 
                    this._gravDY = -this._gravDY; 
            }
            else {
                this._gravDY += this._gravSpeedY;
                let opponentId = this._clientSocket.getOpponentData().id;
                this._clientSocket.getSocket().emit("update_score", {
                    winnerSocketId: opponentId
                });
                return;
            }
        }
        // checking collision for the player 2 rocket
        else if(this._PLAYER_ROLE == 2 && this._gravSpeedZ <= 0 && ballZ <= -(this._table.scale.z/2) && ballZ >= -(this._table.scale.z/2+this._ball.scale.z)) {
            let leftRocketCorner = this._pl2Rocket.position.x-this._pl2Rocket.scale.x*4;
            let rightRocketCorner = this._pl2Rocket.position.x+this._pl2Rocket.scale.x*4;
            if(leftRocketCorner <= ballX && ballX <= rightRocketCorner) {
                // this._updateBallSpeedX()
                this._gravSpeedZ *= -1;
                changeSpeedZ = true;
                if(this._gravDY > 0) 
                    this._gravDY = -this._gravDY; 
            }
            else {
                this._gravDY += this._gravSpeedY;
                let opponentId = this._clientSocket.getOpponentData().id;
                this._clientSocket.getSocket().emit("update_score", {
                    winnerSocketId: opponentId
                });
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
            // console.log(`player role = ${playerRole}, gravspeedz = ${this._gravSpeedZ}`);
            let gravSpeedX = this._gravSpeedX;
            let gravSpeedY = this._gravSpeedY;
            let gravDY = this._gravDY;
            let gravSpeedZ = this._gravSpeedZ;

            // sender of this event - only player who will hit the ball next
            // or if we changed gravSpeedZ
            if(changeSpeedZ || playerRole == this._PLAYER_ROLE) {
                console.log(`hello`);
                let updateBallData = {
                    gravSpeedX: gravSpeedX,
                    gravSpeedY: gravSpeedY,
                    gravDY: gravDY,
                    gravSpeedZ: gravSpeedZ,
                    isNegativeSpeedZ: isNegativeSpeedZ
                }
                this._clientSocket.getSocket().emit("update_ball_pos", updateBallData);
            }
    }
}