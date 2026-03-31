(function () {
  function getId() {
    const params = new URLSearchParams(location.search);
    return params.get("id");
  }

  function renderStars(rating) {
    const full = Math.round(rating);
    const filled = "★★★★★".slice(0, Math.max(0, Math.min(5, full)));
    const empty = "☆☆☆☆☆".slice(0, 5 - Math.max(0, Math.min(5, full)));
    return filled + empty;
  }

  function renderReviewList(reviews) {
    if (!reviews || !reviews.length) return "<p class='muted'>No reviews yet.</p>";
    return reviews.map(r => `
      <div class="review-card">
        <div class="review-user">
          <div class="review-user-img">${r.name.charAt(0)}</div>
          <span>${r.name}</span>
        </div>
        <div style="display:flex; align-items:center; gap:.5rem; margin-bottom:.2rem">
          ${window.WB.renderStars(r.rating)}
          <span style="font-weight:700; font-size:.9rem">Highly recommended</span>
        </div>
        <div class="muted" style="font-size:.85rem; margin-bottom:.4rem">Reviewed on ${r.date}</div>
        ${r.verified ? '<div class="verified">Verified Purchase</div>' : ""}
        <p style="margin:.5rem 0">${r.comment}</p>
        <div style="display:flex; gap:.8rem; font-size:.85rem; color:var(--muted)">
          <span>Helpful | Report</span>
        </div>
      </div>
    `).join("");
  }

  function renderRatingBars(rating, count) {
    // Mock distribution
    const dist = [70, 15, 10, 3, 2]; 
    return `
      <div style="margin-top:1rem">
        ${dist.map((p, i) => `
          <div style="display:flex; align-items:center; gap:.8rem; margin-bottom:.3rem; font-size:.85rem">
            <span style="width:50px">${5-i} star</span>
            <div style="flex:1; height:20px; background:#eee; border-radius:4px; overflow:hidden; border:1px solid #ddd">
              <div style="width:${p}%; height:100%; background:#ffa41c"></div>
            </div>
            <span style="width:35px; text-align:right">${p}%</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  function init() {
    const id = getId();
    const product = id ? window.WB.findProduct(id) : null;

    const mount = document.querySelector("#productDetails");
    const missing = document.querySelector("#missingProduct");
    if (!mount) return;

    if (!product) {
      mount.innerHTML = "";
      if (missing) missing.style.display = "block";
      return;
    }
    if (missing) missing.style.display = "none";

    mount.innerHTML = `
      <div class="details">
        <div class="details-media">
          <img src="${product.image}" alt="${product.name}" id="mainProductImg">
        </div>
        <div class="card">
          <div class="card-pad">
            <div class="pill">${product.size} • ${product.type}</div>
            <h2 class="mt-0" style="font-size:1.8rem; margin-bottom:.4rem">${product.name}</h2>
            ${window.WB.renderStars(product.rating, product.reviews)}
            <div class="divider"></div>
            ${window.WB.renderPrice(product.price)}
            <p class="muted">Free returns & fast delivery available.</p>
            
            <div style="margin:1.5rem 0">
              <span style="font-weight:700">Category:</span> ${product.type}
            </div>

            <div style="margin:1.5rem 0">
              <span style="font-weight:700">Select Color:</span>
              ${window.WB.renderSwatches(product.id, product.colors)}
            </div>

            <h3 style="margin:1.5rem 0 .5rem">About this item</h3>
            <ul class="feature-list" style="margin-bottom:1.5rem">
              ${product.features.map((f) => `<li>${f}</li>`).join("")}
            </ul>

            <div class="card-actions" style="margin-top:2rem; flex-direction:column">
              <button class="btn btn-primary" data-add-to-cart="${product.id}" style="width:100%; border-radius:8px; padding:1rem">Add to Cart</button>
              <button class="btn btn-ghost" style="width:100%; border-radius:8px; padding:1rem; background:#ffa41c; color:#0f1111; border-color:#ffa41c">Buy Now</button>
            </div>
          </div>
        </div>
      </div>

      <div class="reviews-section">
        <div class="reviews-grid">
          <div>
            <h3 style="font-size:1.4rem; margin-bottom:.5rem">Customer Reviews</h3>
            ${window.WB.renderStars(product.rating)}
            <div style="font-size:1.1rem; font-weight:700; margin-top:.3rem">${product.rating} out of 5</div>
            <div class="muted" style="font-size:.9rem">${product.reviews.toLocaleString()} global ratings</div>
            ${renderRatingBars(product.rating, product.reviews)}
          </div>
          <div>
            <h3 style="font-size:1.2rem; margin-bottom:1.2rem">Top reviews from customers</h3>
            ${renderReviewList(window.REVIEWS)}
          </div>
        </div>
      </div>
    `;
  }

  document.addEventListener("DOMContentLoaded", init);
})();

