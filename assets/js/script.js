var expandBtn = document.querySelector(".expand");
var collapsibleEl = document.querySelector(".collapsible");

expandBtn.addEventListener("click", function() {
    if (collapsibleEl.style.display == "none") {
        collapsibleEl.style.display = "block";
    } else {
        collapsibleEl.style.display = "none";
    }
});