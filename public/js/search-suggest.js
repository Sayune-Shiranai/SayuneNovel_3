document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.querySelector(".search-input");
  const suggestionList = document.querySelector("#suggestion-list");

  if (!searchInput || !suggestionList) return;

  searchInput.addEventListener("input", async function () {
    const keyword = this.value.trim();

    if (!keyword) {
      suggestionList.innerHTML = "";
      return;
    }

    const res = await fetch(
      `/api/search-suggest?keyword=${encodeURIComponent(keyword)}`
    );
    const data = await res.json();

    suggestionList.innerHTML = data
      .map(
        (item) => `<li><a href="/book/${item.slug}">${item.itemname}</a></li>`
      )
      .join("");
  });
});

//fix         (item) => `<li><a href="/book/${item.slug}">${item.itemname}</a></li>`
