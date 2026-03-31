(function () {
  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function unique(values) {
    return Array.from(new Set(values)).sort();
  }

  function buildOptions(select, list, placeholder) {
    select.innerHTML = "";
    const ph = document.createElement("option");
    ph.value = "";
    ph.textContent = placeholder;
    select.appendChild(ph);
    for (const item of list) {
      const opt = document.createElement("option");
      opt.value = item;
      opt.textContent = item;
      select.appendChild(opt);
    }
  }

  function productCard(product) {
    const badge = product.badge ? `<div class="badge-premium ${product.badge.toLowerCase().includes("choice") ? "choice" : ""}">${product.badge}</div>` : "";
    return `
      <article class="card product-card">
        ${badge}
        <div class="product-media">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
        <div class="card-pad">
          <div class="pill">${product.size} • ${product.type}</div>
          <h3 class="product-name">${product.name}</h3>
          ${window.WB.renderStars(product.rating, product.reviews)}
          ${window.WB.renderPrice(product.price)}
          ${window.WB.renderSwatches(product.id, product.colors)}
          <div class="card-actions">
            <a class="btn btn-ghost" href="product.html?id=${encodeURIComponent(product.id)}">Details</a>
            <button class="btn btn-primary" data-add-to-cart="${product.id}">Add to Cart</button>
          </div>
        </div>
      </article>
    `;
  }

  function render(products) {
    const grid = document.querySelector("#productGrid");
    const empty = document.querySelector("#emptyState");
    if (!grid) return;

    if (!products.length) {
      grid.innerHTML = "";
      if (empty) empty.style.display = "block";
      return;
    }
    if (empty) empty.style.display = "none";
    grid.innerHTML = products.map(productCard).join("");
  }

  function readStateFromUrl() {
    const params = new URLSearchParams(location.search);
    return {
      q: params.get("q") || "",
      size: params.get("size") || "",
      type: params.get("type") || "",
      sort: params.get("sort") || "featured"
    };
  }

  function writeStateToUrl(state) {
    const params = new URLSearchParams();
    if (state.q) params.set("q", state.q);
    if (state.size) params.set("size", state.size);
    if (state.type) params.set("type", state.type);
    if (state.sort && state.sort !== "featured") params.set("sort", state.sort);

    const next = `${location.pathname}?${params.toString()}`.replace(/\?$/, "");
    history.replaceState({}, "", next);
  }

  function sortProducts(list, sortBy) {
    const items = list.slice();
    switch (sortBy) {
      case "price-asc":
        return items.sort((a, b) => a.price - b.price);
      case "price-desc":
        return items.sort((a, b) => b.price - a.price);
      case "rating-desc":
        return items.sort((a, b) => b.rating - a.rating);
      case "name-asc":
        return items.sort((a, b) => a.name.localeCompare(b.name));
      case "featured":
      default:
        return items; // keep original order
    }
  }

  function init() {
    const products = window.PRODUCTS || [];
    const searchInput = document.querySelector("#filterSearch");
    const sizeSel = document.querySelector("#filterSize");
    const typeSel = document.querySelector("#filterType");
    const sortSel = document.querySelector("#sortBy");
    const resetBtn = document.querySelector("#filtersReset");

    if (!searchInput || !sizeSel || !typeSel || !sortSel) return;

    buildOptions(sizeSel, unique(products.map((p) => p.size)), "All sizes");
    buildOptions(typeSel, unique(products.map((p) => p.type)), "All types");

    const initial = readStateFromUrl();
    searchInput.value = initial.q;
    sizeSel.value = initial.size;
    typeSel.value = initial.type;
    sortSel.value = initial.sort;

    function apply() {
      const q = normalize(searchInput.value);
      const size = sizeSel.value;
      const type = typeSel.value;
      const sort = sortSel.value || "featured";

      const filtered = products.filter((p) => {
        const matchesSize = !size || p.size === size;
        const matchesType = !type || p.type === type;
        const hay = normalize(`${p.name} ${p.type} ${p.size}`);
        const matchesQuery = !q || hay.includes(q);
        return matchesSize && matchesType && matchesQuery;
      });

      writeStateToUrl({ q, size, type, sort });
      render(sortProducts(filtered, sort));
    }

    sizeSel.addEventListener("change", apply);
    typeSel.addEventListener("change", apply);
    sortSel.addEventListener("change", apply);
    searchInput.addEventListener("input", () => {
      window.clearTimeout(searchInput._t);
      searchInput._t = window.setTimeout(apply, 120);
    });
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        searchInput.value = "";
        sizeSel.value = "";
        typeSel.value = "";
        sortSel.value = "featured";
        apply();
      });
    }

    apply();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
