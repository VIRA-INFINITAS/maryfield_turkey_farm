// CHANGE NAVBAR BG COLOUR ON HOME PAGE WHEN SCROLL DOWN
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 56) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});
