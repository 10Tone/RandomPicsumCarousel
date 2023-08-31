import anime from "./node_modules/animejs/lib/anime.es.js";

const body = document.querySelector("body");
const imageOne = document.querySelector(".image1");
const imageTwo = document.querySelector(".image2");
const startBtn = document.querySelector("#start-btn");
const menuContainer = document.querySelector(".menu-container");

let fadeTime = 10000;
let carouselHasStarted = false;

function timeOut(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}
function loadImage(element) {
    element.style.backgroundImage = "url(https://picsum.photos/1920/1080/?random&cb=" + (+new Date()) + ")";
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

let menuSlideAnimeTl = anime.timeline({
    autoplay: false,
    easing: 'linear'
});

menuSlideAnimeTl
    .add({
        targets: [startBtn, 'h1'],
        opacity: [1, 0],
        duration: 500
    })
    .add({
        targets: menuContainer,
        height: ['100%', '5%'],
        opacity: ['80%', '40%'],
        duration: 1500,
        easing: 'easeOutQuad',
    })
    .add({
        targets: [startBtn, 'h1'],
        opacity: [0, 1],
        duration: 500
    })
    .add({
        targets: menuContainer,
        opacity: 0,
        duration: 500,
        delay:2000
    })

menuSlideAnimeTl.finished.then(()=> {
    startBtn.setAttribute('disabled', 'disabled');
    crossFadeSequence();
})
startBtn.addEventListener("click", ()=> {
    if(!carouselHasStarted) {
        carouselHasStarted = true;
        menuSlideAnimeTl.play();
    }
});

// body.addEventListener("mousemove", (event)=> {
//     if(menuContainer.classList.contains("fade-out-anim") && event.clientY <= 20) {
//         console.log("show");
//         menuContainer.classList.replace("fade-out-anim", "fade-in-anim");
//     }
// })


setStartImages();

