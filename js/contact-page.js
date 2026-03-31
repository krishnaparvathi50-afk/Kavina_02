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

  function init() {
    const form = document.querySelector("#contactForm");
    if (!form) return;

    const name = form.querySelector("#cName");
    const email = form.querySelector("#cEmail");
    const message = form.querySelector("#cMessage");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;

      if (String(name.value || "").trim().length < 2) {
        ok = false;
        setError(name, "Please enter your name.");
      } else setError(name, "");

      if (!isEmail(email.value)) {
        ok = false;
        setError(email, "Please enter a valid email.");
      } else setError(email, "");

      if (String(message.value || "").trim().length < 10) {
        ok = false;
        setError(message, "Message should be at least 10 characters.");
      } else setError(message, "");

      if (!ok) return;
      form.reset();
      window.WB.showToast("Message sent (demo). We’ll reply soon!");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();

