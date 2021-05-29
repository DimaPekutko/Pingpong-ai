const { softmax } = require("@tensorflow/tfjs-core");
const webworkify = require('webworkify');
let videoElement = document.querySelector("#videoElement");
let videoCanvas = document.querySelector("#videoCanvas");
// let model = new Model();

module.exports = class App {
    constructor() {
        this.detectionModelWorker; 

        this.currentState = {
            gesturesHistory: [],
            x: "",
            y: "",
            _lastPosX: "",
            _lastPosY: "",
            status: "waiting",
            directInPercent: {
                up: "",
                right: "",
                down: "",
                left: ""
            }
        };

        this.getCurrentStateInterval = null;

        /* afkScore need to execute model mistake (sometimes it don't
        recognise a hand). If afkScore is under 3, then person just took 
        his hand away */
        this.afkScore = 0;         
    }
    async load() {
        this.userCamera = await this.loadCamera()
            .then(async () => {
                this.videoElement = videoElement;
                this.videoElement.width = 240;
                this.videoElement.height = 120;
                this.ctxVideo = videoCanvas.getContext("2d");
                this.detectionModelWorker = webworkify(require("./Model.js"));
                this.detectionModelWorker.addEventListener("message", this.onDetect.bind(this));
                videoCanvas.style.display = "block";
                this.changeCanvas();
            }).
            catch((error) => {
                throw error;
            });
    }
    async finish() {
        this.videoElement.srcObject.getTracks()[0].stop();
        clearInterval(this.getCurrentStateInterval);
        this.detectionModelWorker.removeEventListener("message", this.onDetect);
        this.detectionModelWorker.terminate();
        videoCanvas.style.display = "none";
        this.getCurrentState = null;
        console.log("finished");
    }
    async detectHand() {
        const canvas = document.createElement("canvas");
        canvas.width = this.videoElement.width;
        canvas.height = this.videoElement.height;
        const ctx = canvas.getContext('2d')
        ctx.drawImage(this.videoElement, 0, 0, this.videoElement.width, this.videoElement.height);
        const img = ctx.getImageData(0, 0, this.videoElement.width, this.videoElement.height);
       
        this.detectionModelWorker.postMessage(img);
    }
    async onDetect(event) {
        let prediction = event.data;
        if (prediction) {
            this.afkScore = 0;
            this.updateCurrentState(prediction);
            this.drawPoint(prediction.landmarks[0][0], prediction.landmarks[0][1]);
        } else {
            //update current state for no hand case
            this.afkScore++;
            this.currentState.directInPercent = {
                up: 0,
                right: 0,
                down: 0,
                left: 0
            };
            if(this.afkScore > 3) {
                this.gesturesHistory = [];
                this.currentState._lastPosX = 0;
                this.currentState._lastPosY = 0;
                this.currentState.status = "no_hand";
                // console.log("!no hand");
            } 
        }
        this.detectHand();
    }
    getCurrentState(callback, speed) {
        this.getCurrentStateInterval = setInterval(() => {
            callback(this.currentState);
        }, speed);
    }
    async loadCamera() {
        if (navigator.mediaDevices.getUserMedia) {
            try {
                videoElement.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
            } catch (error) {
                throw "Camera is not loaded.";
            }
        }
    }
    changeCanvas() {
        videoCanvas.width = this.videoElement.clientWidth;
        videoCanvas.height = this.videoElement.clientHeight;
        console.log(videoCanvas);
    }
    drawPoint(x, y) {
        this.ctxVideo.fillStyle = "#191935";
        this.ctxVideo.fillRect(0,0,videoCanvas.width, videoCanvas.height);
        this.ctxVideo.beginPath();
        this.ctxVideo.arc(videoCanvas.width-x, y, 5, 0, 2 * Math.PI);

        // Set line color
        this.ctxVideo.fillStyle = "red";
        this.ctxVideo.fill();
    }
    updateCurrentState(prediction) {
        //update gesturesHistory and status
        let cs = this.currentState;
        if (cs.gesturesHistory.length) {
            if (cs.gesturesHistory[cs.gesturesHistory.length - 1] != prediction.gestureName) {
                this.currentState.gesturesHistory.push(prediction.gestureName);
            }
        } else {
            this.currentState.gesturesHistory.push(prediction.gestureName);
        }
        if (prediction.gestureName == "Fist") {
            this.currentState.status = "waiting";
        } else {
            this.currentState.status = "tracking";
        }

        this.currentState.x = prediction.landmarks[0][0];
        this.currentState.y = prediction.landmarks[0][1];
        //update _lastPosX, _lastPosY and directions
        if (cs._lastPosX && cs._lastPosY) {
            let
                _lastX = cs._lastPosX,
                _lastY = cs._lastPosY,
                x = prediction.landmarks[0][0],
                y = prediction.landmarks[0][1];
            let xVector = x - _lastX;
            let yVector = y - _lastY;
            let horisontalPercent = (Math.abs(xVector) / this.videoElement.clientWidth) * 100;
            let verticalPercent = (Math.abs(yVector) / this.videoElement.clientHeight) * 100;
            if (xVector > 0) {
                this.currentState.directInPercent.right = horisontalPercent;
                this.currentState.directInPercent.left = 0;
            } else {
                this.currentState.directInPercent.left = horisontalPercent;
                this.currentState.directInPercent.right = 0;
            }
            if (yVector > 0) {
                this.currentState.directInPercent.down = verticalPercent;
                this.currentState.directInPercent.up = 0;
            } else {
                this.currentState.directInPercent.up = verticalPercent;
                this.currentState.directInPercent.down = 0;
            }
        }
        this.currentState._lastPosX = prediction.landmarks[0][0];
        this.currentState._lastPosY = prediction.landmarks[0][1];
    }
}