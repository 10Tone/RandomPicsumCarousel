import anime from "./node_modules/animejs/lib/anime.es.js";

const body = document.querySelector("body");
const imageOne = document.querySelector(".image1");
const imageTwo = document.querySelector(".image2");
const startBtn = document.querySelector("#start-btn");
const startContainer = document.querySelector(".start-container");
const settingsMenu = document.querySelector(".settings-menu");
const circles = document.querySelectorAll(".circle");
const showInfoCheckbox = document.querySelector("#show-info-checkbox");

let fadeTime = 10000;
let carouselHasStarted = false;
let mouseOverMenu = false;

function timeOut(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}
function loadImage(element) {
    element.style.backgroundImage = "url(https://picsum.photos/1920/1080/?random&cb=" + (+new Date()) + ")";
    // console.log();
    // loadImageInfo();
}

async function loadImageInfo(url) {
    const response = await fetch(url);
    const info = await response.json();

    console.log(info);
}



function setStartImages () {
    loadImage(imageOne);
    timeOut(10).then(()=> {
        loadImage(imageTwo);
    });
}


function fadeInAnime(_targets, _duration) {
    let animation = anime({
        targets: _targets,
        opacity: [0,1],
        duration: _duration,
        delay: 1000,
        easing: 'linear',
        begin: ()=> {
            loadImage(_targets);
        }
    });
    animation.play();
    return animation;
}

function fadeOutAnime(_targets, _duration) {
    let animation = anime({
        targets: _targets,
        opacity: [1,0],
        duration: _duration,
        delay: 1000,
        easing: 'linear',
        complete: ()=> {
            loadImage(_targets);
        }
    });
    animation.play();
    return animation;
}

function crossFadeSequence() {
    fadeOutAnime(imageTwo, fadeTime).finished.then(()=> {
        fadeInAnime(imageTwo, fadeTime);
    });
    fadeInAnime(imageOne, fadeTime).finished.then(()=> {
        fadeOutAnime(imageOne, fadeTime).finished.then(crossFadeSequence);
    });
}


let startScreenSlideAnimeTl = anime.timeline({
    autoplay: false,
    easing: 'easeOutQuad'
});

startScreenSlideAnimeTl
    .add({
        targets: [startBtn, 'h1'],
        opacity: [1, 0],
        duration: 2000
    })
    .add({
        targets: startContainer,
        height: ['100%', '0%'],
        opacity: ['95%', '50%'],
        // boxShadow: ['0px 0px 0px 0px rgba(92,92,92,0)','0px 20px 51px 22px rgba(79,79,79,1)'],
        duration: 2000,
    })

startScreenSlideAnimeTl.finished.then(()=> {
    startBtn.setAttribute('disabled', 'disabled');
    crossFadeSequence();
})
startBtn.addEventListener("click", ()=> {
    if(!carouselHasStarted) {
        carouselHasStarted = true;
        startScreenSlideAnimeTl.play();
    }
});

settingsMenu.addEventListener('mouseover', ()=> {

});

settingsMenu.addEventListener('mouseout', ()=> {

});

showInfoCheckbox.addEventListener('change', ()=> {
    console.log(showInfoCheckbox.checked);
});

setStartImages();

