const videoPlayer = document.getElementById("player");
const playPannelWrapper = document.getElementById("play-pannel-wrapper");
const playPannel = document.querySelector(".play-pannel");
let playPannelIcon =  playPannel.querySelector("ion-icon");
const playPauseBtn = document.getElementById("play");
const playBackBtn = document.getElementById("play-back");
const playForwardBtn = document.getElementById("play-forward");
let playPauseIcon = playPauseBtn.querySelector("ion-icon");
let mainVideo = videoPlayer.querySelector("video");
const videoControllers = videoPlayer.querySelector("#video-controler");

const volumeRange = videoPlayer.querySelector("#volume-range");
const volumeBtn = videoPlayer.querySelector(".volume-icon");
const volumeIcon = videoPlayer.querySelector("#volume-icon");

const currentTime = document.getElementById("currentTime");
const leftTime = document.getElementById("leftTime");
const videoProgressBox = document.querySelector(".progressArea");
const videoProgress = document.querySelector(".progress-bar");
const videoProgressTimeArea = document.querySelector(".progressAreaTime");

const fullScreenBtn = document.getElementById("fullScreen");
const settingsBtn = document.getElementById("play-speed");
const settingsContainer = document.getElementById("settings");
const settingsList = settingsContainer.querySelectorAll("li");

const captionsBtn = document.querySelector("#captions");
const captionsSpan = captionsBtn.querySelector("span");

let volumeValue = 0.5;
mainVideo.volume = volumeValue;
let controlsTimeOut = null;
let controlsMovementTimeout = null;

const handlePlay = (event) => {
    if(mainVideo.paused) {
        mainVideo.play();
        playPannelWrapper.classList.remove("pause");
        playPannelWrapper.classList.add("play");
    } else {
        mainVideo.pause();
        playPauseIcon.setAttribute("name", "play-sharp");
        playPannelWrapper.classList.remove("play");
        playPannelWrapper.classList.add("pause");
    }
}

const checkVolumeValue = (volumeRangeValue) => {
    if(volumeRangeValue == 0) {
        volumeIcon.setAttribute("name", "volume-mute");
    } else if(volumeRangeValue < 30) {
        volumeIcon.setAttribute("name", "volume-low");
    } else if(volumeRangeValue >= 30 && volumeRangeValue < 70) {
        volumeIcon.setAttribute("name", "volume-medium");
    } else {
        volumeIcon.setAttribute("name", "volume-high");
    }
}

const handleVolumeChange = (event) => {
    const { target: { value } } = event;
    if(mainVideo.muted) {
        mainVideo.muted = false;
        volumeIcon.setAttribute("name", "volume-medium");
    }
    checkVolumeValue(volumeRange.value);
    volumeValue = value;
    mainVideo.volume = volumeRange.value / 100;
    localStorage.setItem("userVolume", `${volumeRange.value}`);
}
const getUserVolume = () => {
    let getUserVolume = localStorage.getItem("userVolume");
    volumeRange.value = getUserVolume;
    mainVideo.volume = getUserVolume / 100;
};

const enterFullScreen = () => {
    if (videoPlayer.classList.contains("openFullScreen")) {
        videoPlayer.classList.remove("openFullScreen");
        document.exitFullscreen();
    } else {
        videoPlayer.classList.add("openFullScreen");
        videoPlayer.requestFullscreen();
    }
}

playPauseBtn.addEventListener("click", handlePlay);
playBackBtn.addEventListener("click", () => {
    mainVideo.currentTime -= 10;
});
playForwardBtn.addEventListener("click", () => {
    mainVideo.currentTime += 10;
});

mainVideo.addEventListener("click", handlePlay);
mainVideo.addEventListener("play", (event) => {
    playPauseIcon.setAttribute("name", "pause-sharp");
});
mainVideo.addEventListener("timeupdate", (event) => {
    let currentVideoTime = event.target.currentTime;
    let videoDuration = event.target.duration;
    let progressWidth = (currentVideoTime / videoDuration) * 100;
    videoProgress.style.width = `${progressWidth}%`;

    currentTime.innerText = new Date(Math.floor(mainVideo.currentTime) * 1000).toISOString().substr(14, 5);
    let leftSeconds = mainVideo.duration - mainVideo.currentTime;
    leftTime.innerText = `-${new Date(Math.floor(leftSeconds) * 1000).toISOString().substr(14, 5)}`;
});
mainVideo.addEventListener("ended", () => {
    playPauseIcon.setAttribute("name", "refresh-outline");
});
mainVideo.addEventListener("contextmenu", event => event.preventDefault());
videoPlayer.addEventListener("dblclick", () => {
    enterFullScreen();
});

const showControls = () => {
    if(controlsTimeOut) {
        clearTimeout(controlsTimeOut);
        controlsTimeOut = null;
    }
    if(controlsMovementTimeout) {
        clearTimeout(controlsMovementTimeout);
        controlsMovementTimeout = null;
    }
    videoControllers.classList.add("show");
    controlsMovementTimeout = setTimeout(hideControls, 3000)
}
const hideControls = () => videoControllers.classList.remove("show");
videoPlayer.addEventListener("mousemove", () => {
    showControls();
});
videoPlayer.addEventListener("mouseleave", () => {
    controlsTimeOut = setTimeout(hideControls, 3000);
});
window.addEventListener("keydown", event => {
    showControls();
    if (event.target.dataset.id === "textarea") {
        return;
    }
    if (event.key === "f") {
        enterFullScreen();
    } else if (event.key === " ") {
        handlePlay();
    } else if (event.key === "ArrowLeft") {
        mainVideo.currentTime = mainVideo.currentTime < 10 ? 0 : mainVideo.currentTime - 5;
    } else if (event.key === "ArrowRight") {
    mainVideo.currentTime =
        mainVideo.currenTime > mainVideo.duration - 10 ? 0 : mainVideo.currentTime + 10;
    }
});
window.addEventListener("keydown", function keydownPreventDefault(event) {
    const { key } = event;
    if (event.target.dataset.id === "textarea") {
        return;
    }
  if (
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].indexOf(key) > -1
  ) {
    event.preventDefault();
  }
});

