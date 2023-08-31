import anime from "./node_modules/animejs/lib/anime.es.js";

const body = document.querySelector("body");
const imageOne = document.querySelector(".image1");
const imageTwo = document.querySelector(".image2");
const startBtn = document.querySelector("#start-btn");
const menuContainer = document.querySelector(".menu-container");

let fadeTime = 10000;
let carouselHasStarted = false;

function loadImage(element) {
    element.style.backgroundImage = "url(https://picsum.photos/1920/1080/?random&cb=" + (+new Date()) + ")";
}
async function setStartImages () {
    loadImage(imageOne);
    await new Promise((resolve)=> {
        setTimeout(()=> {
            loadImage(imageTwo);
        }, 10);
    });
}

function fadeInAnime(_targets, _duration) {
    let animation = anime({
        targets: _targets,
        opacity: [0,1],
        duration: _duration,
        easing: 'easeInOutSine',
        begin: ()=> {
            loadImage(_targets);
            console.log("animation complete");
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
        easing: 'easeInOutSine',
        complete: ()=> {
            loadImage(_targets);
            console.log("animation complete");
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

setStartImages();
crossFadeSequence();



// animeOne();
// animeTwo();

// anime({
//     targets: 'h1',
//     translateX: 250,
// });
//
// function cssAnimate(element, animationName) {
//     element.classList.remove(animationName);
//     return new Promise((resolve, reject) => {
//         function handleAnimationEnd() {
//             resolve(element);
//             console.log(`${animationName} ended`);
//         }
//         element.addEventListener("animationend", handleAnimationEnd, {once: true});
//         element.classList.add(animationName);
//     });
//
// }
//
// function timeOut(time) {
//     return new Promise(resolve => {
//         setTimeout(resolve, time);
//     })
//
// }
//
// async function menuSlideAnimationChain() {
//     await cssAnimate(menuContainer, "slide-up-anim");
//     await timeOut(2000);
//     await cssAnimate(menuContainer, "fade-out-anim");
// }
//
//
//
//
//
//
//
//
// function animatePromise(element, startOpacity, endOpacity) {
//     return element.animate([{opacity: startOpacity}, {opacity: endOpacity}], {duration: fadeTime}).finished;
// }
//
//
// async function fadeAnimationSequence() {
//
//     imageTwo.animate([{opacity: 0}, {opacity: 1}]);
//     await animatePromise(imageOne,1,0);
//     loadImage(imageOne);
//     imageOne.animate([{opacity: 0}, {opacity: 1}]);
//     await animatePromise(imageTwo, 1,0);
//     loadImage(imageTwo);
//
//     Promise.resolve().then(fadeAnimationSequence);
// }
//
//
//
// startBtn.addEventListener("click", ()=> {
//     if(!carouselHasStarted) {
//         carouselHasStarted = true;
//         // startBtn.classList.add("hide-anim");
//         menuSlideAnimationChain();
//         fadeAnimationSequence();
//     }
// });
//
// body.addEventListener("mousemove", (event)=> {
//     if(menuContainer.classList.contains("fade-out-anim") && event.clientY <= 20) {
//         console.log("show");
//         menuContainer.classList.replace("fade-out-anim", "fade-in-anim");
//     }
// })



