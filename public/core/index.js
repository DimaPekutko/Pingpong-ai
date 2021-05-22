document.addEventListener('DOMContentLoaded', ()=>{
    const Game = require("./game/Game");
    const MultiplayerGame = require("./game/multiplayer/MultiplayerGame");
    const ClientSocket = require("./game/multiplayer/ClientSocket");
    const mainContainer = document.getElementsByClassName("main")[0];
    const loadingContainer = document.getElementsByClassName("loading")[0];
    const gameUi = document.getElementsByClassName("game_ui")[0];
    const startNameInput = document.getElementById("name_input");
    const startNameInputHint = document.getElementById("name_input_hint");
    const playAloneBtn = document.getElementById("play_alone_btn");
    const playOnlineBtn = document.getElementById("play_online_btn");
    const minNameLength = 5;
    let isNameSelected = false;

    startNameInput.focus();

    const swapContainer = (past, next, speed, callback)=> {
        past.style.opacity = 1;
            if(next)  
                next.style.opacity = 0;
            let hideAnimation = setInterval(()=>{
                past.style.opacity -= 0.05;
                if(past.style.opacity <= 0 ) {
                    clearInterval(hideAnimation);
                    past.style.display = "none";
                    if(next) {
                        next.style.display = "block";
                        next.style.opacity = 1;
                        callback();
                        return;
                    }
                    callback();
                }
            }, speed);
    }

    startNameInput.addEventListener("input", (event)=>{
        let currentText = startNameInput.value;
        currentText = currentText.replace(/</g, "").replace(/>/g, "")
        startNameInput.value = currentText;
        if(currentText.length < minNameLength) {
            startNameInputHint.innerHTML = "Name is to small!"
            startNameInputHint.classList.add("fail_msg");
            startNameInputHint.classList.remove("success_msg");
            isNameSelected = false;
        }
        else {
            startNameInputHint.innerHTML = "Perfect Name"
            startNameInputHint.classList.add("success_msg");
            startNameInputHint.classList.remove("fail_msg");
            isNameSelected = true;
        }
    });

    playAloneBtn.addEventListener("click", (event)=> {
        playAloneBtn.disabled = true;
        playOnlineBtn.disabled = true;
        let swapedFirst = swapContainer(mainContainer, null, 20, ()=>{
            let game;
            if(startNameInput.value === "dmitry") {
                game = new Game(false);
            }
            else {
                 game = new Game();
            }
            gameUi.style.display = "block";
            let loaded = game.load(()=>{
                let finished = game.onFinish((gameCanvas)=>{
                    let swapedSecond = swapContainer(gameCanvas, mainContainer, 50, ()=>{
                        loaded = null;
                        finished = null;
                        game = null;
                        swapedFirst = null
                        swapedSecond = null;
                        playAloneBtn.disabled = false;
                        playOnlineBtn.disabled = false;
                        gameUi.style.display = "none";
                        gameCanvas.remove()
                    });
                });
            }, 1);
        });
    });

    playOnlineBtn.addEventListener("click", (event)=> {
        if(isNameSelected) {
            playAloneBtn.disabled = true;
            playOnlineBtn.disabled = true;
            swapContainer(mainContainer, loadingContainer, 20, ()=>{
                let clientSocket = new ClientSocket(startNameInput.value);
                clientSocket.onCreateGame((role)=>{
                    swapContainer(loadingContainer, null, 20, ()=>{
                        const game = new MultiplayerGame(clientSocket);
                        gameUi.style.display = "block";
                        game.load(()=>{

                        }, clientSocket.getRole());
                    });
                }); 
            });
        }
        else {
            startNameInputHint.innerHTML = "Choose correct name to play ONLINE!"
            startNameInputHint.classList.add("fail_msg");
            startNameInputHint.classList.remove("success_msg");
        }
    });
});