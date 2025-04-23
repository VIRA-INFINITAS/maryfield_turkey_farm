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

// function calculateTotal() {
//   let total = 0;

//   document.querySelectorAll(".turkey-group").forEach((group) => {
//     let select = group.querySelector(".turkey-select");
//     let quantity = parseInt(group.querySelector(".turkey-quantity").value) || 0;
//     let price =
//       parseFloat(select.selectedOptions[0].getAttribute("data-price")) || 0;
//     total += quantity * price;
//   });

//   document.querySelectorAll(".bacon-group").forEach((group) => {
//     let select = group.querySelector(".bacon-select");
//     let quantity = parseInt(group.querySelector(".bacon-quantity").value) || 0;
//     let price =
//       parseFloat(select.selectedOptions[0].getAttribute("data-price")) || 0;
//     total += quantity * price;
//   });

//   document.querySelectorAll(".vegetable-group").forEach((group) => {
//     let select = group.querySelector(".vegetable-select");
//     let quantity =
//       parseInt(group.querySelector(".vegetable-quantity").value) || 0;
//     let price =
//       parseFloat(select.selectedOptions[0].getAttribute("data-price")) || 0;
//     total += quantity * price;
//   });

//   document.querySelectorAll(".otherItems-group").forEach((group) => {
//     let select = group.querySelector(".otherItems-select");
//     let quantity =
//       parseInt(group.querySelector(".otherItems-quantity").value) || 0;
//     let price =
//       parseFloat(select.selectedOptions[0].getAttribute("data-price")) || 0;
//     total += quantity * price;
//   });

//   document.getElementById("totalPrice").innerText = total.toFixed(2);
//   document.getElementById("totalPriceInput").value = total.toFixed(2);
// }

// function addTurkey() {
//   const section = document.getElementById("turkeySection");
//   const clone = section.firstElementChild.cloneNode(true);
//   clone.querySelector("select").selectedIndex = 0;
//   clone.querySelector("input").value = "";
//   section.appendChild(clone);
//   updateEventListeners();
//   calculateTotal();
// }

// function addBacon() {
//   const section = document.getElementById("baconSection");
//   const clone = section.firstElementChild.cloneNode(true);
//   clone.querySelector("select").selectedIndex = 0;
//   clone.querySelector("input").value = "";
//   section.appendChild(clone);
//   updateEventListeners();
//   calculateTotal();
// }

// function addVegetable() {
//   const section = document.getElementById("vegetableSection");
//   const clone = section.firstElementChild.cloneNode(true);
//   clone.querySelector("select").selectedIndex = 0;
//   clone.querySelector("input").value = "";
//   section.appendChild(clone);
//   updateEventListeners();
//   calculateTotal();
// }

// function addOtherItems() {
//   const section = document.getElementById("otherItemsSection");
//   const clone = section.firstElementChild.cloneNode(true);
//   clone.querySelector("select").selectedIndex = 0;
//   clone.querySelector("input").value = "";
//   section.appendChild(clone);
//   updateEventListeners();
//   calculateTotal();
// }

// // Re-add event listeners for newly added elements
// function updateEventListeners() {
//   document
//     .querySelectorAll(
//       ".turkey-select, .turkey-quantity, .bacon-select, .bacon-quantity, .vegetable-select, .vegetable-quantity, .otherItems-select, .otherItems-quantity"
//     )
//     .forEach((element) => {
//       element.removeEventListener("change", calculateTotal); // prevent duplicates
//       element.addEventListener("change", calculateTotal);
//     });
// }

// // Initial Event Listeners
// updateEventListeners();

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
