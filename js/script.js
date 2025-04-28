document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth < 992) {
    // Remove AOS attributes on small screens
    document.querySelectorAll("[data-aos]").forEach(function (element) {
      element.removeAttribute("data-aos");
      element.removeAttribute("data-aos-delay");
      element.removeAttribute("data-aos-easing");
      element.removeAttribute("data-aos-duration");
    });
  }
});
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

//This script will prevent forms to be submitted if hCaptcha in not completed. It will show an alert for user to complete it.
// Choose all forms with ID 'contactForm' or 'orderForm'
const forms = ["contactForm", "orderForm"];
// Loop for each form
forms.forEach((formId) => {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const formData = new FormData(form);
      const action = form.action;

      fetch(action, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            alert("Form submitted successfully!");
          } else {
            alert(
              "Failed to submit the form. Please tick box I am human and complete hCaptcha."
            );
          }
        })
        .catch((error) => {
          alert("An error occurred. Please try again later.");
          console.error("Error:", error);
        });
    });
  }
});

// Simplified jQuery-based script for dynamic form and total price calculation
$(document).ready(function () {
  function calculateTotal() {
    let total = 0;

    $(".turkey-group, .bacon-group, .vegetable-group, .otherItems-group").each(
      function () {
        const select = $(this).find("select")[0];
        const quantity = parseInt($(this).find("input").val()) || 0;
        const price =
          parseFloat(select?.selectedOptions[0]?.dataset.price) || 0;
        total += quantity * price;
      }
    );

    $("#totalPrice").text(total.toFixed(2));
    $("#totalPriceInput").val(total.toFixed(2));
  }

  function cloneAndAppend(sectionId) {
    const $section = $(sectionId);
    const $clone = $section.children().first().clone();
    $clone.find("select").prop("selectedIndex", 0);
    $clone.find("input").val("");
    $section.append($clone);
    updateEventListeners();
    calculateTotal();
  }

  // Event delegation for add buttons
  $("#orderForm").on("click", ".add-turkey", function () {
    cloneAndAppend("#turkeySection");
  });
  $("#orderForm").on("click", ".add-bacon", function () {
    cloneAndAppend("#baconSection");
  });
  $("#orderForm").on("click", ".add-vegetable", function () {
    cloneAndAppend("#vegetableSection");
  });
  $("#orderForm").on("click", ".add-otherItems", function () {
    cloneAndAppend("#otherItemsSection");
  });

  function updateEventListeners() {
    $(
      ".turkey-select, .turkey-quantity, .bacon-select, .bacon-quantity, .vegetable-select, .vegetable-quantity, .otherItems-select, .otherItems-quantity"
    )
      .off("change")
      .on("change", calculateTotal);
  }

  updateEventListeners();
});
