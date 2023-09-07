import anime from "./node_modules/animejs/lib/anime.es.js";

const body = document.querySelector("body");
const imageOne = document.querySelector(".image1");
const imageTwo = document.querySelector(".image2");
const startBtn = document.querySelector("#start-btn");
const startContainer = document.querySelector(".start-container");
const settingsMenu = document.querySelector(".settings-menu");
const showInfoCheckbox = document.querySelector("#show-info-checkbox");
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
function loadImage(element) {
    // loadImageInfo()
    element.style.backgroundImage = "url(https://picsum.photos/1920/1080/?random&cb=" + (+new Date()) + ")";
    // console.log();
    // loadImageInfo();
}

// async function loadImageInfo() {
//     let listResponse = await fetch('https://picsum.photos/v2/list?limit=100');
//     let listData = await listResponse.json();
//     console.log(listData);
//
//     let imageID = Math.floor(Math.random()*listData.length);
//     console.log(imageID);
//     let url = `https://picsum.photos/id/${imageID}/info`;
//     try {
//         let response = await fetch(url);
//         let info = await response.json();
//         console.log(info);
//     } catch(err) {
//
//     }
// }

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
                    imageOneData = info;
                    console.log(imageOneData);
                    element.style.backgroundImage = `url(${info['download_url']})`;
                    imageInfo.forEach((item)=> {
                        item.textContent = info['author'];
                    });
                    // MOVE imageinfo
                })
                .catch((err)=> {
                    console.warn(err.message);
                });
        })
        .catch((err)=> {
            console.warn(err.message);
        });
}

/*
- fetch random image
- read header id
- fetch image info
*/


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
        opacity: ['60%', '50%'],
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
    if(showInfoCheckbox.checked) {
        imageInfo.forEach((item)=> {
            item.style.visibility = 'visible';
        });
    } else {
        imageInfo.forEach((item)=> {
            item.style.visibility = 'hidden';
        });
            }
});

setStartImages();

