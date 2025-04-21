// CHANGE NAVBAR BG COLOUR ON HOME PAGE WHEN SCROLL DOWN + HIDE ON SCROLL DOWN (DESKTOP ONLY)

$(function () {
  const $navbar = $(".navbar");
  let lastScrollTop = 0;

  $(window).on("scroll", function () {
    const currentScroll = $(this).scrollTop();

    if (currentScroll <= 10) {
      $navbar.removeClass("scrolled navbar-hidden");
    } else if (currentScroll > lastScrollTop) {
      $navbar.addClass("navbar-hidden");
    } else {
      $navbar.removeClass("navbar-hidden").addClass("scrolled");
    }

    lastScrollTop = currentScroll;
  });
});
