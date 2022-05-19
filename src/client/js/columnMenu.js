const columnMenuBtn = document.querySelector(".nav-toggle__content");
const columnNav = document.querySelector(".nav-column");
const exitColumnBtn = document.querySelector(".nav-column__exit");
const overlay = document.getElementById("overlay");

const handleColumnMenuOpen = () => {
    columnNav.classList.add("active");
    overlay.classList.add("active");
}
const handleColumnMenuClose = () => {
    columnNav.classList.remove("active");
    overlay.classList.remove("active");
}

columnMenuBtn.addEventListener("click", handleColumnMenuOpen);
exitColumnBtn.addEventListener("click", handleColumnMenuClose);
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleInput = document.querySelector(".theme-toggle input");
const body = document.querySelector("body");
let getThemeColor = localStorage.getItem("theme");
    if(getThemeColor) {
        body.classList.add("default-gray");
        themeToggleInput.checked = true;
    }
const handleThemeColor = () => {
    if (themeToggleInput.checked) {
        body.classList.add("default-gray");
        localStorage.setItem("theme", "default-gray");
    } else {
        body.classList.remove("default-gray");
        localStorage.removeItem("theme");
    }
}
themeToggle.addEventListener("click", handleThemeColor);