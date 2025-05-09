document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("topbar-toggle-menu");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      const html = document.documentElement;
      const currentSize = html.getAttribute("data-sidebar-size");

      html.setAttribute(
        "data-sidebar-size",
        currentSize === "condensed" ? "default" : "condensed"
      );
    });
  }
});
