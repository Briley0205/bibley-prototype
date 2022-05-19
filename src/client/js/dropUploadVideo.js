const videoDragArea = document.querySelector(".upload-drag-area");
const videoDragText = document.querySelector(".upload-drag-area__header");
const myForm  = document.querySelector(".upload-video");
const videoInputElement = document.querySelector(".upload-drag-area__input");

const thumbUploadArea = document.querySelector(".thumbnail-upload-area");
const thumbBrowseBtn = thumbUploadArea.querySelector(".thumbnail-upload-area__button");
const thumbFileInput = document.querySelector("#thumb");

let videoBrowseBtn = document.querySelector(".upload-drag-area__button");
let videoFileInput = document.querySelector(".upload-drag-area__input");

let videoFile;
let thumbFile;

//when browse it
videoBrowseBtn.addEventListener("click", () => {
    videoFileInput.click();
});

videoFileInput.addEventListener("change", function() {
    videoDragText.textContent = "Calling video data. Please wait...";
    videoFile = this.files[0];
    displayVideoFile();
});
//when drop it
videoDragArea.addEventListener("dragover", (event) => {
    event.preventDefault();
    videoDragText.textContent = "Release to upload";
    videoDragArea.classList.add("active");
});

videoDragArea.addEventListener("dragleave", (event) => {
    videoDragText.textContent = "Drag & Drop";
    videoDragArea.classList.remove("active");
});

videoDragArea.addEventListener("drop", (event) => {
    event.preventDefault();

    videoDragText.textContent = "Calling video data. Please wait...";
    videoFile = event.dataTransfer.files[0];
    videoInputElement.files = event.dataTransfer.files;
    console.log(videoInputElement.files);
    videoInputElement.setAttribute("value", `${videoFile}`);
    displayVideoFile();
});

const displayVideoFile = () => {
    let fileType = videoFile.type;
    let validExtensions = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv'];
    //let fileSize = videoFile.size;  && fileSize < 125829120
    if(validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            let videoTag = `<video src="${fileURL}" autoplay controls>`;
            videoDragArea.innerHTML = videoTag;
        };
        fileReader.readAsDataURL(videoFile);
    } else {
        alert("Wrong file type. It supports .mp4 .mov .avi files.");
        videoDragArea.classList.remove("active");
    }
}
videoDragArea.addEventListener("contextmenu", event => event.preventDefault());

thumbBrowseBtn.addEventListener("click", () => {
    thumbFileInput.click();
});

thumbFileInput.addEventListener("change", function(){
    thumbFile = this.files[0];
    displayThumbFile();
});

const displayThumbFile = () => {
    let fileType = thumbFile.type;
    let validExtensions = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if(validExtensions.includes(fileType)) {
        let fileReader = new FileReader();
        fileReader.onload = () => {
            let fileURL = fileReader.result;
            let imageTag = `<img src="${fileURL}" style="width: 100%; height: 100%; object-fit: cover;">`;
            thumbUploadArea.innerHTML = imageTag;
        };
        fileReader.readAsDataURL(thumbFile);
    } else {
        alert("Wrong file type. It supports .jpg .png .gif files.");
    }
}