const HandRecognition = require("../detection/App");
const Stats = require("stats.js");

module.exports = class Game {
    constructor(gesture_mode = true) {
        this._debugConsoleLogs = document.getElementById("debug_console_logs");
        this._scoreElement = document.getElementById("score_value");
        this._usersNamesElement = document.getElementById("users_names");
        this._gameMainMessage = document.getElementById("game_main_message");
        this._gameMainHint = document.getElementById("game_main_hint");

        this._handDetector = new HandRecognition();

        this._fpsCounter = new Stats();
        this._fpsCounter.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this._fpsCounter.dom);

        this._scene = new THREE.Scene();
        this._camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this._renderer = new THREE.WebGLRenderer();
        this._tableMaterial = new THREE.MeshBasicMaterial({ color: "#5282fa", wireframe: false });
        this._gridMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.6 });
        this._ballMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });
        this._geometry = new THREE.BoxGeometry();
        this._ballGeometry = new THREE.SphereGeometry(1, 128, 128);
        this._table = new THREE.Mesh(this._geometry, this._tableMaterial);
        this._tableGrid = new THREE.Mesh(this._geometry, this._gridMaterial);
        this._ball = new THREE.Mesh(this._ballGeometry, this._ballMaterial);
        this._sceneLight1 = new THREE.PointLight( "#fff", 10, 100 );
        this._sceneLight2 = new THREE.PointLight( "#fff", 10, 100 );
        this._sceneLight3 = new THREE.PointLight( "#fff", 10, 100 );
        this._sceneLight4 = new THREE.PointLight( "#fff", 10, 100 );
        this._edges = new THREE.EdgesGeometry(this._geometry);
        this._edgesLine = new THREE.LineSegments(this._edges, new THREE.LineBasicMaterial({ color: "#ffffff" }));
        this._gltfLoader = new THREE.GLTFLoader();
        this._audioListener = new THREE.AudioListener();
        this._tableSound = new THREE.Audio(this._audioListener);
        this._audioLoader = new THREE.AudioLoader();
    
        this._gameLoop = null;

        this._renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this._renderer.domElement);

        this._renderer.setClearColor( "black", 1 );

        // this._camera.position.x = 25;
        // this._camera.position.y = 3;
        // this._camera.position.z = 0;
        // this._camera.rotateY(1.5);
              
        this._sceneLight1.position.set( -50, 5, 0 );
        this._sceneLight2.position.set( 50, 5, 0 );
        this._sceneLight3.position.set( 0, 5, -this._table.scale.z/2-20);
        this._sceneLight4.position.set(0, 5, this._table.scale.z/2+20);
        
        this._table.scale.set(15.2, 0.3, 27.4);
        this._table.position.x = 0;
        this._table.position.y = 0;
        this._table.position.z = 0;

        this._edgesLine.scale.set(15.2, 0.3, 27.4);

        this._tableGrid.scale.set(15.2, 4, 0.5);
        this._tableGrid.position.set(0, 0, 0);

        this._ball.position.x = 0;
        this._ball.position.y = 10;
        this._ball.position.z = 0;
        this._ball.scale.set(0.3, 0.3, 0.3);

        this._rocketOpacity = 0.5;

        this._scene.add(this._sceneLight1);
        this._scene.add(this._sceneLight2);
        this._scene.add(this._sceneLight3);
        this._scene.add(this._sceneLight4);
        this._scene.add(this._edgesLine);
        this._scene.add(this._table);
        this._scene.add(this._tableGrid);
        this._scene.add(this._ball);

        this._setStartGravity();

        this._lastHandCoords = null;
        this._rocketAnimationAimCoords = null;

        this._GESTURE_MODE = gesture_mode;
        this._ROCKET_SPEED_X = 0.001;
        this._PLAYER_ROLE = null;
        this._PLAYER_HAND_LOADED = false;
        this._GAME_START = false;
        this._GAME_ENDED = false;
        this._CURRENT_SCORE = [0,0];
        this._MAX_SCORE_VALUE = 5;

        this._gameLoadedCallback = null;
        this._exitGameCallback = null;
    }
    _setStartGravity() {
        this._gravNormalSpeedZ = 0.5;
        this._gravSpeedZ = 0.5;
        this._gravSpeedX = 0;
        this._gravMinSpeedX = 0.01;
        this._gravMaxSpeedX = 0.08;
        this._gravSpeedY = 0.01;
        this._gravDY = 0.01;
        this._gravMaxGravity = 10;
        this._gravMaxJumpHeight = 5;

        this._rocketXOffset = 0;
        this._rocketYOffset = 0; 
        this._isRocketMoving = false;
        this._lastMouseX = 0;
        this._lastMouseY = 0;
    }
    _addLogMessage(message, loaded=true) {
        if(loaded)
            this._debugConsoleLogs.innerHTML += ("<br>"+message+"✅");
        else 
            this._debugConsoleLogs.innerHTML += ("<br>"+message+"❌");
    }
    _loadRocket1(path) {
        return new Promise((resolve)=>{
            this._gltfLoader.load(path, (gltf)=>{
                this._pl1Rocket = gltf.scene;
                this._pl1Rocket.traverse((node)=>{
                    if (node.isMesh) {
                        node.material.transparent = true;
                        node.material.opacity = this._rocketOpacity;
                        this._scene.add(this._pl1Rocket);
                        resolve();
                    }
                });
            });
        });
    } 
    _loadRocket2(path) {
        return new Promise((resolve)=>{
            this._gltfLoader.load(path, (gltf)=>{
                this._pl2Rocket = gltf.scene;
                this._pl2Rocket.traverse((node)=>{
                    if (node.isMesh) {
                        node.material.transparent = true;
                        node.material.opacity = this._rocketOpacity;
                        this._scene.add(this._pl2Rocket);
                        resolve();
                    }
                });
            });
        });
    }
    _loadTableSound(path) {
        return new Promise((resolve)=>{
            this._audioLoader.load(path, (buffer)=>{
                this._tableSound.setBuffer(buffer);
                this._tableSound.setLoop(false);
                this._tableSound.setVolume(0.5);
                resolve();
            });
        });
    }
    _rocketMoveAnimation() {
        let speedX = 0.05;
        let speedY = 0.05;
        if(this._rocketAnimationAimCoords[0] < this._pl1Rocket.position.x) 
            speedX *= -1;
        if(this._rocketAnimationAimCoords[1] < this._pl1Rocket.position.x)
            speedY *= -1;
        
        this._pl1Rocket.position.x += speedX;
        this._pl1Rocket.position.y += speedY;
        
        // requestAnimationFrame(this._rocketMoveAnimation.bind(this));
        // this._rocketMoveAnimation();
    }
    _getHandPrediction(event) {
        // console.log(event);
        let status = event.status;
        if(status == "waiting")
            return;
        let handX = event?.x;
        let handY = event?.y;
        if(handX || handY) {
            // this._isRocketMoving = true;
            // console.log(handX);
            let s = 5;
            if(this._lastHandCoords != null) {
                this._rocketXOffset = -(handX-this._lastHandCoords[0])/s;
                // this._rocketYOffset = -(handY-this._lastHandCoords[1])/s;
                if(Math.abs(this._rocketXOffset) < 0.1) {
                    this._rocketXOffset = 0;
                }

                if(this._PLAYER_ROLE == 2) 
                    this._rocketXOffset *= -1;
                // if(Math.abs(this._rocketYOffset) < 0.1) {
                //     this._rocketYOffset = 0;
                // }
                this._rocketAnimationAimCoords =
                    [
                        this._pl1Rocket.position.x+this._rocketXOffset,
                        // this._pl1Rocket.position.y+this._rocketYOffset
                    ];
                // this._rocketMoveAnimation();
            }
            if(!this._PLAYER_HAND_LOADED) {
                this._PLAYER_HAND_LOADED = true;
                this._rocketXOffset = 0;
                this._gameMainHint.style.display = "none";
                this._renderer.domElement.style.opacity = 1;
                this._gameLoadedCallback();
            }
        }
        else { return; }
        this._lastHandCoords = [handX, handY];        
    }
    _mousemove(event) {
        if(this._GESTURE_MODE) return; 
        let 
            x = event.clientX,
            y = event.clientY;
        if(!this._lastMouseX && !this._lastMouseY) {
            this._lastMouseX = x;
            // this._lastMouseY = y;
            return;
        }
        this._rocketXOffset = -(this._lastMouseX-x)/10;
        if(this._PLAYER_ROLE == 2) 
            this._rocketXOffset *= -1;
        // this._rocketYOffset = (this._lastMouseY-y)/10;
        this._lastMouseX = x;
        // this._lastMouseY = y;
    }
    _mousedown(event) {
        if(this._GESTURE_MODE) return;
        if(!this._GAME_START && this._PLAYER_ROLE == 1) {
            this._GAME_START = true;
            this._gameMainMessage.innerHTML = "";
        }
    }
    _spaceDown(event) {
        if(this._GESTURE_MODE && !this._PLAYER_HAND_LOADED)
            return;
        //key code 32 = space
        if(!this._GAME_START && this._PLAYER_ROLE == 1 && event.keyCode == 32) {
            this._GAME_START = true;
            this._gameMainMessage.innerHTML = "";
        }
    }
    _updateRockets() {
        this._pl1Rocket.position.x += this._rocketXOffset;
        this._pl1Rocket.position.y += this._rocketYOffset;
        this._pl2Rocket.position.x = this._ball.position.x;
        
        this._camera.position.x = this._pl1Rocket.position.x;

        // this._pl2Rocket.position.y = this._ball.position.y;
        this._rocketXOffset = 0;
        this._rocketYOffset = 0;
    }
    _updateBall() {
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
    _gravity() {
            // if (this._ball.position.z > this._table.scale.z / 2) {
            //     // this._gravSpeedZ = this._gravNormalSpeedZ;
            // }
            // if(this._ball.position.z < -(this._table.scale.z / 2)) {
            //     // this._gravSpeedZ = -this._gravNormalSpeedZ;
            // }
            // if(this._ball.position.y >= this._gravMaxJumpHeight) {
            //     // dy = -dy;
            // }            

    }
    _updateBallSpeedX() {
        let changeDirect = this._gravSpeedX > 0 ? true : false;
        this._gravSpeedX = 
            Math.random()*(this._gravMaxSpeedX-this._gravMinSpeedX)+this._gravMinSpeedX;
        if(changeDirect)
            this._gravSpeedX *= -1;
    }
    _updateScoreElement(player) {
        if(player == 1) {
            this._gameMainMessage.innerHTML = "You win a point!"
        }
        else if(player == 2) {
            this._gameMainMessage.innerHTML = "Bot win a point!"
        }
        if(this._CURRENT_SCORE[0] == this._MAX_SCORE_VALUE) {
            this._gameMainMessage.innerHTML = "Player 1 win!"
            return this._finishGame();
        }
        else if(this._CURRENT_SCORE[1] == this._MAX_SCORE_VALUE) {
            this._gameMainMessage.innerHTML = "Player 2 win!"
            return this._finishGame();
        }
        else {
            this._GAME_START = false;
            this._ball.position.x = 0;
            this._ball.position.y = 10;
            this._ball.position.z = 0;
            this._setStartGravity();
        }
        this._scoreElement.innerHTML = 
            this._CURRENT_SCORE[0]+":"+this._CURRENT_SCORE[1];
    }
    _finishGame() {
        this._GAME_ENDED = true;
        if(this._GESTURE_MODE) {
            this._handDetector.finish();
            this._handDetector = null;
        }
        document.removeEventListener('mousemove', this._mousemove);
        document.removeEventListener("keydown", this._spaceDown);
        this._renderer.setAnimationLoop(null);
        setTimeout(()=>{
            this._gameLoop = null;
            this._debugConsoleLogs.innerHTML = "";
            this._gameMainMessage.innerHTML = "";
            this._scoreElement.innerHTML = "0:0";
            this._usersNamesElement.innerHTML = "you:bot";
            this._exitGameCallback(this._renderer.domElement);
        }, 2000);
    }
    _checkBallCollisions() {

        let ballX = this._ball.position.x;
        let ballY = this._ball.position.y;
        let ballZ = this._ball.position.z;

        // checking collision for the player 1 rocket
        if(ballZ >= this._table.scale.z/2 && ballZ <= this._table.scale.z/2+this._ball.scale.z) {
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
            }
        }

        // checking collision for the player 1 rocket
        else if(ballZ <= -(this._table.scale.z/2) && ballZ >= -(this._table.scale.z/2+this._ball.scale.z)) {
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
            }
        }
    }
    _setPlayerRole(role=1) {
        this._PLAYER_ROLE = role;
        if(role == 1) {
            this._camera.position.x = 0;
            this._camera.position.y = 5;
            this._camera.position.z = 25;
        }
        else if(role == 2) {
            this._camera.position.x = 0;
            this._camera.position.y = 5;
            this._camera.position.z = -25;
            this._camera.rotateY(3.14159);
        }
    }
    async _getPlayerReady() {
        return new Promise((resolve)=>{
            
            // resolve();
        });
    }
    _render() {
        this._fpsCounter.begin();
        
        if(!this._GAME_ENDED) {
            this._updateRockets();
            if(this._GAME_START) {
                this._updateBall();
                this._gravity();
                this._checkBallCollisions();
            }
        }

        this._fpsCounter.end();

        this._renderer.render(this._scene, this._camera);
    }
    async load(callback, playerRole) {
        this._setPlayerRole(playerRole)

        await this._loadRocket1("./../../rocket_model/scene.gltf");
        await this._loadRocket2("./../../rocket_model/scene.gltf");
        this._addLogMessage("Rockets loaded.");
        await this._loadTableSound("./../../table_sound/table_sound.mp3");
        this._addLogMessage("Table loaded.");
 
        // await this._getPlayerReady();
        this._pl1Rocket.scale.set(1/4,1/4,1/4);
        this._pl1Rocket.position.set(0, 2, this._table.scale.z/2);
        this._pl1Rocket.rotateY(1.5);
        this._pl2Rocket.scale.set(1/4,1/4,1/4);
        this._pl2Rocket.position.set(0, 2, -this._table.scale.z/2);
        this._pl2Rocket.rotateY(-1.5);

        // if(this._PLAYER_ROLE == 1) 
        //     this._ball.position.set(0,5,this._table.scale.z/2);
        // else if(this._PLAYER_ROLE == 2) 
        //     this._ball.position.set(0,5,-this._table.scale.z/2);
        this._ball.scale.set(0.3, 0.3, 0.3);

        if(this._GESTURE_MODE) {
            this._gameMainHint.style.display = "block";
            this._gameMainHint.innerHTML = 
                    `Loading camera...`;
            this._handDetector.load()
            .then(()=>{
                this._addLogMessage("Camera loaded.");
                this._addLogMessage("Hand detection loaded.");
                this._handDetector.getCurrentState(
                    this._getHandPrediction.bind(this), 1000/30);
                this._gameMainHint.innerHTML = 
                    `Prepare your hand on front of the camera`
                this._renderer.domElement.style.opacity = 0.3;
            })
            .catch((error) => {
                this._addLogMessage(error, false);
                this._addLogMessage("Mouse mode activated.");
                this._gameMainHint.innerHTML = "";
                this._gameMainHint.style.display = "none";
                this._GESTURE_MODE = false;
            });
        }

        // this._render();
        this._renderer.setAnimationLoop(this._render.bind(this));

        document.addEventListener('mousemove', this._mousemove.bind(this));
        // document.addEventListener("mousedown", this._mousedown.bind(this));
        document.addEventListener("keydown", this._spaceDown.bind(this));  

        this._gameLoadedCallback = callback;
        if(!this._GESTURE_MODE) {
            this._gameLoadedCallback();
        }
    }
    async onFinish(callback) {
        this._exitGameCallback = callback;
    }
}