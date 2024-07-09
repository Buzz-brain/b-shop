let close = document.getElementById("close");
let overlay = document.getElementsByClassName("overlay")[0];

close.addEventListener("click", () => {
    overlay.style.display = "none";
})