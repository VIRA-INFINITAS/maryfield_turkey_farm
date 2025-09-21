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

/* =========================================================
   ORDER FORM LOGIC (qty & total)
   - Qty is 0 when placeholder (value === "")
   - Auto-sets to 1 when a valid product is selected (only if it was 0)
   - Returns to 0 when user chooses the placeholder back
   ========================================================= */
const OrderForm = (function ($) {
  const GROUP_SELECTOR =
    ".turkey-group, .bacon-group, .vegetable-group, .otherItems-group";
  const SELECT_SELECTOR =
    ".turkey-select, .bacon-select, .vegetable-select, .otherItems-select";
  const QTY_SELECTOR =
    ".turkey-quantity, .bacon-quantity, .vegetable-quantity, .otherItems-quantity";

  function calculateTotal() {
    let total = 0;

    $(GROUP_SELECTOR).each(function () {
      const select = $(this).find("select")[0];
      const qty = Math.max(0, parseInt($(this).find("input").val(), 10) || 0);

      let price = 0;
      if (select && select.selectedOptions && select.selectedOptions[0]) {
        const opt = select.selectedOptions[0];
        if (opt.value !== "") {
          price = parseFloat(opt.dataset.price || "0") || 0;
        }
      }
      total += qty * price;
    });

    $("#totalPrice").text(total.toFixed(2));
    $("#totalPriceInput").val(total.toFixed(2));
  }

  function initQuantities() {
    $(GROUP_SELECTOR).each(function () {
      const select = $(this).find("select")[0];
      const $qty = $(this).find("input[type='number']");
      const current = parseInt($qty.val(), 10) || 0;

      if (!select || select.value === "") {
        $qty.val("0");
      } else if (current === 0) {
        $qty.val("1");
      }
    });
  }

  function cloneAndAppend(sectionId) {
    const $section = $(sectionId);
    const $firstRow = $section.children().first();
    if (!$firstRow.length) return;

    const $clone = $firstRow.clone();
    $clone.find("select").each(function () {
      this.value = "";
    });
    $clone.find("input[type='number']").val("0");
    $section.append($clone);

    calculateTotal();
  }

  function bindEvents() {
    const $form = $("#orderForm");

    $form.on("change", SELECT_SELECTOR, function () {
      const $group = $(this).closest(GROUP_SELECTOR);
      const $qty = $group.find("input[type='number']");
      const isValid = this.value !== "";

      if (isValid) {
        const current = parseInt($qty.val(), 10) || 0;
        if (current === 0) $qty.val("1");
      } else {
        $qty.val("0");
      }
      calculateTotal();
    });

    $form.on("input change", QTY_SELECTOR, function () {
      const v = Math.max(0, parseInt($(this).val(), 10) || 0);
      $(this).val(v);
      calculateTotal();
    });

    $form.on("click", ".add-turkey", function () {
      cloneAndAppend("#turkeySection");
    });
    $form.on("click", ".add-bacon", function () {
      cloneAndAppend("#baconSection");
    });
    $form.on("click", ".add-vegetable", function () {
      cloneAndAppend("#vegetableSection");
    });
    $form.on("click", ".add-otherItems", function () {
      cloneAndAppend("#otherItemsSection");
    });
  }

  /* ---------------------------------------------------------
     Build one hidden payload in the exact email order you want:
     1) Order_summary (multiline)
     2) Total_price
     3) First_name, Last_name, Address_line1, Address_line2, City,
        Postcode, Email, Phone, Order_type, Message
     To avoid duplicates, temporarily remove name attributes
     from all original fields (except apikey / hcaptcha).
     Names are restored after submit completes.
  --------------------------------------------------------- */
  function buildEmailPayloadDesiredOrder() {
    const form = document.getElementById("orderForm");
    if (!form) return;

    // Remove any previously generated dynamic nodes
    form.querySelectorAll('[data-dynamic="true"]').forEach((n) => n.remove());

    // Container inserted at the very top of the form (DOM order defines email order)
    const container = document.createElement("div");
    container.setAttribute("data-dynamic", "true");
    form.insertBefore(container, form.firstChild);

    // Helpers
    const addHidden = (name, value) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      input.setAttribute("data-dynamic", "true");
      container.appendChild(input);
    };
    const addHiddenTextarea = (name, value) => {
      const ta = document.createElement("textarea");
      ta.name = name;
      ta.value = value;
      ta.style.display = "none";
      ta.setAttribute("data-dynamic", "true");
      container.appendChild(ta);
    };

    // Build multiline Order_summary
    const currency = "£";
    const lines = [];

    const processSection = (rowSelector, label) => {
      let idx = 1;
      document.querySelectorAll(rowSelector).forEach((row) => {
        const sel = row.querySelector("select");
        const qtyInput = row.querySelector('input[type="number"]');
        if (!sel || !qtyInput) return;

        const value = sel.value || "";
        const qty = Math.max(0, parseInt(qtyInput.value, 10) || 0);
        if (value === "" || qty === 0) return;

        const opt = sel.selectedOptions[0];
        const price = parseFloat(opt?.dataset?.price || "0") || 0;
        const subtotal = (qty * price).toFixed(2);

        // NEW format: without Unit, with blank line after each item
        lines.push(
          `${label} ${idx}: ${value} — Qty: ${qty} — Subtotal: ${currency}${subtotal}`,
          "" // blank line for spacing
        );
        idx++;
      });
    };

    processSection(".turkey-group", "Turkey");
    processSection(".bacon-group", "Bacon");
    processSection(".vegetable-group", "Vegetables");
    processSection(".otherItems-group", "Other");

    // Remove last extra blank line if exists
    if (lines.length && lines[lines.length - 1] === "") lines.pop();

    const summaryText = lines.length ? lines.join("\n") : "No items selected.";
    addHiddenTextarea("Order_summary", summaryText);

    // 2) Total_price (use the calculated hidden input if present)
    const totalInput = document.getElementById("totalPriceInput");
    const totalValue =
      (totalInput && totalInput.value) ||
      (document.getElementById("totalPrice")?.textContent ?? "0.00");
    addHidden("Total_price", totalValue);

    // 3) Contact details in exact order
    const val = (id) => document.getElementById(id)?.value || "";
    addHidden("First_name", val("firstName"));
    addHidden("Last_name", val("lastName"));
    addHidden("Address_line1", val("address1"));
    addHidden("Address_line2", val("address2"));
    addHidden("City", val("city"));
    addHidden("Postcode", val("postcode"));
    addHidden("Email", val("email"));
    addHidden("Phone", val("phone"));
    addHidden("Order_type", val("orderType"));
    addHidden("Message", val("message"));

    // ---- Temporarily strip name attributes from original fields ----
    // Keep only "apikey" and hcaptcha fields intact.
    form
      .querySelectorAll("input[name], select[name], textarea[name]")
      .forEach((el) => {
        const name = el.getAttribute("name");
        if (!name) return;
        if (el.hasAttribute("data-dynamic")) return; // our new fields
        if (name === "apikey" || name === "h-captcha-response") return;

        // store original name and remove it
        el.setAttribute("data-name-original", name);
        el.removeAttribute("name");
      });
  }

  // Restore original names & remove dynamic fields (after submit finishes)
  function cleanupEmailPayload() {
    const form = document.getElementById("orderForm");
    if (!form) return;

    form.querySelectorAll("[data-name-original]").forEach((el) => {
      el.setAttribute("name", el.getAttribute("data-name-original"));
      el.removeAttribute("data-name-original");
    });

    form.querySelectorAll('[data-dynamic="true"]').forEach((n) => n.remove());
  }

  return {
    calculateTotal,
    initQuantities,
    bindEvents,
    buildEmailPayloadDesiredOrder,
    cleanupEmailPayload,
  };
})(jQuery);

