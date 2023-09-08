import anime from "./node_modules/animejs/lib/anime.es.js";

const imageOne = document.querySelector(".image1");
const imageTwo = document.querySelector(".image2");
const startBtn = document.querySelector("#start-btn");
const startContainer = document.querySelector(".start-container");
const settingsMenu = document.querySelector(".settings-menu");
const showInfoCheckbox = document.querySelector("#show-info-checkbox");
const fadeTimeSlider = document.querySelector('#fade-time-slider');
const imageInfo = document.querySelectorAll('.image-info');

let imageOneData;

let fadeTime = 10000;
let carouselHasStarted = false;
let mouseOverMenu = false;

function timeOut(time) {
    return new Promise(resolve => {
        setTimeout(resolve, time);
    });
}

function loadImageAndInfo(element) {
    fetch(`https://picsum.photos/1920/1080`)
        .then((resp) => {
            if (!resp.ok) throw resp.statusText;
            let imageID = resp.headers.get('picsum-id');
            let infoURL = `https://picsum.photos/id/${imageID}/info`;
            console.log(infoURL);

            fetch(infoURL)
                .then(async (resp) => {
                    if (!resp.ok) throw resp.statusText;
                    return await resp.json();
                })
                .then((info)=> {
                    element.style.backgroundImage = `url(${info['download_url']})`;
                    element.querySelector('.image-info').textContent = `image by: ${info['author']}`;
                })
                .catch((err)=> {
                    console.warn(err.message);
                });
        })
        .catch((err)=> {
            console.warn(err.message);
        });
}


function setStartImages () {
    loadImageAndInfo(imageTwo);
    timeOut(10).then(()=> {
        loadImageAndInfo(imageOne);
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
            loadImageAndInfo(_targets);
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
            loadImageAndInfo(_targets);
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
        opacity: ['90%', '50%'],
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


settingsMenu.onmouseenter = ()=> {
    settingsMenu.style.opacity = 1;
}

settingsMenu.onmouseleave = ()=> {
    settingsMenu.style.opacity = 0;
}

showInfoCheckbox.onchange = ()=> {
    if(showInfoCheckbox.checked) {
        imageInfo.forEach((item)=> {
            item.style.visibility = 'visible';
        });
    } else {
        imageInfo.forEach((item)=> {
            item.style.visibility = 'hidden';
        });
            }
};

fadeTimeSlider.oninput = ()=> {
    updateFadeTime(fadeTimeSlider.value);
    document.getElementById("range-value").innerHTML = fadeTimeSlider.value;
}

function updateFadeTime(value) {
    fadeTime = value * 1000;
}

setStartImages();
document.getElementById("range-value").innerHTML = fadeTimeSlider.value;
