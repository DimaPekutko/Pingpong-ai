# PingPong-AI
## _Javascript ping-pong game using fingerpose_

This is a simple 3d game created in javascript, which uses a human hand as a controller using the fingerpose.js library. 
##### Available [here] or https://pingpong-ai.herokuapp.com

- Just open the app
- Start the game
-  Accept the camera 
- ✨Magic✨

## Features

- Just a singleplayer with invincible bot
- Interactive gesture mode
- Try yourself at multriplayer game

This game is just my experimental expirience with strange connection Three.js with fingerpose library in browser.

## Tech

Pingpong-AI uses a number of open source projects to work properly:

- [Three.js] - Makes 3d graphics easy in browser.
- [Browserify] - Browserify lets you require('modules') in the browser by bundling up all of your dependencies.
- [Webworkify] - Helps you to use Web Worker API with Browserify.
- [Tensorflow] - End-to-end open source platform for machine learning.
- [Fingerpose] - Finger pose classifier for hand landmarks detected by TensorFlow.js' handpose model. 
- [Node.js] - Evented I/O for the backend.
- [Express] - Fast node.js network app framework [@tjholowaychuk]
- [Socket.io] -  Enables real-time, bidirectional and event-based communication.

## Installation

Pingpong-AI requires [Node.js](https://nodejs.org/) v10+ to run.

Try it on your computer:

```sh
git clone https://github.com/DimaPekutko/Pingpong-ai.git
cd Pingpong-ai
npm install
npm start
```

And for debugging:

```sh
npm run debug
```

Then go to the browser and type localhost:8080

   [here]: <https://www.pingpongai.ml>
   [Three.js]: <http://threejs.org>
   [Browserify]: <http://browserify.org>
   [Webworkify]: <https://www.npmjs.com/package/webworkify>
   [Tensorflow]: <http://tensorflow.org>
   [Fingerpose]: <http://github.com/andypotato/fingerpose>
   [Node.js]: <http://nodejs.org>
   [Express]: <http://expressjs.com>
   [Socket.io]: <http://socket.io>
