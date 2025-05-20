document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("light-dark-mode").addEventListener("click", () => {
    const html = document.documentElement;
    const theme = html.getAttribute("data-bs-theme");
    html.setAttribute("data-bs-theme", theme === "dark" ? "light" : "dark");
  });
});
