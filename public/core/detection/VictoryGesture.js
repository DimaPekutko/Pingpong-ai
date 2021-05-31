const {Finger, FingerCurl, FingerDirection, GestureDescription} = require('fingerpose');

let VictoryGesture = new GestureDescription('Victory'); 

module.exports.VictoryGesture = VictoryGesture;

VictoryGesture.addCurl(Finger.Thumb, FingerCurl.HalfCurl, 0.5);
VictoryGesture.addCurl(Finger.Thumb, FingerCurl.NoCurl, 0.5);
VictoryGesture.addDirection(Finger.Thumb, FingerDirection.VerticalUp, 1.0);
VictoryGesture.addDirection(Finger.Thumb, FingerDirection.DiagonalUpLeft, 1.0);

// index:
VictoryGesture.addCurl(Finger.Index, FingerCurl.NoCurl, 1.0);
VictoryGesture.addDirection(Finger.Index, FingerDirection.VerticalUp, 0.75);
VictoryGesture.addDirection(Finger.Index, FingerDirection.DiagonalUpLeft, 1.0);

// middle:
VictoryGesture.addCurl(Finger.Middle, FingerCurl.NoCurl, 1.0);
VictoryGesture.addDirection(Finger.Middle, FingerDirection.VerticalUp, 1.0);
VictoryGesture.addDirection(Finger.Middle, FingerDirection.DiagonalUpLeft, 0.75);

// ring:
VictoryGesture.addCurl(Finger.Ring, FingerCurl.FullCurl, 1.0);
VictoryGesture.addDirection(Finger.Ring, FingerDirection.VerticalUp, 0.2);
VictoryGesture.addDirection(Finger.Ring, FingerDirection.DiagonalUpLeft, 1.0);
VictoryGesture.addDirection(Finger.Ring, FingerDirection.HorizontalLeft, 0.2);

// pinky:
VictoryGesture.addCurl(Finger.Pinky, FingerCurl.FullCurl, 1.0);
VictoryGesture.addDirection(Finger.Pinky, FingerDirection.VerticalUp, 0.2);
VictoryGesture.addDirection(Finger.Pinky, FingerDirection.DiagonalUpLeft, 1.0);
VictoryGesture.addDirection(Finger.Pinky, FingerDirection.HorizontalLeft, 0.2);

// give additional weight to index and ring fingers
VictoryGesture.setWeight(Finger.Index, 2);
VictoryGesture.setWeight(Finger.Middle, 2);