//THIS SCRIPT REMOVE ANIMATIONS ON SCREEN SIZES SMALLER THAN 992PX
//after the page is fully loaded, start this function
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth < 992) {
    //select all elements with "data-aos" attribute
    document.querySelectorAll("[data-aos]").forEach(function (element) {
      //remove the following attributes to deactivate animations
      element.removeAttribute("data-aos");
      element.removeAttribute("data-aos-delay");
      element.removeAttribute("data-aos-easing");
      element.removeAttribute("data-aos-duration");
    });
  }
});

// THIS SCRIPT HIDE NAVBAR WHEN SCROLLING DOWN, SHOW NAVBAR WHEN SCROLLING UP, MAKE NAVBAR WITH NO BACKGROUND WHEN AT THE TOP OF THE HOME PAGE (DESKTOP ONLY)
//after the page is fully loaded, start this function
$(function () {
  //create a variable to store the navbar element
  const $navbar = $(".navbar");
  //create a variable to store the last scroll position
  let lastScrollTop = 0;
  //when user is scrolling the page
  $(window).on("scroll", function () {
    //create a variable and store the current scroll position
    const currentScroll = $(this).scrollTop();
    //when the user is on the home page and is at the top of the page (less than 10px), remove the class "scrolled" and "navbar-hidden" to make the navbar transparent
    if (currentScroll <= 10) {
      $navbar.removeClass("scrolled navbar-hidden");
      //when the user is scrolling down then hide the navbar by adding the class "navbar-hidden"
    } else if (currentScroll > lastScrollTop) {
      $navbar.addClass("navbar-hidden");
      //when the user is scrolling up then remove the class "navbar-hidden" and add the class "scrolled" to make the navbar visible with brown background
    } else {
      $navbar.removeClass("navbar-hidden").addClass("scrolled");
    }
    //update the current sscroll position
    lastScrollTop = currentScroll;
  });
});

//THIS SCRIPT WILL PREVENT FORMS TO BE SUBMITTED IF hCAPTCHA IN NOT COMPLETED. IT WILL SHOW AN ALERT FOR USER TO COMPLETE IT.
//create a variable and choose all forms with ID 'contactForm' or 'orderForm'
const forms = ["contactForm", "orderForm"];
//for each form with ID 'contactForm' or 'orderForm'
forms.forEach((formId) => {
  //create a variable and choose the form with ID 'contactForm' or 'orderForm'
  const form = document.getElementById(formId);
  if (form) {
    //when the form is submitted, prevent the default action and show an alert if hCaptcha is not completed
    form.addEventListener("submit", function (event) {
      //block the default action of the form
      event.preventDefault();
      //create a variable and store data from the form
      const formData = new FormData(form);
      //create a variable and store URL, where the form will be submitted
      const action = form.action;
      //send date to the server using fetch API
      fetch(action, {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            //if the response is ok, show alert - Form was submitted successfully
            alert("Form submitted successfully!");
          } else {
            //if the response is not ok, show alert - Failed to submit the form. Please tick box I am human and complete hCaptcha.
            alert(
              "Failed to submit the form. Please tick box I am human and complete hCaptcha."
            );
          }
        })
        .catch((error) => {
          //if there is an error, show alert - An error occurred. Please try again later.
          alert("An error occurred. Please try again later.");
          //log the error to the console
          console.error("Error:", error);
        });
    });
  }
});

//THIS SCRIPT WILL CALCULATE THE TOTAL PRICE FOR THE ORDER AND ADD NEW FORM SECTIONS FOR ITEMS
//after the page is fully loaded, start this function
$(document).ready(function () {
  //function to calculate the total price
  function calculateTotal() {
    let total = 0;
    //loop through each group of items and calculate the total price
    $(".turkey-group, .bacon-group, .vegetable-group, .otherItems-group").each(
      function () {
        //find and store the selected item
        const select = $(this).find("select")[0];
        //find and store the quantity, if no value is entered, set it to 0
        const quantity = parseInt($(this).find("input").val()) || 0;
        //get and store the price from date attribute of the selected item
        const price =
          parseFloat(select?.selectedOptions[0]?.dataset.price) || 0;
        //calculate the total price for this item and add it to the total
        total += quantity * price;
      }
    );
    //update and show the total price in the text and hidden input
    $("#totalPrice").text(total.toFixed(2));
    $("#totalPriceInput").val(total.toFixed(2));
  }

  //function to clone a section and append it to the order form
  function cloneAndAppend(sectionId) {
    //store the section ID
    const $section = $(sectionId);
    //copy the first element
    const $clone = $section.children().first().clone();
    //remove values from copied element
    $clone.find("select").prop("selectedIndex", 0);
    $clone.find("input").val("1");
    //append the copied element to the section
    $section.append($clone);
    //update the event listeners for the new element
    updateEventListeners();
    //recalculate the total price
    calculateTotal();
  }

  //when user clicks on the button to add a new item, clone the section and append it to the order form
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

  //update event listeners for new select and input elements
  function updateEventListeners() {
    $(
      ".turkey-select, .turkey-quantity, .bacon-select, .bacon-quantity, .vegetable-select, .vegetable-quantity, .otherItems-select, .otherItems-quantity"
    )
      //remove previous event listeners to avoid duplicates
      .off("change")
      //add event listener to the select and input elements and call the calculateTotal function when the value changes
      .on("change", calculateTotal);
  }
  //call the function to update event listeners when the page is loaded
  updateEventListeners();
});
