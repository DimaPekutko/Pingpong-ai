document.addEventListener('DOMContentLoaded', ()=>{
    const Game = require("./game/Game");
    // app.load().then(()=>{
    //     app.getCurrentState((data)=>{
    //         console.log(data.directInPercent);
    //     }, 10);
    // });    
    const mainContainer = document.getElementsByClassName("main")[0];
    const loadingContainer = document.getElementsByClassName("loading")[0];
    const startNameInput = document.getElementById("name_input");
    startNameInput.focus();
    const startNameInputHint = document.getElementById("name_input_hint");
    const playAloneBtn = document.getElementById("play_alone_btn");
    const playOnlineBtn = document.getElementById("play_online_btn");
    const minNameLength = 5;
    let isNameSelected = false;


    const swapContainer = (past, next, speed, callback)=> {
        past.style.opacity = 1;
        if(next)  
            next.style.opacity = 0;
        let hideAnimation = setInterval(()=>{
            past.style.opacity -= 0.05;
            console.log("dwa");
            if(past.style.opacity <= 0 ) {
                clearInterval(hideAnimation);
                past.style.display = "none";
                if(next) {
                    next.style.display = "block";
                    next.style.opacity = 1;
                    callback();
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
        swapContainer(mainContainer, null, 20, ()=>{
            const game = new Game();
            game.load(()=>{
                console.log("loaded");
            });
        });
    });

    playOnlineBtn.addEventListener("click", (event)=> {
        if(isNameSelected) {
            playOnlineBtn.disabled = true;
            swapContainer(mainContainer, loadingContainer, 20, ()=>{
                
            });
        }
        else {
            startNameInputHint.innerHTML = "Choose correct name to play ONLINE!"
            startNameInputHint.classList.add("fail_msg");
            startNameInputHint.classList.remove("success_msg");
        }
    });
});