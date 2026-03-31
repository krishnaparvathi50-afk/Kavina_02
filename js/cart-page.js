(function () {
  function lineTotal(product, qty) {
    return product.price * qty;
  }

  function renderEmpty(mount) {
    mount.innerHTML = `
      <div class="card">
        <div class="card-pad">
          <h2 class="mt-0">Your cart is empty</h2>
          <p class="muted">Add a bottle you love, then come back to checkout.</p>
          <a class="btn btn-primary" href="products.html">Browse Products</a>
        </div>
      </div>
    `;
  }

  function renderCart() {
    const mount = document.querySelector("#cartMount");
    const subtotalEl = document.querySelector("#subtotal");
    const totalEl = document.querySelector("#total");
    const checkoutBtn = document.querySelector("#checkoutBtn");
    if (!mount) return;

    const cart = window.WB.getCart();
    const detailed = cart
      .map((i) => {
        const p = window.WB.findProduct(i.id);
        return p ? { product: p, qty: Number(i.qty) || 1 } : null;
      })
      .filter(Boolean);

    if (!detailed.length) {
      renderEmpty(mount);
      if (checkoutBtn) checkoutBtn.setAttribute("aria-disabled", "true");
      if (subtotalEl) subtotalEl.textContent = window.WB.formatMoney(0);
      if (totalEl) totalEl.textContent = window.WB.formatMoney(0);
      return;
    }
    if (checkoutBtn) checkoutBtn.removeAttribute("aria-disabled");

    mount.innerHTML = `
      <div class="cart-list">
        ${detailed
          .map(({ product, qty }) => {
            return `
              <div class="card">
                <div class="card-pad cart-item">
                  <div class="thumb">
                    <img src="${product.image}" alt="${product.name} thumbnail">
                  </div>
                  <div>
                    <p class="cart-title">${product.name}</p>
                    <p class="cart-sub">${product.size} • ${product.type} • <strong>${window.WB.formatMoney(product.price)}</strong></p>
                  </div>
                  <div class="cart-controls">
                    <div class="qty" role="group" aria-label="Quantity controls">
                      <button type="button" data-qty-minus="${product.id}" aria-label="Decrease quantity">−</button>
                      <input inputmode="numeric" pattern="[0-9]*" value="${qty}" data-qty-input="${product.id}" aria-label="Quantity">
                      <button type="button" data-qty-plus="${product.id}" aria-label="Increase quantity">+</button>
                    </div>
                    <div style="min-width:110px; text-align:right; font-weight:900">
                      ${window.WB.formatMoney(lineTotal(product, qty))}
                    </div>
                    <button class="icon-btn danger" type="button" data-remove="${product.id}">Remove</button>
                  </div>
                </div>
              </div>
            `;
          })
          .join("")}
      </div>
    `;

    const totals = window.WB.cartTotals();
    if (subtotalEl) subtotalEl.textContent = window.WB.formatMoney(totals.subtotal);
    if (totalEl) totalEl.textContent = window.WB.formatMoney(totals.subtotal);
  }

  function init() {
    renderCart();

    document.addEventListener("click", (e) => {
      const removeBtn = e.target.closest("[data-remove]");
      if (removeBtn) {
        window.WB.removeFromCart(removeBtn.getAttribute("data-remove"));
        renderCart();
        return;
      }
      const minus = e.target.closest("[data-qty-minus]");
      if (minus) {
        const id = minus.getAttribute("data-qty-minus");
        const cart = window.WB.getCart();
        const item = cart.find((i) => i.id === id);
        const next = Math.max(1, (Number(item?.qty) || 1) - 1);
        window.WB.setQuantity(id, next);
        renderCart();
        return;
      }
      const plus = e.target.closest("[data-qty-plus]");
      if (plus) {
        const id = plus.getAttribute("data-qty-plus");
        const cart = window.WB.getCart();
        const item = cart.find((i) => i.id === id);
        const next = Math.min(99, (Number(item?.qty) || 1) + 1);
        window.WB.setQuantity(id, next);
        renderCart();
      }
    });

    document.addEventListener("change", (e) => {
      const input = e.target.closest("[data-qty-input]");
      if (!input) return;
      const id = input.getAttribute("data-qty-input");
      const next = Number(String(input.value).replace(/[^\d]/g, "")) || 1;
      window.WB.setQuantity(id, next);
      renderCart();
    });

    const checkoutBtn = document.querySelector("#checkoutBtn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", (e) => {
        const cart = window.WB.getCart();
        if (!cart.length) {
          e.preventDefault();
          window.WB.showToast("Your cart is empty.");
        }
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();

