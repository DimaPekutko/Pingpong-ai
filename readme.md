# PingPong-AI
## _Javascript ping-pong game using fingerpose_

This is a simple 3d game created in javascript, which uses a human hand as a controller using the fingerpose.js library. 
https://pingpong-ai.herokuapp.com/

- Just open the app
- Start the game
-  Accept the camera 
- ✨Magic ✨

## Features

- Just a singleplayer with invincible bot
- Interactive gesture mode
- Try yourself at multriplayer game

This game is just my experimental expirience with strange connection Three.js with fingerpose library in browser.

## Tech

Pingpong-AI uses a number of open source projects to work properly:

- [Three.js] - Makes 3d graphics easy in browser
- [Browserify] - Browserify lets you require('modules') in the browser by bundling up all of your dependencies.
- [Tensorflow] - End-to-end open source platform for machine learning
- [Fingerpose] - Finger pose classifier for hand landmarks detected by TensorFlow.js' handpose model. 
- [Node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework [@tjholowaychuk]
- [Socket.io] -  Enables real-time, bidirectional and event-based communication.

And of course Dillinger itself is open source with a [public repository][dill]
 on GitHub.

## Installation

Dillinger requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
cd dillinger
npm i
node app
```

For production environments...

```sh
npm install --production
NODE_ENV=production node app
```

## Plugins

Dillinger is currently extended with the following plugins.
Instructions on how to use them in your own application are linked below.

| Plugin | README |
| ------ | ------ |
| Dropbox | [plugins/dropbox/README.md][PlDb] |
| GitHub | [plugins/github/README.md][PlGh] |
| Google Drive | [plugins/googledrive/README.md][PlGd] |
| OneDrive | [plugins/onedrive/README.md][PlOd] |
| Medium | [plugins/medium/README.md][PlMe] |
| Google Analytics | [plugins/googleanalytics/README.md][PlGa] |

## Development

Want to contribute? Great!

Dillinger uses Gulp + Webpack for fast developing.
Make a change in your file and instantaneously see your updates!

Open your favorite Terminal and run these commands.

First Tab:

```sh
node app
```

Second Tab:

```sh
gulp watch
```

(optional) Third:

```sh
karma test
```

#### Building for source

For production release:

```sh
gulp build --prod
```

Generating pre-built zip archives for distribution:

```sh
gulp build dist --prod
```

## Docker

Dillinger is very easy to install and deploy in a Docker container.

By default, the Docker will expose port 8080, so change this within the
Dockerfile if necessary. When ready, simply use the Dockerfile to
build the image.

```sh
cd dillinger
docker build -t <youruser>/dillinger:${package.json.version} .
```

This will create the dillinger image and pull in the necessary dependencies.
Be sure to swap out `${package.json.version}` with the actual
version of Dillinger.

Once done, run the Docker image and map the port to whatever you wish on
your host. In this example, we simply map port 8000 of the host to
port 8080 of the Docker (or whatever port was exposed in the Dockerfile):

```sh
docker run -d -p 8000:8080 --restart=always --cap-add=SYS_ADMIN --name=dillinger <youruser>/dillinger:${package.json.version}
```

> Note: `--capt-add=SYS-ADMIN` is required for PDF rendering.

Verify the deployment by navigating to your server address in
your preferred browser.

```sh
127.0.0.1:8000
```

## License

MIT

**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)

  - [Three.js] - Makes 3d graphics easy in browser
- [Browserify] - Browserify lets you require('modules') in the browser by bundling up all of your dependencies.
- [Tensorflow] - End-to-end open source platform for machine learning
- [Fingerpose] - Finger pose classifier for hand landmarks detected by TensorFlow.js' handpose model. 
- [Node.js] - evented I/O for the backend
- [Express] - fast node.js network app framework [@tjholowaychuk]
- [Socket.io] -  Enables real-time, bidirectional and event-based communication.
- 
   [Three.js]: <http://threejs.org>
   [Browserify]: <http://browserify.org>
   [Tensorflow]: <http://tensorflow.org>
   [Fingerpose]: <http://github.com/andypotato/fingerpose>
   [Node.js]: <http://nodejs.org>
   [Express]: <http://expressjs.com>
   [Socket.io]: <http://socket.io>

   [PlDb]: <https://github.com/joemccann/dillinger/tree/master/plugins/dropbox/README.md>
   [PlGh]: <https://github.com/joemccann/dillinger/tree/master/plugins/github/README.md>
   [PlGd]: <https://github.com/joemccann/dillinger/tree/master/plugins/googledrive/README.md>
   [PlOd]: <https://github.com/joemccann/dillinger/tree/master/plugins/onedrive/README.md>
   [PlMe]: <https://github.com/joemccann/dillinger/tree/master/plugins/medium/README.md>
   [PlGa]: <https://github.com/RahulHP/dillinger/blob/master/plugins/googleanalytics/README.md>
