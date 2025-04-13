// CHANGE NAVBAR BG COLOUR ON HOME PAGE WHEN SCROLL DOWN + HIDE ON SCROLL DOWN (DESKTOP ONLY)

const navbar = document.querySelector(".navbar");

let lastScrollTop = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;

  if (currentScroll <= 10) {
    // When at top – transparent navbar, visible
    navbar.classList.remove("scrolled");
    navbar.classList.remove("navbar-hidden");
  } else if (currentScroll > lastScrollTop) {
    // Scrolling down
    navbar.classList.add("navbar-hidden");
  } else {
    // Scrolling up
    navbar.classList.remove("navbar-hidden");
    navbar.classList.add("scrolled");
  }

  lastScrollTop = currentScroll;
});
