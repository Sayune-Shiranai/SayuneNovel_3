document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-input");
  const suggestionList = document.querySelector("#suggestion-list");

  if (!searchInput || !suggestionList) return;

  searchInput.addEventListener("input", async function () {
    const keyword = this.value.trim();

    if (!keyword) {
      suggestionList.style.display = "none";
      suggestionList.innerHTML = "";
      return;
    }

    const res = await fetch(
      `/search-suggest?keyword=${encodeURIComponent(keyword)}`
    );
    const data = await res.json();

    if (data.length === 0) {
      suggestionList.style.display = "none";
      suggestionList.innerHTML = "";
      return;
    }

    suggestionList.innerHTML = data
      .map(
        (item) => `<li><a href="/truyen/${item.slug}">${item.itemname}</a></li>`
      )
      .join("");

    suggestionList.style.display = "block";
  });

  // Ẩn gợi ý khi click ngoài
  document.addEventListener("click", function (e) {
    if (!suggestionList.contains(e.target) && e.target !== input) {
      suggestionList.style.display = "none";
    }
  });
});
