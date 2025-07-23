module.exports = async function (fastifyApp, options) {
  fastifyApp.get("/search", async function (req, rep) {
    const keyword = req.query.keyword?.trim(); // .trim() bỏ khoảng trắng đầu và cuối

    let searchResults = [];

    if (keyword) {
      // Tìm truyện có tên chứa keyword (dùng $regex)
      searchResults = await this.mongo.db
        .collection("Libary")
        .find({ itemname: { $regex: keyword, $options: "i" } })
        .toArray();
    }

    rep.render("search", {
      search: searchResults,
      keyword,
      partial: "search",
    });

    return rep;
  });
};
