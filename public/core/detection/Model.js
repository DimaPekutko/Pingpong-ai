require('@tensorflow/tfjs-backend-webgl'); // handpose does not itself require a backend, so you must explicitly install one.
require('@tensorflow/tfjs-converter');
require('@tensorflow/tfjs-core');
require('@tensorflow/tfjs-backend-cpu');
// tf.ENV.set("WEBGL_CPU_FORWARD", true)
const handpose = require('@tensorflow-models/handpose');
const fp = require('fingerpose');
const {FistGesture} = require("./FistGesture");

module.exports = async (self)=>{
    
    class Model {
        constructor() {
            this.handpose = handpose;
            this.fp = fp;
            this.GE = new fp.GestureEstimator([
                // FistGesture,
            ]);
        }
        async load() {
            return new Promise(async (resolve, reject)=>{
                this.model = await this.handpose.load();                
                resolve();
            });
        }
        async detectGesture(video) {
            let returnData = {
                landmarks: "",
                gestureName: "",
                gestureConfigence: ""
            };
            let positionPrediction = await this.model.estimateHands(video);
            if(positionPrediction.length) {
                let gesturePrediction = await this.GE.estimate(positionPrediction[0].landmarks, 7.5);
                returnData.landmarks = positionPrediction[0].landmarks;
                if(gesturePrediction.gestures.length) {
                    returnData.gestureName = gesturePrediction.gestures[0].name;
                    returnData.gestureConfigence = gesturePrediction.gestures[0].confidence;
                } else {
                    returnData.gestureName = "JustHand";
                    returnData.gestureConfigence = 0;
                }
                return returnData;  
            } 
            return 0;
        }
    }

    const model = new Model();
    await model.load();
    self.postMessage(0); // this is need to start detection loop in App.js file

    self.addEventListener("message", async (event)=>{
        let prediction = await model.detectGesture(event.data);
        self.postMessage(prediction);
    });
}