/* =========================================================
   Submit via Web3Forms (single handler)
   - Build the email payload IN THE DESIRED ORDER
   - Send
   - Restore form to normal state afterwards
   ========================================================= */
(function () {
  const orderForm = document.getElementById("orderForm");
  if (!orderForm) return;

  orderForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // Build the bespoke ordered payload and strip original names
    OrderForm.buildEmailPayloadDesiredOrder();

    const formData = new FormData(orderForm);
    const action = orderForm.action;

    fetch(action, { method: "POST", body: formData })
      .then((response) => {
        // Always clean up names & dynamic fields afterwards
        OrderForm.cleanupEmailPayload();

        if (response.ok) {
          alert("Form submitted successfully!");
          orderForm.reset();
          OrderForm.initQuantities();
          OrderForm.calculateTotal();
        } else {
          alert(
            "Failed to submit the form. Please tick 'I am human' and complete hCaptcha."
          );
        }
      })
      .catch((error) => {
        OrderForm.cleanupEmailPayload();
        alert("An error occurred. Please try again later.");
        console.error("Error:", error);
      });
  });
})();

/* =========================================================
   Boot on ready
   ========================================================= */
jQuery(function () {
  OrderForm.bindEvents();
  OrderForm.initQuantities();
  OrderForm.calculateTotal();
});
