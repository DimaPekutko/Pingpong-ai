const {Finger, FingerCurl, FingerDirection, GestureDescription} = require('fingerpose');

let FistGesture = new GestureDescription('Fist'); 

module.exports.FistGesture = FistGesture;

FistGesture.addCurl(Finger.Thumb, FingerCurl.FullCurl, 1);
FistGesture.addCurl(Finger.Index, FingerCurl.FullCurl, 1.0);
FistGesture.addCurl(Finger.Middle, FingerCurl.FullCurl, 1.0);
FistGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
FistGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);