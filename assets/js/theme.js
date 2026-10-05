(function () {
  var root = document.documentElement;

  // Theme toggle
  var btn = document.querySelector(".theme-toggle");
  if (btn) {
    btn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      var next = current === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
    });
  }

  // Notes topic filter
  var chips = document.querySelectorAll(".chip[data-filter]");
  var items = document.querySelectorAll(".notes-list li[data-topic]");
  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      chips.forEach(function (c) { c.setAttribute("aria-pressed", c === chip ? "true" : "false"); });
      items.forEach(function (li) {
        li.hidden = !(f === "all" || li.getAttribute("data-topic") === f);
      });
    });
  });
})();
