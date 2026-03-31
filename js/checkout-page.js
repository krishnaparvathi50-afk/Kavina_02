(function () {
  function setError(input, message) {
    const box = input.closest(".field");
    if (!box) return;
    const err = box.querySelector(".error");
    if (!err) return;
    err.textContent = message || "";
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function initSummary() {
    const mount = document.querySelector("#orderSummary");
    if (!mount) return;
    const cart = window.WB.getCart();
    const items = cart
      .map((i) => {
        const p = window.WB.findProduct(i.id);
        return p ? { product: p, qty: Number(i.qty) || 1 } : null;
      })
      .filter(Boolean);

    if (!items.length) {
      mount.innerHTML = `<p class="muted mb-0">No items yet. Add products first.</p>`;
      return;
    }

    const subtotal = window.WB.cartTotals().subtotal;
    mount.innerHTML = `
      <div class="summary">
        ${items
          .map(({ product, qty }) => {
            return `<div class="summary-row"><span>${product.name} × ${qty}</span><strong>${window.WB.formatMoney(
              product.price * qty
            )}</strong></div>`;
          })
          .join("")}
        <div class="divider"></div>
        <div class="summary-row"><span>Subtotal</span><strong>${window.WB.formatMoney(subtotal)}</strong></div>
        <div class="summary-row"><span>Total</span><strong>${window.WB.formatMoney(subtotal)}</strong></div>
      </div>
    `;
  }

  function initForm() {
    const form = document.querySelector("#checkoutForm");
    if (!form) return;

    const name = form.querySelector("#name");
    const address = form.querySelector("#address");
    const phone = form.querySelector("#phone");
    const email = form.querySelector("#email");
    const payMethod = form.querySelector("#payMethod");
    const cardFields = form.querySelector("#cardFields");
    const cardNumber = form.querySelector("#cardNumber");
    const cardName = form.querySelector("#cardName");
    const altPayBox = form.querySelector("#altPayBox");
    const altPayText = form.querySelector("#altPayText");

    function setPaymentUi(method) {
      const m = String(method || "card");
      const showCard = m === "card";

      if (cardFields) cardFields.style.display = showCard ? "grid" : "none";
      if (cardNumber) cardNumber.disabled = !showCard;
      if (cardName) cardName.disabled = !showCard;

      if (!altPayBox || !altPayText) return;
      if (m === "cod") {
        altPayBox.style.display = "block";
        altPayText.textContent = "Cash on Delivery selected. You’ll pay when the order arrives (demo UI).";
      } else if (m === "upi") {
        altPayBox.style.display = "block";
        altPayText.textContent = "UPI selected. Add your UPI flow here when you connect a real backend (demo UI).";
      } else {
        altPayBox.style.display = "none";
        altPayText.textContent = "";
      }
    }

    if (payMethod) {
      setPaymentUi(payMethod.value);
      payMethod.addEventListener("change", () => setPaymentUi(payMethod.value));
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let ok = true;
      const nameVal = String(name.value || "").trim();
      const addressVal = String(address.value || "").trim();
      const phoneVal = String(phone.value || "").replace(/[^\d]/g, "");
      const emailVal = String(email.value || "").trim();

      if (nameVal.length < 2) {
        ok = false;
        setError(name, "Please enter your full name.");
      } else setError(name, "");

      if (addressVal.length < 8) {
        ok = false;
        setError(address, "Please enter a complete address.");
      } else setError(address, "");

      if (phoneVal.length < 10) {
        ok = false;
        setError(phone, "Please enter a valid phone number.");
      } else setError(phone, "");

      if (!isEmail(emailVal)) {
        ok = false;
        setError(email, "Please enter a valid email.");
      } else setError(email, "");

      const cart = window.WB.getCart();
      if (!cart.length) {
        ok = false;
        window.WB.showToast("Cart is empty.");
      }

      if (!ok) return;

      // Demo-only: clear cart and show success
      window.WB.saveCart([]);
      initSummary();
      form.reset();
      window.WB.showToast("Order placed (demo). Thank you!");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initSummary();
    initForm();
  });
})();