volumeRange.addEventListener("input", handleVolumeChange);
volumeBtn.addEventListener("click", () => {
    if(mainVideo.muted) {
        mainVideo.muted = false;
        volumeRange.value = volumeValue;
        checkVolumeValue(volumeRange.value);
    } else {
        mainVideo.muted = true;
        volumeIcon.setAttribute("name", "volume-mute");
    }
    volumeRange.value = mainVideo.muted ? 0 : volumeValue;
});

videoProgressBox.addEventListener("click", (event) => {
    let videoDuration = mainVideo.duration;
    let progressWidth = videoProgressBox.clientWidth;
    let ClickOffsetX = event.offsetX;

    mainVideo.currentTime = (ClickOffsetX / progressWidth) * videoDuration;
});

fullScreenBtn.addEventListener("click", () => {
    enterFullScreen();
});

settingsBtn.addEventListener("click", () => {
    settingsContainer.classList.toggle("active");
    settingsBtn.classList.toggle("active");
});
settingsList.forEach((event) => {
    event.addEventListener("click", () => {
        removeActiveClasses();
        event.classList.add("active");
        let speed = event.getAttribute("data-speed");
        mainVideo.playbackRate = speed;
    });
})
const removeActiveClasses = () => {
    settingsList.forEach(event => {
        event.classList.remove("active");
    });
}

window.addEventListener("unload", () => {
    let setDuration = localStorage.setItem("duration", `${mainVideo.currentTime}`);
    let setVideoSrc = localStorage.setItem("src", `${mainVideo.getAttribute("src")}`);
});
window.addEventListener("load", () => {
    let getDuration = localStorage.getItem("duration");
    let getSrc = localStorage.getItem("src");
    if(getSrc && getSrc == mainVideo.getAttribute("src")) {
        mainVideo.src = getSrc;
        mainVideo.currentTime = getDuration;
        getUserVolume();
    }
    getUserVolume();
});

captionsBtn.addEventListener("click", () => {
    captionsSpan.classList.toggle("hidden");
    if (captionsSpan.classList.contains("hidden")) {
        mainVideo.classList.add("captionsHidden");
    } else {
        mainVideo.classList.remove("captionsHidden");
    }
});
if (mainVideo.readyState == 4) {
    //handlePlay();
}

const likeBtn = document.querySelector("#heart");
const likeBtnDiv = likeBtn.parentNode;
const likeSpan = likeBtn.querySelectorAll("span");
const likeNumber = likeBtn.querySelector(".like-numb");
let heartNumber = Number(likeNumber.innerHTML);
const handleHeartActive = async(id) => {
    heartNumber += 1;
    likeNumber.innerText = heartNumber;
    likeBtn.classList.add("heart-active");
    likeSpan.forEach(likeSpan => likeSpan.classList.add("heart-active"));
    const response = await fetch(`/api/videos/${id}/favorites`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
}
const handleHeartDeactivate = async(id) => {
    likeBtn.classList.remove("heart-active");
    likeSpan.forEach(likeSpan => likeSpan.classList.remove("heart-active"));
    heartNumber -= 1;
    likeNumber.innerText = heartNumber;
    const response = await fetch(`/api/favorites/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
}
const handleLike = async() => {
    const { id } = videoPlayer.dataset;
    likeBtnDiv.classList.toggle("heart-active");
    if(likeBtnDiv.classList.contains("heart-active")) {
        handleHeartActive(id);
    } else {
        handleHeartDeactivate(id);
    }
}
likeBtn.addEventListener("click", handleLike);

const subscribeBtn = document.querySelector(".owner-info__subscribe");
if(subscribeBtn) {
    const subscribeSpan = subscribeBtn.querySelector("span");
    const subscribeNumbBox = document.querySelector(".subscribe-numb");
    let subscribeNumb = Number(subscribeNumbBox.innerHTML);
    const activeSubscribe = async(id) => {
        subscribeBtn.style.background = "rgb(230, 230, 230)";
        subscribeSpan.style.color = "#8c8c8c";
        subscribeNumb += 1;
        subscribeNumbBox.innerText = subscribeNumb;
        const response = await fetch(`/api/users/${id}/subscribe`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    const deactiveSubscribe = async(id) => {
        subscribeBtn.style.background = "#c00";
        subscribeSpan.style.color = "#fff";
        subscribeNumb -= 1;
        subscribeNumbBox.innerText = subscribeNumb;
        const response = await fetch(`/api/subscribe/${id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    const handleSubscribe = () => {
        const { id } = videoPlayer.dataset;
        subscribeBtn.classList.toggle("subscribe-active");
        if(subscribeBtn.classList.contains("subscribe-active")) {
            activeSubscribe(id);
        } else {
            deactiveSubscribe(id);
        }
    }
    subscribeBtn.addEventListener("click", handleSubscribe);
}