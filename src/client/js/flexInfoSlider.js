const tredingAnimeContainer = document.querySelectorAll(".trending-animeInfo__flex");
const backBtn = document.querySelector("#slide-backBtn");
const nextBtn = document.querySelector("#slide-nextBtn");

tredingAnimeContainer.forEach((item, i) => {
    let containerDimensions = item.getBoundingClientRect();
    let containerWidth = containerDimensions.width;

    nextBtn.addEventListener("click", () => {
        item.scrollLeft += containerWidth;
    });
    backBtn.addEventListener("click", () => {
        item.scrollLeft -= containerWidth*2;
    });
});