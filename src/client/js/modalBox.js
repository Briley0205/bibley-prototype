const anilist = require('anilist-node');
const Anilist = new anilist();
const openModalBtn = document.querySelectorAll(".anime-mixin");
const closeModalBtn = document.querySelector("#close-modalbox");

const animeModal = document.querySelector(".modal__block");
const animeModalHeader = document.querySelector(".modal_header");
const overlay = document.querySelector("#overlay");
const body = document.querySelector("body");
const recommend_grid_element = document.querySelector(".modal_body__recommend-data__grid");
const chara_grid_element = document.querySelector(".modal_body__character-data__grid");

async function handleOpenModal() {
    const id = Number(this.id);
    await Anilist.media.anime(id).then(anilistDATA => {
        showTitleData(anilistDATA);
        showCharacterData(anilistDATA);
        showBodyData(anilistDATA);
        showIframe(anilistDATA);
    })
}
const handleCloseModal = () => {
    const iframe = document.querySelector("iframe");
    if (iframe) {
        iframe.remove();
    }
    while (chara_grid_element.firstChild) {
        chara_grid_element.removeChild(chara_grid_element.firstChild);
    }
    while (recommend_grid_element.firstChild) {
        recommend_grid_element.removeChild(recommend_grid_element.firstChild);
    }
    body.classList.remove("disable-scroll");
    animeModal.classList.remove("active");
    overlay.classList.remove("active");
}

for (let i = 0 ; i < openModalBtn.length; i++) {
    openModalBtn[i].addEventListener('click' , handleOpenModal); 
}
closeModalBtn.addEventListener("click", handleCloseModal);

const showIframe = (anilistDATA) => {
    let iframeTag = `<iframe src="https://www.youtube.com/embed/${anilistDATA.trailer}?autoplay=1&controls=0&rel=0" allow="autoplay" allowfullscreen>`
    let bannerImg = `<img src="${anilistDATA.bannerImage}">`
    if (anilistDATA.trailer !== null) {
        animeModalHeader.innerHTML = iframeTag;
    } else {
        animeModalHeader.innerHTML = bannerImg;
    }
    body.classList.add("disable-scroll");
    animeModal.classList.add("active");
    overlay.classList.add("active");
};
const showTitleData = (anilistDATA) => {
    const titleCoverImg = document.querySelector(".title__cover-img");
    const titleName = document.querySelector("#title-name");
    const titleDescription = document.querySelector("#title-description");
    const imgTag = `<img src="${anilistDATA.coverImage.medium}">`
    titleCoverImg.innerHTML = imgTag;
    titleName.innerHTML = `${anilistDATA.title.english}`;
    titleDescription.innerHTML = `${anilistDATA.description}`
}
const showCharacterData = async(anilistDATA) => {
    for (let i = 0; i < 6; i++) {
        const role_cover = document.createElement("div");
        const chara_img = document.createElement("div");
        const chara_content = document.createElement("div");
        const chara_name = document.createElement("div");

        role_cover.setAttribute("class", "role-card");
        chara_img.setAttribute("class", "character-img");
        chara_content.setAttribute("class", "character-content");
        chara_name.setAttribute("class", "character-content__name");

        await Anilist.people.character(anilistDATA.characters[i].id).then(charaResult => {
            let charaImgTag = `<img src=${charaResult.image.medium}>`
            chara_img.innerHTML = charaImgTag;
        });
        chara_name.innerHTML = anilistDATA.characters[i].name

        role_cover.appendChild(chara_img);
        role_cover.appendChild(chara_content);
        chara_content.appendChild(chara_name);
        chara_grid_element.appendChild(role_cover);
    }
}
const showBodyData = async(anilistDATA) => {
    for (let i = 0; i < 5; i++) {
        const recommend_cover = document.createElement("div");
        const recommend_img = document.createElement("div");
        const recommend_title = document.createElement("div");
        const recommend_span = document.createElement("span");

        recommend_cover.setAttribute("id", "recommend-cover");
        recommend_img.setAttribute("id", "recommend-img");
        recommend_title.setAttribute("id", "recommend-title");
        recommend_span.setAttribute("id", "recommend-title__span");

        await Anilist.media.anime(anilistDATA.recommendations[i].mediaRecommendation.id).then(imgResult => {
            let imgTag = `<img src=${imgResult.coverImage.medium}>`
            recommend_img.innerHTML = imgTag;
        });
        recommend_span.innerHTML = anilistDATA.recommendations[i].mediaRecommendation.title.english;

        recommend_cover.appendChild(recommend_img);
        recommend_cover.appendChild(recommend_title);
        recommend_title.appendChild(recommend_span);
        recommend_grid_element.appendChild(recommend_cover);
    }
}