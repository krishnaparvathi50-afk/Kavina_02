(function () {
  const CART_KEY = "wb_cart";
  const THEME_KEY = "wb_theme";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function formatMoney(value) {
    return `$${Number(value).toFixed(2)}`;
  }

  function getCart() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartBadge();
  }

  function findProduct(productId) {
    const list = window.PRODUCTS || [];
    return list.find((p) => p.id === productId) || null;
  }

  function addToCart(productId, quantity) {
    const qty = Math.max(1, Number(quantity || 1));
    if (!findProduct(productId)) return;

    const cart = getCart();
    const existing = cart.find((i) => i.id === productId);
    if (existing) existing.qty += qty;
    else cart.push({ id: productId, qty });
    saveCart(cart);
    showToast("Added to cart.");
  }

  function removeFromCart(productId) {
    const cart = getCart().filter((i) => i.id !== productId);
    saveCart(cart);
  }

  function setQuantity(productId, quantity) {
    const qty = Math.max(1, Math.min(99, Number(quantity || 1)));
    const cart = getCart();
    const item = cart.find((i) => i.id === productId);
    if (!item) return;
    item.qty = qty;
    saveCart(cart);
  }

  function cartCount() {
    return getCart().reduce((sum, i) => sum + (Number(i.qty) || 0), 0);
  }

  function cartTotals() {
    const cart = getCart();
    let subtotal = 0;
    for (const item of cart) {
      const product = findProduct(item.id);
      if (!product) continue;
      subtotal += product.price * (Number(item.qty) || 0);
    }
    return { subtotal };
  }

  function updateCartBadge() {
    const badge = $("#cartCount");
    if (!badge) return;
    const count = cartCount();
    badge.textContent = String(count);
    badge.style.display = count > 0 ? "grid" : "none";
  }

  function setActiveNav() {
    const path = (location.pathname || "").split("/").pop() || "index.html";
    document.querySelectorAll("[data-nav]").forEach((a) => {
      const target = a.getAttribute("href");
      if (!target) return;
      const isActive = target === path || (path === "" && target === "index.html");
      a.classList.toggle("active", isActive);
      if (isActive) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  function setYear() {
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
    const label = $("#themeLabel");
    if (label) label.textContent = theme === "dark" ? "Dark" : "Light";
  }

  function initThemeToggle() {
    const saved = localStorage.getItem(THEME_KEY);
    const preferred =
      saved ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyTheme(preferred);

    const btn = $("#themeToggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
      applyTheme(current === "dark" ? "light" : "dark");
    });
  }

  function initMobileMenu() {
    const header = document.querySelector(".nav");
    const menuBtn = $("#menuToggle");
    const nav = $("#primaryNav");
    if (!header || !menuBtn || !nav) return;

    function close() {
      header.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }

    function toggle() {
      const isOpen = header.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
    }

    menuBtn.addEventListener("click", toggle);

    nav.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]");
      if (!link) return;
      close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    document.addEventListener("click", (e) => {
      if (!header.classList.contains("open")) return;
      if (e.target.closest(".nav")) return;
      close();
    });
  }

  function showToast(message) {
    const toast = $("#toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => toast.classList.remove("show"), 1700);
  }

  function wireGlobalAddToCart() {
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-add-to-cart]");
      if (!btn) return;
      const productId = btn.getAttribute("data-add-to-cart");
      addToCart(productId, 1);
    });
  }

  function renderStars(rating, count) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    let html = '<div class="stars-mini">';
    for (let i = 0; i < 5; i++) {
       if (i < full) html += "★";
       else if (i === full && half) html += "☆"; // Simplified for demo, could use a half-star char if available
       else html += "☆";
    }
    html += '</div>';
    if (count !== undefined) {
      html += `<span class="review-count">${count.toLocaleString()}</span>`;
    }
    return `<div class="rating-row">${html}</div>`;
  }

  function renderPrice(price) {
    const parts = Number(price).toFixed(2).split(".");
    return `
      <div class="price-row">
        <div class="price-main">
          <span class="price-symbol">$</span>${parts[0]}<span class="price-symbol">${parts[1]}</span>
        </div>
      </div>
    `;
  }

  function renderSwatches(productId, colors) {
    if (!colors || !colors.length) return "";
    return `
      <div class="swatches" data-product-swatches="${productId}">
        ${colors.map((c, i) => `
          <div class="swatch ${i === 0 ? "active" : ""}" data-color="${c}" title="Change color">
            <div class="swatch-inner" style="background-color: ${c}"></div>
          </div>
        `).join("")}
      </div>
    `;
  }

  function initSwatchListeners() {
    document.addEventListener("click", (e) => {
      const swatch = e.target.closest(".swatch");
      if (!swatch) return;
      
      const parent = swatch.closest(".swatches");
      const card = swatch.closest(".product-card") || swatch.closest(".details");
      if (!parent || !card) return;

      // Update active state
      parent.querySelectorAll(".swatch").forEach(s => s.classList.remove("active"));
      swatch.classList.add("active");

      // Apply color filter logic (simplified hue-rotate for demo)
      const img = card.querySelector("img");
      if (!img) return;
      
      const color = swatch.getAttribute("data-color");
      // Map colors to hue-rotate values for a "wow" effect without actual assets
      const hueMap = {
        "#ffffff": "0deg",
        "#22c3ff": "180deg",
        "#0f172a": "220deg",
        "#7dffbd": "120deg",
        "#ff7dbd": "300deg",
        "#f59e0b": "45deg",
        "#ef4444": "0deg",
        "#475569": "200deg",
        "#15803d": "100deg"
      };
      const hue = hueMap[color] || "0deg";
      img.style.filter = `drop-shadow(0 16px 18px rgba(15,23,42,.18)) hue-rotate(${hue})`;
    });
  }

  window.WB = {
    $,
    formatMoney,
    getCart,
    saveCart,
    findProduct,
    addToCart,
    removeFromCart,
    setQuantity,
    cartTotals,
    updateCartBadge,
    showToast,
    renderStars,
    renderPrice,
    renderSwatches
  };

  document.addEventListener("DOMContentLoaded", () => {
    setActiveNav();
    setYear();
    initThemeToggle();
    initMobileMenu();
    updateCartBadge();
    wireGlobalAddToCart();
    initSwatchListeners();
  });
})();
